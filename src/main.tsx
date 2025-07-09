import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app.tsx";
import "./styles/main.css";

const root = createRoot(document.getElementById("app")!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);