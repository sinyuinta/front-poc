import { useEffect, useRef, useState } from "react";

const faces = ["😀","😇","😎","🤔","😡","😭","🥹","😱","🤩","😴"];
const blinkFace = "😑";

export default function FloatingAI() {
  const [face, setFace] = useState("😀");
  const [baseFace, setBaseFace] = useState("😀");
  const [angle, setAngle] = useState(0);

  const [pos, setPos] = useState({ x: 200, y: 200 });

  const target = useRef(null);
  const lastTarget = useRef(null);
  const sideRef = useRef("right");

  // 固定目標位置
  const fixedGoal = useRef({ x: pos.x, y: pos.y });

  const aiRef = useRef(null);

  // ====== 入力欄をクリックしたらAIが移動開始 ======
  useEffect(() => {
    const nodes = [...document.querySelectorAll("input, textarea")];
    nodes.forEach(el => {
      el.addEventListener("mousedown", () => {
        target.current = el;
        updateFixedGoal(el);
      });
    });
  }, []);

  // ===== まばたき =====
  useEffect(() => {
    const t = setInterval(() => {
      setFace(blinkFace);
      setTimeout(() => setFace(baseFace), 120);
    }, Math.random() * 4000 + 3000);
    return () => clearInterval(t);
  }, [baseFace]);

  // ===== 表情変化 =====
  useEffect(() => {
    const t = setInterval(() => startFlip(), 3000);
    return () => clearInterval(t);
  }, []);

  const startFlip = () => {
    let a = 0;
    const flip = setInterval(() => {
      a += 10;
      if (a === 180) {
        const f = faces[Math.floor(Math.random() * faces.length)];
        setFace(f);
        setBaseFace(f);
      }
      setAngle(a);
      if (a >= 360) {
        clearInterval(flip);
        setAngle(0);
      }
    }, 20);
  };

  // -------------------------------------------------------
  // ★ 目標座標を確定（議題カードだけ marginY を強化）
  // -------------------------------------------------------
  const updateFixedGoal = (el) => {
    const rect = el.getBoundingClientRect();
    const card = el.closest(".card")?.getBoundingClientRect();
    if (!card) return;

    // 議題だけ余裕をつける（カード上端ギリギリなので）
    const isTopCard = card.top < 200; // ← ページ上部（議題カード）判定
    const extraY = isTopCard ? 15 : 0;

    if (lastTarget.current !== el) {
      sideRef.current = ["left", "right"][Math.floor(Math.random() * 2)];
      lastTarget.current = el;
    }

    const aiSize = 90;
    const margin = 40;

    if (sideRef.current === "left") {
      fixedGoal.current = {
        x: card.left - aiSize - margin,
        y: rect.top + rect.height / 2 - aiSize / 2 + extraY,
      };
    } else {
      fixedGoal.current = {
        x: card.right + margin,
        y: rect.top + rect.height / 2 - aiSize / 2 + extraY,
      };
    }
  };

  // ===== メインループ =====
  useEffect(() => {
    const loop = setInterval(() => {
      moveTowards(fixedGoal.current.x, fixedGoal.current.y);
      applyOpacity();
    }, 30);
    return () => clearInterval(loop);
  }, [pos]);

  // -------------------------------------------------------
  // AI の移動（ががが完全ゼロ）
  // -------------------------------------------------------
  const moveTowards = (tx, ty) => {
    setPos(prev => {
      const dx = tx - prev.x;
      const dy = ty - prev.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 2) return prev;

      const speed = 10;
      return {
        x: prev.x + (dx / dist) * speed,
        y: prev.y + (dy / dist) * speed,
      };
    });
  };

  // -------------------------------------------------------
  // ★ カード上を通るとき透明にする
  // -------------------------------------------------------
  const applyOpacity = () => {
    if (!aiRef.current) return;

    const cards = [...document.querySelectorAll(".card")];
    const cx = pos.x + 45;
    const cy = pos.y + 45;

    let onCard = false;
    for (const c of cards) {
      const r = c.getBoundingClientRect();
      if (cx > r.left && cx < r.right && cy > r.top && cy < r.bottom) {
        onCard = true;
        break;
      }
    }

    aiRef.current.style.opacity = onCard ? 0.15 : 1;
  };

  return (
    <div
      ref={aiRef}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        fontSize: "90px",
        transform: `rotateY(${angle}deg)`,
        transition:
          "left 0.12s ease-out, top 0.12s ease-out, transform 0.2s ease-out, opacity 0.15s linear",
        filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.35))",
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      {face}
    </div>
  );
}
