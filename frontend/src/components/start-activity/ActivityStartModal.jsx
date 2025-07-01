import { Modal, Button } from "react-bootstrap";

const ActivityStartModal = ({ show, onClose, onConfirm, activityTitle }) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Start Activity</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>Do you want to start <strong>{activityTitle}</strong> now?</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button variant="primary" onClick={onConfirm}>Yes, Start</Button>
    </Modal.Footer>
  </Modal>
);

export default ActivityStartModal;
