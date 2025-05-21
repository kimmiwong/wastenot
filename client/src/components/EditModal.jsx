const EditModal = ({ children, onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={onClose}>✕</button>
            {children}
          </div>
        </div>
      );
    };

    export default EditModal;
