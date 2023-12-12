import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { Engine } from "engine";
import { EmptyScene } from "game/scenes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

new Engine({
  canvas: document.querySelector("#canvas") as HTMLCanvasElement,
  startScene: EmptyScene,
});
