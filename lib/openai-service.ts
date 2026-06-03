import "server-only";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
import { generateParallelLife } from "@/lib/mock-ai";
import type { SimulationInput, SimulationResult } from "@/lib/schemas";

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function resultJsonSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: [
      "title",
      "oneSentence",
      "summary",
      "timeline",
      "curve",
      "socialCircle",
      "turningPoint",
      "letterFromParallelSelf",
      "shareText",
      "imagePrompt",
    ],
    properties: {
      title: { type: "string" },
      oneSentence: { type: "string" },
      summary: { type: "string" },
      timeline: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["year", "title", "description"],
          properties: {
            year: { type: "number" },
            title: { type: "string" },
            description: { type: "string" },
          },
        },
      },
      curve: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["year", "wealth", "happiness", "career"],
          properties: {
            year: { type: "number" },
            wealth: { type: "number" },
            happiness: { type: "number" },
            career: { type: "number" },
          },
        },
      },
      socialCircle: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["label", "realWorld", "parallelWorld", "note"],
          properties: {
            label: { type: "string" },
            realWorld: { type: "number" },
            parallelWorld: { type: "number" },
            note: { type: "string" },
          },
        },
      },
      turningPoint: { type: "string" },
      letterFromParallelSelf: { type: "string" },
      shareText: { type: "string" },
      imagePrompt: { type: "string" },
    },
  };
}

export function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function generateOpenAIText(input: SimulationInput): Promise<SimulationResult> {
  const client = getClient();
  if (!client) {
    throw new Error("未配置 OPENAI_API_KEY，无法使用真实 OpenAI 文本生成。");
  }

  const fallback = generateParallelLife(input);
  const response = await client.responses.create({
    model: process.env.OPENAI_TEXT_MODEL ?? "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "你是中文人生模拟产品的叙事生成器。请输出可信、具体、因人而异、温暖但不过度鸡汤的中文内容。必须显式结合用户的当前状态、最大担心、风险承受度、理想生活、专业、城市、创业和婚姻选择。不要承诺确定未来，不要涉及医疗、法律、投资建议。",
      },
      {
        role: "user",
        content: `请基于以下用户选择生成“平行人生报告”。结果必须是 JSON，字段结构与 schema 完全一致。summary 需要 500-1000 字，timeline 固定 5 个节点，curve 固定 2026/2028/2030/2032/2035 五个节点，每个分数 0-100。\n\n写作要求：不要使用放之四海皆准的泛泛句子；summary 至少引用或改写用户的 currentSituation、biggestConcern、riskLevel、idealLife 中的 3 项，并解释这些信息如何影响平行人生。\n\n用户输入：${JSON.stringify(input, null, 2)}\n\nMock 参考骨架：${JSON.stringify(fallback, null, 2)}`,
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "parallel_life_result",
        strict: true,
        schema: resultJsonSchema(),
      },
    },
  });

  return JSON.parse(response.output_text) as SimulationResult;
}

export async function generateOpenAIImage(simulationId: string, prompt: string) {
  const client = getClient();
  if (!client) {
    throw new Error("未配置 OPENAI_API_KEY，无法使用真实 AI 照片生成。");
  }

  const response = await client.images.generate({
    model: process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1",
    prompt,
    size: "1024x1024",
  });

  const b64 = response.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error("图片模型未返回图片数据。");
  }

  const dir = path.join(process.cwd(), "public", "generated");
  await mkdir(dir, { recursive: true });
  const fileName = `${simulationId}.png`;
  await writeFile(path.join(dir, fileName), Buffer.from(b64, "base64"));
  return `/generated/${fileName}`;
}
