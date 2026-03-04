import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "@mui/material/styles";
import { CyberTheme } from "./theme/CyberTheme";

/**
 * Application bootstrap.
 * Creates the React root and mounts the main App component.
 */
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={CyberTheme}>
      <div className="cyber-background" />
      <div className="tactical-grid" />
      <div className="scanline-overlay" />
      <div className="vignette" />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

