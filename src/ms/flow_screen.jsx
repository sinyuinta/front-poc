import React, { useEffect, useState } from "react";
import { loadState, saveState } from "./ms_sync.js";
import { isAgenticStakeholder, buildThreePartQuestionV3 } from "./rescue_engine.js";
import { hasAPI, engineQuestion } from "./api_client.js";

export function FlowScreen({ group = "G1" }) {
  const [state, setState] = useState({
    agenda: "",
    stakeholder: "",
    mode: "rescue",
    verification: {
      hypothesis: "",
      method: { who: "", where: "", window: "" },
      criteria: "",
      record: "",
    },
    question: "",
  });

  useEffect(() => {
    (async () => {
      const s = await loadState(group);
      if (s) setState({ ...state, ...s });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // プレビュー更新
  async function renderPreview(nextState) {
    let text = "（議題とStakeholderを設定すると、ここに三部構成が表示されます）";
    if (nextState.agenda && nextState.stakeholder) {
      if (hasAPI) {
        try {
          const res = await engineQuestion(
            nextState.agenda,
            nextState.stakeholder,
            nextState.mode || "rescue"
          );
          text =
            res?.text ||
            buildThreePartQuestionV3(nextState.agenda, nextState.stakeholder, {
              mode: nextState.mode || "rescue",
            });
        } catch {
          text = buildThreePartQuestionV3(nextState.agenda, nextState.stakeholder, {
            mode: nextState.mode || "rescue",
          });
        }
      } else {
        text = buildThreePartQuestionV3(nextState.agenda, nextState.stakeholder, {
          mode: nextState.mode || "rescue",
        });
      }
    }
    setState({ ...nextState, question: text });
    saveState(group, { ...nextState, question: text });
  }

}
