import "./QuestionCard.css";

const QuestionCard = ({ question, index, onAnswer }) => {
  return (
    <div className="question-card">
      <h4>Question {index + 1}</h4>
      <p>{question.question}</p>
      <textarea
        value={question.user_answer || ""}
        onChange={(e) => onAnswer(e.target.value)}
        placeholder="Your answer here..."
      ></textarea>
    </div>
  );
};

export default QuestionCard;
