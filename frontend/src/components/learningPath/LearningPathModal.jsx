import { Modal, Button } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import "./LearningPathModal.css";

const LearningPathModal = ({ show, onClose, data }) => {
  const dayWisePlan = data?.day_wise_plan;

  return (
    <AnimatePresence>
      {show && (
        <Modal
          show={show}
          onHide={onClose}
          size="lg"
          centered
          backdrop="static"
          dialogClassName="custom-modal"
        >
          <motion.div
            className="learning-modal-content"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="modal-header-custom">
              <button className="back-button" onClick={onClose}>
                <FaArrowLeft size={18} />
              </button>
              <h4 className="modal-title-custom">📘 Learning Path Overview</h4>
            </div>

            <div className="modal-body-scrollable">
              {!dayWisePlan ? (
                <p className="loading-text">⏳ Loading learning path...</p>
              ) : (
                dayWisePlan.map((day) => (
                  <motion.div
                    key={day.day}
                    className="day-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: day.day * 0.03 }}
                  >
                    <h5 className="day-heading">
                      <span className="day-label">Day {day.day}:</span>{" "}
                      {day.topic_title}
                    </h5>
                    {day.date && (
                        <span className="start-date">
                        📅 {" "}
                        {new Date(day.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}
                        </span>
                    )}

                    <p className="description">{day.description}</p>

                    {day.online_activities?.length > 0 && (
                      <>
                        <strong>🧠 On platform Activities:</strong>
                        <ul>
                          {day.online_activities.map((act, i) => (
                            <li key={i}>
                              <b>{act.type}</b>: {act.title} – {act.details}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {day.offline_activities?.length > 0 && (
                      <>
                        <strong>🎓 In Batch Activities:</strong>
                        <ul>
                          {day.offline_activities.map((act, i) => (
                            <li key={i}>
                              <b>{act.type}</b>: {act.trainer_notes}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            <div className="modal-footer-custom">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default LearningPathModal;
