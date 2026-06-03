import { prisma } from "@/lib/prisma";
import { generateParallelLife } from "@/lib/mock-ai";
import type { SimulationInput } from "@/lib/schemas";

const input: SimulationInput = {
  birthYear: 1998,
  currentCity: "上海",
  currentJob: "产品经理",
  major: "计算机科学",
  realChoice: "留在上海做稳定工作",
  alternativeChoice: "22 岁去了深圳加入创业团队",
  values: ["财富", "自由"],
  personality: "理性规划者",
  startedBusiness: true,
  married: false,
  partnerName: "小林",
  partnerMajor: "金融",
  partnerChoice: "一起去深圳重新开始",
  currentSituation: "工作稳定但成长速度变慢，想知道换城市会不会打开新机会",
  biggestConcern: "担心几年后收入和能力都没有明显变化",
  riskLevel: "中",
  idealLife: "有更高收入，也保留自由感和可控的生活节奏",
};

async function main() {
  const result = generateParallelLife(input);
  const shareSlug = `smoke-${Date.now().toString(36)}`;

  const created = await prisma.simulation.create({
    data: {
      shareSlug,
      title: result.title,
      summary: result.summary,
      inputJson: JSON.stringify(input),
      resultJson: JSON.stringify(result),
    },
  });

  const loaded = await prisma.simulation.findUnique({
    where: { id: created.id },
  });

  if (!loaded) {
    throw new Error("Smoke test failed: record was not found");
  }

  console.log(`created=${created.id} shareSlug=${created.shareSlug} title=${created.title}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
