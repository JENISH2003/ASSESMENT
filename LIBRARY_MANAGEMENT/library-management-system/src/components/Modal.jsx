const Modal = ({ isOpen, onClose, children }) =>
  !isOpen ? null : (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-gray-500"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );

export default Modal;
