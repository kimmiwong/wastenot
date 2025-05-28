const ShelfLifeModal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="shelflife-overlay">
      <div className="shelflife-content">
        <button className="shelflife-close" onClick={closeModal}>✕</button>
        {children}
      </div>
    </div>
  );
};

export default ShelfLifeModal;
