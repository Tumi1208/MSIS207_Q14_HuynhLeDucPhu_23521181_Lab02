/** @jsx createElement */
import { createElement, useState, VNode, ComponentProps } from './jsx-runtime';

// Reusable Button component
interface ButtonProps extends ComponentProps {
  onClick?: (event: MouseEvent) => void;
  className?: string;
  disabled?: boolean;
}

const Button = ({ children, onClick, className, disabled }: ButtonProps): VNode => (
  <button onClick={onClick} className={`btn ${className || ''}`} disabled={disabled}>
    {children}
  </button>
);

// Counter component props
interface CounterProps extends ComponentProps {
  initialCount?: number;
}

// The main Counter component
export const Counter = ({ initialCount = 0 }: CounterProps): VNode => {
  // Initialize state using our useState hook
  const [count, setCount] = useState(initialCount);

  // Event handlers
  const increment = () => setCount(prevCount => prevCount + 1);
  const decrement = () => setCount(prevCount => prevCount - 1);
  const reset = () => setCount(initialCount);

  // Return the JSX structure
  return (
    <div className="counter app-widget">
      <h1>Counter</h1>
      <h2>Count: {count()}</h2>
      <div className="buttons">
        <Button onClick={increment} className="btn-inc">+</Button>
        <Button onClick={decrement} className="btn-dec">-</Button>
        <Button onClick={reset} className="btn-reset">Reset</Button>
      </div>
    </div>
  );
};