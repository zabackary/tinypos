import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";

registerSW({ immediate: true });

import "@fontsource-variable/material-symbols-rounded/full"; // Material Symbols Rounded Variable
import "@fontsource-variable/roboto-flex/full"; // Roboto Flex Variable

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
