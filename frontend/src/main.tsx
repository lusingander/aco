import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./style.css";
import { themeOptions } from "./theme";

const container = document.getElementById("root");

const root = createRoot(container!);

const theme = createTheme(themeOptions);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
