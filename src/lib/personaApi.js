// ✅ Cloudflare Worker 本番URL
//const BASE =
  //import.meta.env.MODE === "development"
    //? "http://localhost:8787"
    //: "https://ms-engine-test.sinnosukeyamane.workers.dev";

const BASE = "https://ms-engine-test.sinnosukeyamane.workers.dev";


if (!BASE) throw new Error("VITE_PERSONA_API_BASE is missing");

// 🔒 固定ヘッダー
const salt = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };

// 🧠 共通POST関数
async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { ...headers, "x-otb-salt": salt() },
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) throw new Error(`API ${path} ${res.status}`);
  return res.json();
}

/* ===== 既存エンドポイント群 ===== */
export const analyzeLine     = (text, options = {}) => post("/persona/analyze", { text, ...options });
export const explainLine     = (text, options = {}) => post("/persona/explain", { text, ...options });
export const getTargets      = (topic)              => post("/persona/targets", { topic });
export const explainLineEval = (topic, text)        => post("/persona/explainLine", { topic, text });
export const checkLogBias    = (topic, fields)      => post("/persona/logBias", { topic, fields });
export const getNoise        = (topic, note)        => post("/persona/noise", { topic, note });

/* 🧩 arrangeBoard: 単体でも複数でもOK */
export const arrangeBoard = (arg1, spec, notes) => {
  if (Array.isArray(arg1)) return post("/persona/arrangeBoard", { boards: arg1 });
  if (typeof arg1 === "object" && arg1.topic) return post("/persona/arrangeBoard", arg1);
  return post("/persona/arrangeBoard", { topic: arg1, spec, notes });
};

/* 🧠 Evidence Quest: AIが6つのヒントを生成 */
export const evidenceQuest = (topic, teamName, notes = []) =>
  post("/persona/evidenceQuest", { topic, teamName, notes });

/* ===== KV TeamState関連 ===== */

// ✅ チーム状態の取得（個人データも統合）
export const getTeamState = async (teamName, userId) => {
  // 🟢 チーム全体データ
  const url = `${BASE}/persona/teamState?team=${encodeURIComponent(teamName)}`;
  const res = await fetch(url, { method: "GET", headers });
  if (!res.ok) throw new Error(`API /persona/teamState ${res.status}`);
  const teamData = await res.json();

  // 🟢 ユーザースコープデータ（上書き）
  if (userId) {
    const userKey = `${teamName}_user_${userId}`;
    const userUrl = `${BASE}/persona/teamState?team=${encodeURIComponent(userKey)}`;
    const userRes = await fetch(userUrl, { method: "GET", headers });
    if (userRes.ok) {
      const userData = await userRes.json();
      for (const k in userData) {
        if (userData[k] !== "" && userData[k] != null) teamData[k] = userData[k];
      }
    }
  }

  return teamData;
};

// ✅ チーム状態の保存（役割でスコープ分け）
// ✅ チーム状態の保存（役割でスコープ分け）
export const updateTeamState = async (teamData) => {
  const { role, team, userId } = teamData;

  // 🧭 guide → 保存禁止
  if (role === "guide") {
    console.log("🔒 guide は保存権限なし（読み取り専用）");
    return { skipped: true };
  }

  // 👤 user → 個人スコープ保存
  let saveKey = team;
  if (role === "user" && userId) {
    saveKey = `${team}_user_${userId}`;
    console.log(`👤 user: 個人スコープに保存 (${saveKey})`);
  }

  // 🧑‍💼 leader → チーム全体保存
  const payload = { ...teamData, team: saveKey };

  // 🩵 undefined を除外（空文字は残す）
  const cleanData = Object.fromEntries(
    Object.entries(payload).filter(([_, v]) => v !== undefined)
  );

  const res = await fetch(`${BASE}/persona/teamState`, {
    method: "POST",
    headers,
    body: JSON.stringify(cleanData),
  });
  if (!res.ok) throw new Error(`API /persona/teamState ${res.status}`);
  return res.json();


  
};

/* 💳 サブスク登録API */
export const subscribePlan = async (user) => {
  const res = await fetch(`${BASE}/persona/subscribe`, {
    method: "POST",
    headers,
    body: JSON.stringify({ user }),
  });

  if (!res.ok) throw new Error(`API /persona/subscribe ${res.status}`);

  const data = await res.json();

  // 👑 管理者なら即Premium
  if (data.admin) {
    alert("👑 管理者なので無料でプレミアム機能が有効になりました！");
  }
  // 💳 一般ユーザーはStripeページへ
  else if (data.url) {
    window.location.href = data.url;
  } else {
    alert("⚠️ サブスク登録エラー: " + (data.message || "不明な原因"));
  }

  return data;
};

