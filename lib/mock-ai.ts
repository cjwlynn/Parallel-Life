import type { BranchComparison, PartnerResult, SimulationInput, SimulationResult } from "@/lib/schemas";

const valueTone: Record<string, string> = {
  财富: "你会更早学会把机会换成可持续的现金流",
  爱情: "你会把亲密关系放在人生叙事的中心",
  自由: "你会拒绝太早被稳定路径定义",
  安稳: "你会在风险里寻找可控的秩序",
  成就: "你会不断把自己推向更高的舞台",
  冒险: "你会愿意为未知付出更长的试错期",
};

function clampScore(value: number) {
  return Math.max(10, Math.min(100, Math.round(value)));
}

function inferCity(input: SimulationInput) {
  const knownCities = [
    "北京",
    "上海",
    "深圳",
    "广州",
    "杭州",
    "成都",
    "南京",
    "武汉",
    "苏州",
    "厦门",
    "重庆",
    "西安",
    "香港",
    "新加坡",
    "纽约",
    "伦敦",
    "东京",
  ];
  return knownCities.find((city) => input.alternativeChoice.includes(city)) ?? input.currentCity;
}

function makeCurve(input: SimulationInput): SimulationResult["curve"] {
  const ambition = input.personality.includes("野心") ? 12 : input.personality.includes("佛系") ? -6 : 4;
  const businessBoost = input.startedBusiness ? 18 : 2;
  const marriageStability = input.married ? 8 : -2;
  const wealthValue = input.values.includes("财富") ? 12 : 0;
  const freedomValue = input.values.includes("自由") ? 8 : 0;
  const riskBoost = input.riskLevel === "高" ? 10 : input.riskLevel === "低" ? -6 : 0;

  return [2026, 2028, 2030, 2032, 2035].map((year, index) => {
    const growth = index * 9;
    return {
      year,
      wealth: clampScore(36 + growth + businessBoost + wealthValue + ambition + riskBoost),
      happiness: clampScore(48 + index * 6 + marriageStability + freedomValue - (input.startedBusiness ? 4 : 0) - Math.max(riskBoost / 2, 0)),
      career: clampScore(42 + growth + ambition + (input.values.includes("成就") ? 14 : 0) + riskBoost),
    };
  });
}

function makePersonalContext(input: SimulationInput) {
  const situation = input.currentSituation
    ? `你当下的真实状态是：“${input.currentSituation}”。`
    : `你现在的生活状态主要由${input.currentCity}、${input.currentJob}和${input.major}背景共同塑造。`;
  const concern = input.biggestConcern
    ? `你最担心的是：“${input.biggestConcern}”。`
    : "你真正担心的不是单次选择失败，而是几年后发现自己从未认真试过另一种可能。";
  const ideal = input.idealLife
    ? `你理想中的生活是：“${input.idealLife}”。`
    : `你理想中的生活更接近“${input.values.join("、")}”之间的平衡。`;
  const risk = `你的风险承受度是${input.riskLevel || "中"}，这会影响你在关键年份是选择冲刺、观望还是回撤。`;
  return { situation, concern, ideal, risk };
}

export function generateParallelLife(input: SimulationInput): SimulationResult {
  const city = inferCity(input);
  const ageIn2035 = 2035 - input.birthYear;
  const primaryValue = input.values[0];
  const tone = input.values.map((item) => valueTone[item] ?? `你会重新理解${item}`).join("；");
  const personal = makePersonalContext(input);
  const businessLine = input.startedBusiness
    ? "创业让你的人生曲线更陡峭：前两年反复被现金流、团队和产品节奏拉扯，但也因此更快建立了对资源和人的判断。"
    : "没有选择创业让你保留了更稳定的上升通道，你把精力投向专业深耕、跨城市网络和长期信用。";
  const marriageLine = input.married
    ? "婚姻在这个宇宙里不是束缚，而是一种共同校准方向的机制，让你在关键年份少了一些漂移。"
    : "未婚状态让你的移动成本更低，也让你在关系选择上更谨慎，把更多时间留给自我更新。";

  const title = `2035 年，${city}宇宙里的你`;
  const oneSentence = `如果你选择了“${input.alternativeChoice}”，${ageIn2035} 岁的你会成为一个更重视${primaryValue}、更敢改变生活半径的人。`;

  const timeline = [
    {
      year: 2026,
      title: "分岔点出现",
      description: `你没有延续“${input.realChoice}”，而是认真执行“${input.alternativeChoice}”。${personal.concern} 这让你的第一年更像一次心理压力测试。`,
    },
    {
      year: 2028,
      title: "新的身份成形",
      description: `凭借${input.major}背景和${input.currentJob}经验，你开始把旧技能迁移到新场景。${personal.situation}`,
    },
    {
      year: 2030,
      title: "第一次明显回报",
      description: `${businessLine} 这一年，你开始看见选择带来的复利。`,
    },
    {
      year: 2032,
      title: "关系与生活重排",
      description: `${marriageLine} 你的社交圈从数量扩张转向质量筛选。`,
    },
    {
      year: 2035,
      title: "平行人生稳定",
      description: `你在${city}拥有了更清晰的生活结构：职业、财富、关系和自我认同不再互相抢夺。`,
    },
  ];

  const summary = `这份平行人生不是简单地说“换个城市就会更好”，而是把你的个人处境放进另一个选择里重新推演。${personal.situation}${personal.risk}${personal.concern}${personal.ideal}\n\n你曾经的现实选择是“${input.realChoice}”，而这一次你选择了“${input.alternativeChoice}”。如果你的风险承受度维持在${input.riskLevel || "中"}，这条路最明显的变化不是外界评价，而是你处理不确定性的方式：你会更早面对钱、关系、职业身份和自我期待之间的冲突，也会更早知道自己到底怕失去什么。\n\n刚开始，你并不会马上变得更成功。相反，生活成本、陌生人网络、行业节奏和自我怀疑会一起出现。你的${input.major}背景没有被浪费，它会变成底层理解力；你过去作为${input.currentJob}积累的经验，也会让你在新环境里更快识别真正有价值的人和机会。\n\n${businessLine}${marriageLine} 到 2035 年，${ageIn2035} 岁的你不会觉得这条路完全轻松，但会承认它更接近你对“${input.idealLife || input.values.join("、")}”的想象。${tone}。所以这个宇宙里的你不一定绝对更富有或更幸福，但会更清楚：哪些代价值得承担，哪些稳定只是拖延。`;

  const socialCircle = [
    {
      label: "老同学/旧同事",
      realWorld: 76,
      parallelWorld: 42,
      note: "联系频率下降，但重要关系留下来了。",
    },
    {
      label: "行业伙伴",
      realWorld: 44,
      parallelWorld: input.startedBusiness ? 88 : 70,
      note: "新城市让弱连接变成机会来源。",
    },
    {
      label: "亲密关系",
      realWorld: input.married ? 82 : 50,
      parallelWorld: input.married ? 86 : 58,
      note: input.married ? "共同生活让长期规划更稳定。" : "关系更少，但边界更清楚。",
    },
    {
      label: "自我独处",
      realWorld: 48,
      parallelWorld: input.values.includes("自由") ? 82 : 62,
      note: "独处从消耗变成恢复能量的方式。",
    },
  ];

  const turningPoint = `真正的转折点不是你抵达${city}的那天，而是你发现“${input.biggestConcern || "我害怕的东西"}”并没有消失，但你已经能带着它继续选择。`;
  const letterFromParallelSelf = `亲爱的我：\n\n别把人生选择想成一次押注。它更像一次长期训练。你当时在意的不是别人眼里的成功，而是能不能靠近“${input.idealLife || input.values.join("、")}”。你会因为选择新路径而失去一些确定性，也会因此得到新的判断力。\n\n如果你仍然担心“${input.biggestConcern || "走错路"}”，不要急着证明自己选对了，先把每一天过得足够具体。到了 2035 年，你会感谢那个没有立刻退回舒适区的自己。\n\n来自${city}宇宙的你`;
  const shareText = `如果我当年选择“${input.alternativeChoice}”，2035 年的我会在${city}拥有另一条人生时间线。`;
  const imagePrompt = `A realistic editorial future portrait of a ${ageIn2035}-year-old Chinese professional living in ${city}, confident and reflective, subtle city background, modern natural light, no text, no watermark.`;

  return {
    title,
    oneSentence,
    summary,
    timeline,
    curve: makeCurve(input),
    socialCircle,
    turningPoint,
    letterFromParallelSelf,
    shareText,
    imagePrompt,
  };
}

export function generateBranchComparison(input: SimulationInput): BranchComparison[] {
  const current = generateParallelLife(input);
  const noStartup = generateParallelLife({ ...input, startedBusiness: false, alternativeChoice: `${input.alternativeChoice}，但不创业` });
  const relationshipFlip = generateParallelLife({
    ...input,
    married: !input.married,
    alternativeChoice: `${input.alternativeChoice}，并选择${input.married ? "保持未婚" : "进入婚姻"}`,
  });

  return [
    {
      name: "主分支",
      choice: input.alternativeChoice,
      wealth: current.curve.at(-1)?.wealth ?? 70,
      happiness: current.curve.at(-1)?.happiness ?? 70,
      career: current.curve.at(-1)?.career ?? 70,
      relationship: input.married ? 86 : 58,
      summary: `最接近你当前输入的平行人生，适合风险承受度为${input.riskLevel || "中"}、且更在意${input.values.join("、")}的人。`,
    },
    {
      name: "稳态分支",
      choice: "保留职业稳定性，不创业",
      wealth: noStartup.curve.at(-1)?.wealth ?? 62,
      happiness: noStartup.curve.at(-1)?.happiness ?? 75,
      career: noStartup.curve.at(-1)?.career ?? 68,
      relationship: input.married ? 84 : 62,
      summary: `增长更慢，但生活秩序更稳定，更适合担心“${input.biggestConcern || "失控"}”的人。`,
    },
    {
      name: "关系分支",
      choice: input.married ? "不进入婚姻，保持更高流动性" : "进入婚姻，建立共同计划",
      wealth: relationshipFlip.curve.at(-1)?.wealth ?? 66,
      happiness: relationshipFlip.curve.at(-1)?.happiness ?? 72,
      career: relationshipFlip.curve.at(-1)?.career ?? 70,
      relationship: input.married ? 60 : 84,
      summary: `亲密关系改变了人生节奏，也会检验你理想生活中“${input.idealLife || "陪伴与自由"}”的真实优先级。`,
    },
  ];
}

export function generatePartnerResult(input: SimulationInput): PartnerResult | null {
  if (!input.partnerName && !input.partnerMajor && !input.partnerChoice) {
    return null;
  }

  const partnerName = input.partnerName || "TA";
  const synergyScore = clampScore(
    58 +
      (input.married ? 10 : 0) +
      (input.values.includes("爱情") ? 10 : 0) +
      (input.partnerChoice ? 8 : 0) -
      (input.startedBusiness ? 4 : 0),
  );

  return {
    title: `${partnerName} 与你的双人平行人生`,
    summary: `${partnerName} 的选择“${input.partnerChoice || "重新选择人生方向"}”会让你们的关系从单纯陪伴变成共同决策系统。你的${input.major}背景和 TA 的${input.partnerMajor || "另一种经验"}形成互补，但也会在城市、事业节奏和安全感上制造摩擦。2035 年，你们是否更亲近，不取决于是否走同一条路，而取决于能否在关键年份承认彼此的野心和恐惧。`,
    synergyScore,
    timeline: [
      { year: 2026, title: "共同分岔", description: "你们第一次认真讨论：是各自稳定，还是一起进入更大的不确定性。" },
      { year: 2029, title: "节奏冲突", description: "事业、城市和关系投入开始争夺时间，沟通成本明显上升。" },
      { year: 2033, title: "共同资产", description: "你们逐渐形成共同的资源网络和生活规则。" },
      { year: 2035, title: "双人宇宙", description: `协同指数稳定在 ${synergyScore}，关系成为人生选择的一部分，而不是选择之后的附属品。` },
    ],
  };
}
