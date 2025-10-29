/** @jsx createElement */
import { createElement, mount } from './jsx-runtime';
import { AppShell } from './AppShell'; // The main layout component

// Find the root DOM element
const rootElement = document.getElementById('root');

// Mount the AppShell component into the root element
if (rootElement) {
  mount(() => <AppShell />, rootElement);
} else {
  console.error("Fatal: Could not find root element to mount the application.");
}