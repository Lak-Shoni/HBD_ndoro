import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// @ts-expect-error CSS is processed by the bundler and has no TypeScript declarations.
import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

