from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import io
import re
from typing import List
from transformers import pipeline

app = FastAPI(title="Learnix PDF Processor", version="1.0.0")

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React/Vite dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Predefined topics/interests to detect
TOPICS = [
    "artificial intelligence", "ai", "machine learning", "ml", "deep learning",
    "web development", "frontend", "backend", "javascript", "python", "react",
    "data science", "statistics", "database", "sql", "computer vision",
    "natural language processing", "nlp", "cybersecurity", "blockchain",
    "mobile development", "android", "ios", "cloud computing", "aws", "azure",
    "devops", "docker", "kubernetes", "algorithms", "data structures",
    "software engineering", "programming", "coding", "mathematics", "calculus",
    "linear algebra", "physics", "chemistry", "biology", "business", "marketing",
    "finance", "economics", "design", "ui", "ux", "graphics", "networking"
]

def extract_text_from_pdf(pdf_content: bytes) -> str:
    """Extract text content from PDF bytes."""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract text from PDF: {str(e)}")

def generate_summary(prompt: str) -> dict:
    """Generate a summary using BART model from Transformers."""
    try:
        model = pipeline(task="summarization", model="facebook/bart-large-cnn")
        # Truncate text if too long for the model (BART has max input length)
        max_input_length = 4000
        if len(prompt) > max_input_length:
            prompt = prompt[:max_input_length]
        
        summary = model(prompt, max_length=4000, min_length=30, do_sample=False)
        return {"summary_text": summary[0]['summary_text']}
    except Exception as e:
        # Fallback to simple summary if model fails
        sentences = re.split(r'[.!?]+', prompt)
        simple_summary = ""
        for sentence in sentences:
            sentence = sentence.strip()
            if len(simple_summary + sentence) < 200 and sentence:
                simple_summary += sentence + ". "
            else:
                break
        
        if not simple_summary:
            simple_summary = prompt[:200] + "..." if len(prompt) > 200 else prompt
            
        return {"summary_text": simple_summary.strip()}

def detect_topics(text: str) -> List[str]:
    """Detect relevant topics/interests from the text content."""
    text_lower = text.lower()
    detected = []
    
    for topic in TOPICS:
        if topic.lower() in text_lower:
            # Normalize topic names for consistency
            normalized_topic = topic.replace("artificial intelligence", "AI").replace("machine learning", "ML")
            if normalized_topic not in detected:
                detected.append(normalized_topic)
    
    # Limit to top 5 most relevant topics
    return detected[:5]

@app.get("/")
async def root():
    return {"message": "Learnix PDF Processor API", "status": "running"}

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Process uploaded PDF and return summary with detected topics."""
    
    # Validate file type
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    try:
        # Read PDF content
        pdf_content = await file.read()
        
        # Extract text from PDF
        text = extract_text_from_pdf(pdf_content)
        
        if not text or len(text.strip()) < 10:
            raise HTTPException(status_code=400, detail="PDF appears to be empty or contains no readable text")
        
        # Generate summary using BART model
        summary_result = generate_summary(text)
        summary = summary_result["summary_text"]
        
        # Detect topics/interests
        topics = detect_topics(text)
        
        return {
            "summary": summary,
            "topics": topics,
            "text_length": len(text),
            "filename": file.filename
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)