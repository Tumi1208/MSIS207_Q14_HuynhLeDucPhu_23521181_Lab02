// src/jsx-runtime.ts - Our Mini JSX Engine

/* --- Type Definitions --- */
export interface VNode {
  type: string | ComponentFunction;
  props: Record<string, any>;
  children: (VNode | string | number)[];
  key?: string | number;
}
export interface ComponentProps {
  children?: any; // Simpler children type for flexibility
  key?: string | number;
  [key: string]: any;
}
export type ComponentFunction = (props: ComponentProps) => VNode | null;

/* --- State Management System --- */
let rootComponent: (() => VNode | null) | null = null;
let rootContainer: HTMLElement | null = null;
let hookStates: any[] = []; // Renamed from stateSlots
let currentHookIndex: number = 0; // Renamed from currentStateIndex

// Re-renders the entire application
function renderApp() {
  currentHookIndex = 0; // Reset hook index before rendering
  if (rootComponent && rootContainer) {
    const newVNode = rootComponent();
    rootContainer.innerHTML = ''; // Simple diffing: clear and redraw
    if (newVNode) {
      const newDOM = renderToDOM(newVNode);
      rootContainer.appendChild(newDOM);
    }
  }
}

// Basic useState implementation (FIXED for lazy initializer)
export function useState<T>(initialValue: T | (() => T)): [() => T, (newValue: T | ((prev: T) => T)) => void] {
  const index = currentHookIndex; // Lấy index hiện tại

  // Khởi tạo state CHỈ MỘT LẦN ĐẦU TIÊN
  if (hookStates[index] === undefined) {
    // KIỂM TRA: Nếu initialValue là một HÀM, hãy GỌI nó để lấy giá trị.
    // Nếu không, dùng giá trị trực tiếp.
    hookStates[index] = typeof initialValue === 'function'
      ? (initialValue as () => T)() // Gọi hàm khởi tạo
      : initialValue;               // Dùng giá trị trực tiếp
  }

  // Hàm getter: Trả về state tại slot này
  const getter = (): T => hookStates[index];

  // Hàm setter: Cập nhật state và kích hoạt re-render
  const setter = (newValue: T | ((prev: T) => T)): void => {
    const currentState = hookStates[index];
    // Cho phép truyền hàm vào setter (vd: setCount(c => c + 1))
    const nextState = typeof newValue === 'function'
      ? (newValue as (prev: T) => T)(currentState)
      : newValue;

    if (nextState !== currentState) { // Chỉ re-render nếu state thực sự thay đổi
      hookStates[index] = nextState;
      renderApp(); // Gọi hàm render lại toàn bộ ứng dụng
    }
  };

  currentHookIndex++; // Tăng index cho lần gọi useState tiếp theo trong component
  return [getter, setter];
}


/* --- Core JSX Factory Functions --- */

// The function called by TypeScript/Vite for JSX tags
export function createElement(
  type: string | ComponentFunction,
  props: Record<string, any> | null,
  ...children: any[]
): VNode {
  const currentProps = props || {};

  // Process children: flatten, filter invalid values, ensure strings
  const processedChildren = children
    .flat()
    .filter(child => child !== null && child !== undefined && typeof child !== 'boolean')
    .map(child => (typeof child === 'object' ? child : String(child)));

  // Separate 'key' from other props
  const { key, ...otherProps } = currentProps;

  return { type, props: otherProps, children: processedChildren, key };
}

// The function called for <>...</> fragments
export function createFragment(
  props: Record<string, any> | null,
  ...children: any[]
): VNode {
  return createElement('fragment', props, ...children);
}

/* --- VNode to DOM Rendering Logic --- */

// Converts a VNode (or string/number) into a real DOM Node
export function renderToDOM(vnode: VNode | string | number): Node {
  // Handle primitives (text)
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  // Handle fragments by rendering children directly
  if (vnode.type === 'fragment') {
    const fragment = document.createDocumentFragment();
    vnode.children.forEach(child => fragment.appendChild(renderToDOM(child)));
    return fragment;
  }

  // Handle function components
  if (typeof vnode.type === 'function') {
    // Pass props and children to the component function
    const componentResult = vnode.type({ ...vnode.props, children: vnode.children.length <= 1 ? vnode.children[0] : vnode.children });
    // Render the VNode returned by the component (or a comment if null)
    return componentResult ? renderToDOM(componentResult) : document.createComment('');
  }

  // Handle regular HTML elements
  const element = document.createElement(vnode.type);

  // Apply props as attributes or properties
  Object.entries(vnode.props).forEach(([key, value]) => {
    // Event listeners (onClick, etc.)
    if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.substring(2).toLowerCase(), value);
    }
    // Ref function
    else if (key === 'ref' && typeof value === 'function') {
      value(element);
    }
    // Style object
    else if (key === 'style' && typeof value === 'object') {
      Object.entries(value).forEach(([styleKey, styleValue]) => {
        const cssKey = styleKey.replace(/([A-Z])/g, '-$1').toLowerCase();
        (element.style as any)[cssKey] = styleValue;
      });
    }
    // String style
    else if (key === 'style' && typeof value === 'string') {
      element.setAttribute('style', value);
    }
    // Class name
    else if (key === 'className') {
      element.setAttribute('class', String(value));
    }
    // DOM Properties like value, checked, selected
    else if (key === 'value' || key === 'checked' || key === 'selected') {
      (element as any)[key] = value;
    }
    // Boolean attributes like disabled
    else if (typeof value === 'boolean' && value === true) {
      element.setAttribute(key, '');
    }
    // Other attributes (skip false/null/undefined)
    else if (value !== false && value != null) {
      element.setAttribute(key, String(value));
    }
  });

  // Recursively render and append children
  vnode.children.forEach(child => element.appendChild(renderToDOM(child)));

  return element;
}

// Mounts the root component to the container
export function mount(component: () => VNode | null, container: HTMLElement): void {
  rootComponent = component;
  rootContainer = container;
  renderApp(); // Initial render
}