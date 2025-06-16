from fastapi import FastAPI
from agents.quiz import generate_quiz_questions
from agents.training import generate_training_path
from pydantic import BaseModel

app = FastAPI()

class QuizRequest(BaseModel):
    subject: str
    difficulty: str
    num_questions: int

class TrainingRequest(BaseModel):
    subject: str
    difficulty: str
    num_days: int

@app.get("/")
def root():
    return {"message": "Mavericks AI server running"}

@app.post("/quiz")
def quiz(req: QuizRequest):
    return {"quiz": generate_quiz_questions(req.subject, req.difficulty, req.num_questions)}

@app.post("/training")
def training(req: TrainingRequest):
    return {"plan": generate_training_path(req.subject, req.difficulty, req.num_days)}