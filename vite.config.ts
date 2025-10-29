import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  
  // Cấu hình esbuild (trình biên dịch mà Vite sử dụng)
  esbuild: {
    // Chỉ định hàm factory cho JSX (giống hệt tsconfig.json)
    jsxFactory: 'createElement',
    
    // Chỉ định hàm factory cho JSX Fragments (giống hệt tsconfig.json)
    jsxFragment: 'createFragment',
  },

  // Cấu hình build
  build: {
    outDir: 'dist', // Thư mục đầu ra cho production
    minify: true,   // Nén code khi build
  },

  // Cấu hình dev server
  server: {
    port: 5173,     // Cổng mặc định
    open: true,       // Tự động mở trình duyệt khi chạy `npm run dev`
  }
});