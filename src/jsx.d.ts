// src/jsx.d.ts

// Định nghĩa namespace JSX toàn cục
declare namespace JSX {
    // Interface này định nghĩa các thẻ HTML cơ bản và thuộc tính của chúng
    interface IntrinsicElements {
      // Thêm các thẻ HTML bạn sử dụng vào đây
      div: React.HTMLAttributes<HTMLDivElement>;
      button: React.HTMLAttributes<HTMLButtonElement>;
      h1: React.HTMLAttributes<HTMLHeadingElement>;
      h2: React.HTMLAttributes<HTMLHeadingElement>;
      header: React.HTMLAttributes<HTMLElement>;
      section: React.HTMLAttributes<HTMLElement>;
      footer: React.HTMLAttributes<HTMLElement>;
      p: React.HTMLAttributes<HTMLParagraphElement>;
      ul: React.HTMLAttributes<HTMLUListElement>;
      li: React.HTMLAttributes<HTMLLIElement>;
      form: React.HTMLAttributes<HTMLFormElement>;
      input: React.InputHTMLAttributes<HTMLInputElement>;
      span: React.HTMLAttributes<HTMLSpanElement>;
      label: React.HTMLAttributes<HTMLLabelElement>;
      select: React.SelectHTMLAttributes<HTMLSelectElement>;
      option: React.OptionHTMLAttributes<HTMLOptionElement>;
      canvas: React.CanvasHTMLAttributes<HTMLCanvasElement>;
      hr: React.HTMLAttributes<HTMLHRElement>;
      // Thêm các thẻ khác nếu bạn dùng (ví dụ: img, a, ...)
    }
  
    // Định nghĩa kiểu cho children (có thể là một hoặc nhiều node)
    type ElementChildrenAttribute = { children?: React.ReactNode | React.ReactNode[] };
  
    // Interface cơ bản cho thuộc tính của component (bao gồm children)
    interface ElementAttributesProperty extends ElementChildrenAttribute {}
  }
  
  // Import React để sử dụng các kiểu HTMLAttributes, etc.
  // Mặc dù chúng ta không dùng React runtime, chúng ta vẫn cần kiểu của nó.
  // Đảm bảo bạn đã cài @types/react (thường Vite cài sẵn nếu template là react-ts,
  // nhưng dự án này không dùng template đó nên cần cài thêm)
  import React from 'react';
  
  // Khai báo module toàn cục để TypeScript nhận diện các kiểu JSX
  export {}; // Cần dòng này để file được coi là module
  
  declare global {
    namespace React {
      // Định nghĩa các kiểu cơ bản mà JSX cần
      interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        // Các thuộc tính HTML chung
        className?: string;
        id?: string;
        style?: Partial<CSSStyleDeclaration> | string; // Cho phép cả object và string
        // ... thêm các thuộc tính HTML chung khác nếu cần
        [key: string]: any; // Cho phép các thuộc tính tùy chỉnh (data-*)
      }
  
      interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
        // Các thuộc tính riêng của input
        value?: string | number;
        type?: string;
        checked?: boolean;
        disabled?: boolean;
        placeholder?: string;
        name?: string;
        // ...
      }
  
      interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
        value?: string | number;
        name?: string;
        // ...
      }
  
      interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
         value?: string | number;
         selected?: boolean;
        // ...
      }
  
       interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
         width?: string | number;
         height?: string | number;
        // ...
      }
  
  
      // Các kiểu cơ bản khác (giữ nguyên từ định nghĩa React)
      interface DOMAttributes<T> {
        onClick?: MouseEventHandler<T>;
        onInput?: FormEventHandler<T>;
        onChange?: FormEventHandler<T>;
        onSubmit?: FormEventHandler<T>;
        // ... thêm các event handlers khác nếu cần
      }
      interface AriaAttributes { /* ... */ }
      type ReactNode = string | number | boolean | ReactElement | Iterable<ReactNode> | null | undefined;
      interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
          type: T;
          props: P;
          key: string | number | null;
      }
      type JSXElementConstructor<P> = (props: P) => ReactElement<any, any> | null;
  
      type MouseEventHandler<T = Element> = (event: MouseEvent<T>) => void;
      type FormEventHandler<T = Element> = (event: Event<T>) => void; // Event chung chung hơn
      interface MouseEvent<T = Element> { /* Basic properties */ bubbles: boolean; cancelable: boolean; currentTarget: EventTarget & T; /* ... */ }
      interface Event<T = Element> { /* Basic properties */ currentTarget: EventTarget & T; /* ... */ }
  
      // Khai báo CSSStyleDeclaration để dùng Partial<CSSStyleDeclaration>
       interface CSSProperties extends CSS.Properties<string | number> { /** ... */ }
    }
  
    // Khai báo namespace CSS để React.CSSProperties hoạt động
    namespace CSS {
      interface Properties<TLength = (string & {}) | 0> {
           [key: string]: any; // Định nghĩa đơn giản cho các thuộc tính CSS
      }
    }
  }