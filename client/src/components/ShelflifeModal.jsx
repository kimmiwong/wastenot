const EditModal = ({ isOpen, closeModal, children }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>✕</button>
            {children}
          </div>
        </div>
      );
    };

    export default EditModal;
