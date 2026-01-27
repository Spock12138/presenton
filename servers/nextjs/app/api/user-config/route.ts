import { NextResponse } from "next/server";
import fs from "fs";
import { LLMConfig } from "@/types/llm_config";

const userConfigPath = process.env.USER_CONFIG_PATH!;
const canChangeKeys = process.env.CAN_CHANGE_KEYS !== "false";

export async function GET() {
  if (!canChangeKeys) {
    return NextResponse.json({
      error: "You are not allowed to access this resource",
      status: 403,
    });
  }
  if (!userConfigPath) {
    return NextResponse.json({
      error: "User config path not found",
      status: 500,
    });
  }

  if (!fs.existsSync(userConfigPath)) {
    return NextResponse.json({});
  }
  const configData = fs.readFileSync(userConfigPath, "utf-8");
  return NextResponse.json(JSON.parse(configData));
}

export async function POST(request: Request) {
  if (!canChangeKeys) {
    return NextResponse.json({
      error: "You are not allowed to access this resource",
    });
  }

  const userConfig = await request.json();

  let existingConfig: LLMConfig = {};
  if (fs.existsSync(userConfigPath)) {
    const configData = fs.readFileSync(userConfigPath, "utf-8");
    existingConfig = JSON.parse(configData);
  }
  const mergedConfig: LLMConfig = {
    ...existingConfig,
    ...userConfig,
  };
  fs.writeFileSync(userConfigPath, JSON.stringify(mergedConfig));
  return NextResponse.json(mergedConfig);
}
