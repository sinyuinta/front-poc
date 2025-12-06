export function defaultState(group="G1"){
  return {
    group,
    agenda: "",
    stakeholder: "",
    mode: "rescue",    // "rescue" | "maintain"
    question: "",
    verification: { hypothesis:"", method:{ who:"", where:"", window:"" }, criteria:"", record:"" },
    updatedAt: 0
  };
}
function normalize(s, group){ const d=defaultState(group), x=s||{}; return {
  ...d, ...x, verification:{ ...d.verification, ...(x.verification||{}), method:{ ...d.verification.method, ...((x.verification||{}).method||{}) } }
};}
export async function loadState(group = "G1") {
  const raw = localStorage.getItem(`ms:${group}`);
  return normalize(raw ? JSON.parse(raw) : null, group);
}

export async function saveState(group, state) {
  const payload = { ...state, group, updatedAt: Date.now() };
  localStorage.setItem(`ms:${group}`, JSON.stringify(payload));
  return payload;
}

export async function patchState(group, fn){
  let s = await loadState(group); s = fn(structuredClone(s)); return await saveState(group, s);
}
