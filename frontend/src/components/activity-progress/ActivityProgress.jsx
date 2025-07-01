import "./ActivityProgress.css";

const ActivityProgress = ({ questions }) => {
  const answered = questions.filter(q => q.user_answer.trim() !== "").length;
  const total = questions.length;

  return (
    <div className="activity-progress">
      <p>📊 Questions: {answered}/{total} answered, {total - answered} left</p>
    </div>
  );
};

export default ActivityProgress;
