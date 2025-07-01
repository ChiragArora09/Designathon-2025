import { useEffect, useState } from "react";
import axios from "axios";
import "./MaverickDashboard.css";
import { ProgressBar } from "react-bootstrap";
import { FaBookOpen, FaCheckCircle, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext'

import ActivityStartModal from "../start-activity/ActivityStartModal";

const MaverickDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [today, setToday] = useState({});
  const [progress, setProgress] = useState(0);
  const [learningPath, setLearningPath] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "http://localhost:3000/api";

  useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const userRes = await axios.get("/maverick/me");
      setUser(userRes.data);

      const todayRes = await axios.get(`/maverick/${userRes.data.id}/today`);
      setToday(todayRes.data);

      const pathRes = await axios.get(`/maverick/${userRes.data.id}/learning-path`);
      setLearningPath(pathRes.data.day_wise_plan || []);

      // Split quizzes vs assignments
      const quizzesArr = [];
      const assignmentsArr = [];

      pathRes.data.day_wise_plan?.forEach(day => {
        day.online_activities?.forEach(act => {
          if (act.type === "quiz") {
            quizzesArr.push({ ...act, day: day.day });
          } else if (act.type === "assignment") {
            assignmentsArr.push({ ...act, day: day.day });
          }
        });

        day.offline_activities?.forEach(act => {
          if (act.type === "quiz") {
            quizzesArr.push({ ...act, day: day.day });
          } else if (act.type === "assignment") {
            assignmentsArr.push({ ...act, day: day.day });
          }
        });
      });

      setQuizzes(quizzesArr);
      setAssignments(assignmentsArr);

      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  const handleActivityClick = (activity) => {
    console.log("Clicked activity:", activity);
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const handleConfirmStart = async () => {
    if (!selectedActivity) return;
    console.log("Selected Activity:", selectedActivity)
    setShowModal(false);

    const res = await axios.post("/quiz/generate", {
      maverickId: user.id,
      activityId: selectedActivity.id,
      topicTitle: selectedActivity.title || selectedActivity.trainer_notes,
      activityType: selectedActivity.type || selectedActivity.activity_type
    });

    console.log(res.data)

    navigate("/activity", {
      state: {
        activityId: res.data.activityId,
        questions: res.data.questions
      }
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
    <div className="dashboard-navbar">
      <div className="user-info">
        <div>
          <h2>Hi, {user.full_name || "Maverick"} 👋</h2>
        </div>
      </div>
      <button className="logout-icon" onClick={handleLogout} title="Logout">
        <FaSignOutAlt size={24} />
      </button>
    </div>
    <div className="maverick-dashboard-grid">
      {/* ✅ LEFT: Entire Learning Path */}
      <div className="left-panel">
        <h3>📘 Full Learning Path</h3>
        <div className="learning-path-list">
          {learningPath.length > 0 ? (
            learningPath.map(day => (
              <div key={day.day} className={`day-card ${day.day === today.day ? 'current-day' : ''}`}>
                {/* <h5>Day {day.day}: {day.topic_title}</h5> */}
                <h5>Module {day.day}: {day.topic_title}</h5>
                <p>{day.description}</p>
              </div>
            ))
          ) : (
            <p>No learning path found.</p>
          )}
        </div>
      </div>

      {/* ✅ MIDDLE: Your existing dashboard */}
      <div className="center-panel">
        <div className="progress-section">
          <h4>Overall Progress</h4>
          <ProgressBar now={progress} label={`${progress}%`} />
        </div>

        <div className="today-plan">
          <h3>📅 Today’s Plan</h3>
          {today.topic_title ? (
            <div className="plan-card">
              <h4>Day {today.day}: {today.topic_title}</h4>
              <p>{today.description}</p>

              {today.online_activities?.length > 0 && (
                <>
                  <strong>🧠 Activities:</strong>
                  <ul>
                    {today.online_activities.map((act, i) => (
                      <li key={i}>{act.title}</li>
                    ))}
                  </ul>
                </>
              )}

              {today.offline_activities?.length > 0 && (
                <>
                  <strong>🎓 Also learn:</strong>
                  <ul>
                    {today.offline_activities.map((act, i) => (
                      <li key={i}>{act.type}: {act.trainer_notes}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ) : (
            <p>🎉 You have completed all tasks for today!</p>
          )}
        </div>

        <div className="learning-summary">
          <h4><FaBookOpen /> Learning Path</h4>
          <p>Current Phase: {user.phase_type || "N/A"}</p>
          <p>Batch: {user.batch_name || "N/A"}</p>
        </div>
      </div>

      {/* ✅ RIGHT: Quizzes and Assignments with completion flag */}
      <div className="right-panel">
        <h3>✅ Quizzes</h3>
        <div className="activities-list">
          {quizzes.length > 0 ? (
            quizzes.map((quiz, i) => (
              <div key={i} className="activity-card">
                <p onClick={() => handleActivityClick(quiz)}>
                  {quiz.completed ? (
                    <FaCheckCircle className="completed-icon" color="green" title="Completed" />
                  ) : (
                    <FaCheckCircle className="completed-icon" color="gray" title="Incomplete" />
                  )}{"   "}
                  {quiz.title}
                </p>
              </div>
            ))
          ) : (
            <p>No quizzes found.</p>
          )}
        </div>

        <h3>📄 Assignments</h3>
        <div className="activities-list">
          {assignments.length > 0 ? (
            assignments.map((assign, i) => (
              <div key={i} className="activity-card">
                <p onClick={() => handleActivityClick(assign)}>
                  {assign.completed ? (
                    <FaCheckCircle className="completed-icon" color="green" title="Completed" />
                  ) : (
                    <FaCheckCircle className="completed-icon" color="gray" title="Incomplete" />
                  )}{" "}
                  assignment: {assign.title || assign.trainer_notes}
                </p>
              </div>
            ))
          ) : (
            <p>No assignments found.</p>
          )}
        </div>
      </div>
      <ActivityStartModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmStart}
        activityTitle={selectedActivity?.title || selectedActivity?.trainer_notes}
      />


    </div>
    </>
  );
};

export default MaverickDashboard;
