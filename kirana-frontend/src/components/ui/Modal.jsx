export default function Modal({ title, onClose, children, wide }) {
  return (
    <div className="overlay" onMouseDown={onClose}>
      <div className={wide ? 'modal modal-wide' : 'modal'} onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button type="button" className="link-btn" onClick={onClose}>Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}
