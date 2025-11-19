from transformers import pipeline


def generate_summary(prompt:str)-> dict:
    model = pipeline(task="summarization", model="facebook/bart-large-cnn")
    summary = model(prompt, max_length=130, min_length=30, do_sample=False)
    return {"summary_text": summary[0]['summary_text']}
