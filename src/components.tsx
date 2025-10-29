/** @jsx createElement */
import { createElement, ComponentProps, VNode } from './jsx-runtime'; // Removed unused useState

/* --- Card Component --- */
interface CardProps extends ComponentProps {
  title?: string;
  className?: string;
  onClick?: (event: MouseEvent) => void;
}
export const Card = ({ title, children, className, onClick }: CardProps): VNode => (
  <div className={`card ${className || ''}`.trim()} onClick={onClick}>
    {title && <div className="card-title"><h2>{title}</h2></div>}
    <div className="card-content">
      {children}
    </div>
  </div>
);

/* --- Modal Component --- */
interface ModalProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}
export const Modal = ({ isOpen, onClose, title, children }: ModalProps): VNode | null => {
  if (!isOpen) {
    return null; // Don't render if not open
  }

  // Close modal if user clicks on the semi-transparent background
  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <header className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </header>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

/* --- Form Component --- */
interface FormProps extends ComponentProps {
  onSubmit: (e: Event) => void;
  className?: string;
}
export const Form = ({ onSubmit, children, className }: FormProps): VNode => {
  // Wrapper around HTML form to automatically prevent default submission
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form className={`form ${className || ''}`.trim()} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};

/* --- Input Component --- */
interface InputProps extends ComponentProps {
  type?: 'text' | 'password' | 'email' | 'number' | 'checkbox' | 'date';
  value: string | number | boolean;
  onInput?: (e: Event) => void; // Usually for text-like inputs
  onChange?: (e: Event) => void; // Usually for checkbox, select, date
  placeholder?: string;
  className?: string;
  checked?: boolean;
  id?: string;
  name?: string;
}
export const Input = ({ type = 'text', className, children, ...restProps }: InputProps): VNode => (
  // Simple wrapper around HTML input, passing through props
  <input
    type={type}
    className={`input ${className || ''}`.trim()}
    {...restProps} // Spread remaining props (value, onChange, checked, etc.)
  />
);