/** @jsx createElement */
import { createElement, VNode } from './jsx-runtime';
import { TodoApp } from './todo-app';
import { Counter } from './counter';
import { DashboardApp } from './dashboard';

// Main application shell that lays out the different widgets
export const AppShell = (): VNode => (
  <div>
    <DashboardApp />
    <hr />
    <TodoApp />
    <hr />
    <Counter initialCount={5} />
  </div>
);