import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";


// もし App も残したいなら両方を並べて描画
function Root() {
  return (
    <div>
      {/* 既存のApp機能 */}
      <App />

    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);

// ⚠ bootMs はReact直描画に置き換えたので不要。
// もし他の ms_* 機能が必要なら ms_boot.js 側で export を整理して Reactから呼び込む。
