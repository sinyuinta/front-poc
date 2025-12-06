const API = import.meta.env?.VITE_MS_API || "";
export const hasAPI = !!API;

export async function engineQuestion(
  topic,
  stakeholder,
  mode = "rescue",
  leadLabel = "前提→仮説→検証の順で考えよう"
) {
  if (!API) return null;

  const r = await fetch(`${API}/api/engine/question`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ topic, stakeholder, mode, leadLabel }),
  });

  if (!r.ok) throw new Error("engine-question-failed");
  return await r.json();
  
}
