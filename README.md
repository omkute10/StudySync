📚 Learnix
Never Study Alone Again.

Learnix is a comprehensive academic collaboration platform designed to connect students with AI-matched tutors, study buddies, and campus partners. It leverages the power of modern web technologies, local AI models for content summarization, and Generative AI for personalized assistance.

🚀 Features
🤖 AI-Powered Tools
PDF Summarizer: Upload study materials (PDFs) to get concise summaries and automatically detect key topics/interests using a backend-hosted Hugging Face model (facebook/bart-large-cnn).

Gemini AI Chat: An integrated chatbot powered by Google's Gemini API to answer academic questions and assist with study plans.

Tutor Matcher: AI analysis to calculate compatibility scores between students and tutors based on their profiles.

👥 Connectivity
Find Tutors: Browse expert tutors with filters for subject, rating, and availability.

Find Study Buddies: Connect with peers who share similar academic interests and study styles.

Campus Partners: Find partners for extracurricular activities like sports or clubs.

🔐 User Experience
Secure Authentication: Robust signup and login system powered by Firebase Authentication.

Multi-step Onboarding: A personalized signup flow to capture user demographics, roles (Student/Tutor), and academic interests.

Dashboard: A central hub managing upcoming schedules, messages, and quick actions.

Responsive Design: Fully responsive UI built with Tailwind CSS and a mobile-first approach.

🛠️ Tech Stack
Frontend
Framework: React (via Vite)

Language: TypeScript

Styling: Tailwind CSS

UI Components: Shadcn UI (based on Radix UI)

Icons: Lucide React

State/Data Fetching: TanStack Query

Routing: React Router DOM

AI Integration: Google Generative AI SDK

Backend
Framework: FastAPI

Language: Python

PDF Processing: PyPDF2

ML/NLP: transformers (Hugging Face), torch

Services & Infrastructure
Authentication & Database: Firebase (Auth & Firestore)

LLM Provider: Google Gemini API (Frontend), Hugging Face (Backend local inference)

📂 Project Structure
Plaintext

Learnix/
├── backend/                 # Python FastAPI Backend
│   ├── main.py              # API Endpoints (PDF upload, Topic detection)
│   ├── model.py             # ML Model logic (BART Summarization)
│   └── requirements.txt     # Python dependencies
├── src/                     # React Frontend
│   ├── components/          # Reusable UI components & Sections
│   │   ├── ui/              # Shadcn UI primitives
│   │   ├── GeminiChat.tsx   # AI Chat component
│   │   └── ...
│   ├── contexts/            # React Contexts (Auth, Signup state)
│   ├── hooks/               # Custom hooks (useGemini, useToast)
│   ├── lib/                 # Utility functions & Config (Firebase, Gemini)
│   ├── pages/               # Application Routes/Pages
│   │   ├── signup/          # Multi-step signup pages
│   │   ├── Dashboard.tsx    # Main user dashboard
│   │   └── ...
│   ├── App.tsx              # Main App component & Routing
│   └── main.tsx             # Entry point
├── .env.example             # Environment variable template
├── index.html               # HTML entry point
├── package.json             # Node dependencies
├── tailwind.config.ts       # Tailwind configuration
└── vite.config.ts           # Vite configuration
⚡ Getting Started
Prerequisites
Node.js (v18 or higher)

Python (v3.10 or higher)

Google Gemini API Key

Firebase Project (Configured with Auth and Firestore)

1. Clone the Repository
Bash

git clone https://github.com/yourusername/Learnix.git
cd Learnix
2. Backend Setup
The backend handles PDF parsing and heavy ML summarization tasks.

Bash

cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv
# Activate: source venv/bin/activate (Linux/Mac) or venv\Scripts\activate (Windows)

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
# OR using uvicorn directly: uvicorn main:app --reload
The backend will run on http://0.0.0.0:8000

3. Frontend Setup
Open a new terminal window for the frontend.

Bash

# Return to root directory if you are in backend/
cd ..

# Install Node dependencies
npm install

# Setup Environment Variables
# Create a .env file in the root directory based on .env.example
cp .env.example .env
Update .env with your keys:

Code snippet

VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
Note: Firebase configuration is currently located in src/lib/firebase.ts. Ensure your Firebase project settings match the config object there.

Bash

# Run the development server
npm run dev
The frontend will run on http://localhost:8080 (or similar port shown in terminal).

🖥️ Usage Guide
Sign Up: Create an account using the multi-step wizard. Choose your role (Student/Tutor) and select your academic interests.

Dashboard:

Upload PDF: Use the "Upload PDF" card to upload a syllabus or study notes. The Python backend will process it, providing a summary and detecting relevant topics.

AI Chat: Click "AI Chat" in the navbar to talk to the Gemini-powered assistant.

Schedule: View your upcoming study sessions.

Search: Use the search bar or quick action cards to find Tutors, Study Buddies, or Campus Partners using the filterable lists.

🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.

Create a new branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a Pull Request.

📄 License
Distributed under the MIT License.