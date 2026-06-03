import { z } from "zod";

export const simulationInputSchema = z.object({
  birthYear: z.coerce
    .number()
    .int()
    .min(1960, "出生年份不能早于 1960")
    .max(2010, "出生年份不能晚于 2010"),
  currentCity: z.string().min(1, "请填写当前城市").max(30),
  currentJob: z.string().min(1, "请填写当前职业").max(40),
  major: z.string().min(1, "请填写所学专业").max(40),
  realChoice: z.string().min(1, "请填写现实选择").max(80),
  alternativeChoice: z.string().min(1, "请填写平行选择").max(80),
  values: z.array(z.string()).min(1, "至少选择一个价值观").max(3, "最多选择三个价值观"),
  personality: z.string().min(1, "请选择人格类型"),
  startedBusiness: z.boolean(),
  married: z.boolean(),
  partnerName: z.string().max(30).optional().default(""),
  partnerMajor: z.string().max(40).optional().default(""),
  partnerChoice: z.string().max(80).optional().default(""),
  currentSituation: z.string().max(160).optional().default(""),
  biggestConcern: z.string().max(120).optional().default(""),
  riskLevel: z.enum(["低", "中", "高"]).optional().default("中"),
  idealLife: z.string().max(160).optional().default(""),
});

export const authSchema = z.object({
  email: z.string().email("请输入正确邮箱"),
  password: z.string().min(6, "密码至少 6 位").max(80),
  name: z.string().min(1, "请填写昵称").max(30).optional(),
});

export type SimulationInput = z.infer<typeof simulationInputSchema>;

export type TimelineItem = {
  year: number;
  title: string;
  description: string;
};

export type CurvePoint = {
  year: number;
  wealth: number;
  happiness: number;
  career: number;
};

export type SocialCircleItem = {
  label: string;
  realWorld: number;
  parallelWorld: number;
  note: string;
};

export type BranchComparison = {
  name: string;
  choice: string;
  wealth: number;
  happiness: number;
  career: number;
  relationship: number;
  summary: string;
};

export type PartnerResult = {
  title: string;
  summary: string;
  synergyScore: number;
  timeline: TimelineItem[];
};

export type SimulationResult = {
  title: string;
  oneSentence: string;
  summary: string;
  timeline: TimelineItem[];
  curve: CurvePoint[];
  socialCircle: SocialCircleItem[];
  turningPoint: string;
  letterFromParallelSelf: string;
  shareText: string;
  imagePrompt: string;
};
