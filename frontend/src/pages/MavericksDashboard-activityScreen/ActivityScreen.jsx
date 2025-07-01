import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ActivityProgress from "../../components/activity-progress/ActivityProgress";
import QuestionCard from "../../components/question-card/QuestionCard";
import "./ActivityScreen.css";

const ActivityScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activityId, questions } = location.state;
  console.log("➡️ Got activityId:", activityId);
  console.log("➡️ Got questions:", questions);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(questions.map(q => ({ ...q, user_answer: "" })));

  const updateAnswer = (index, userAnswer) => {
    const updated = [...answers];
    updated[index].user_answer = userAnswer;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (!window.confirm("Submit your answers? You cannot change after submission!")) return;

    try {
      const res = await fetch("http://localhost:3000/api/quiz/submit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId,
          answers: answers.map(q => ({
            question: q.question,
            correct_answer: q.correct_answer,
            user_answer: q.user_answer
          }))
        })
      });
      const result = await res.json();
      alert(`✅ Submitted! Your score: ${result.score}%`);
      navigate("/maverick-dashboard");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit.");
    }
  };

  return (
    <div className="activity-screen">
      <ActivityProgress questions={answers} />

      <QuestionCard
        question={answers[currentQ]}
        index={currentQ}
        onAnswer={(answer) => updateAnswer(currentQ, answer)}
      />

      <div className="activity-controls">
        <button disabled={currentQ === 0} onClick={() => setCurrentQ(prev => prev - 1)}>⬅️ Prev</button>
        <button disabled={currentQ === answers.length - 1} onClick={() => setCurrentQ(prev => prev + 1)}>Next ➡️</button>
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default ActivityScreen;
