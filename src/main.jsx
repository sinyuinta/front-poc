import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// 追加：FlowScreenを直接Reactで使えるように
import { FlowScreen } from "./ms/flow_screen.jsx";

// もし App も残したいなら両方を並べて描画
function Root() {
  return (
    <div>
      {/* 既存のApp機能 */}
      <App />

      {/* FlowScreenをそのまま組み込み */}
      <FlowScreen group="G1" />
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
