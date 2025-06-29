import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import "@fontsource-variable/material-symbols-rounded"; // Material Symbols Rounded Variable
import "@fontsource-variable/roboto-flex"; // Roboto Flex Variable
import { setupPersist } from "./store/persistStore.ts";

setupPersist();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
