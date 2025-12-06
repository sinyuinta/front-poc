const BAN = /(餌|えさ|せんべい|誤解|囲む|差し出)/g;
export function toTaigen(topic){
  return String(topic).replace(/[?？。]+$/g,"").replace(/(とは|はなぜ.*|について.*)$/g,"").replace(/^\s*$/,"奈良の鹿の「お辞儀」");
}
export function maintainNounFor(stakeholder){
  const s = String(stakeholder);
  if (/鹿/.test(s)) return "健康と安全";
  if (/(修学旅行生|生徒|学生|子ども|来訪者|観光客)/.test(s)) return "安全";
  if (/(スタッフ|先生|運営|保護者|公園|NPO|自治体|学校|係)/.test(s)) return "安全な運営";
  return "安心して過ごせる状態";
}
const NON_AGENT = /(気候|天候|天気|台風|地震|雨|風|温度|季節|規則|看板|標識|建物|道路|設備|機械|AI|アルゴリズム|ゴミ)/;
const AGENT_HINT = /(本人|当事者|友人|生徒|学生|子ども|先生|保護者|観光客|来訪者|スタッフ|係|運営|NPO|自治体|学校|班|チーム|クラブ|家族|仲間|鹿|群れ|動物|鳥|犬|猫|生き物)/;

export function isAgenticStakeholder(name) {
  const s = String(name || "").trim();
  if (!s) return false;
  if (NON_AGENT.test(s)) return false;
  return AGENT_HINT.test(s);
}

export function buildThreePartQuestionV3(
  topic,
  stakeholder,
  { leadLabel = "前提→仮説→検証の順で考えよう", mode = "rescue" } = {}
) {
  const p1 = `${toTaigen(topic)}について考えよう。`;
  const p2 = `その件で、${stakeholder}が困っていることがあります。`;
  const p3 =
    mode === "maintain"
      ? `${stakeholder}の良い状態を維持しよう。`
      : `${stakeholder}が困っているのを助けよう。`;

  return [`【${leadLabel}】`, p1, p2, p3].join("\n").replace(BAN, "（伏せ）");
}
