# Debug Summary for Gemini

## Purpose
整理当前调试状态与代码变更，帮助 Gemini 快速理解本地开发流程、已尝试过的修复，以及正在追踪的问题。

---

## 1. 核心变更
- `.env`（项目根）：定义了 `LLM=custom` 配置，指向阿里云 DashScope Qwen API（`CUSTOM_LLM_URL`/`CUSTOM_LLM_API_KEY`），同时配置 `IMAGE_PROVIDER=pexels`、Pexels API Key；添加 `DISABLE_IMAGE_GENERATION=true` 作为临时开关，明确 `APP_DATA_DIRECTORY` 与 `USER_CONFIG_PATH` 路径；`CAN_CHANGE_KEYS=false` 让界面不可修改密钥。
- `servers/nextjs/.env.local`：确保前端读取到相同的 `USER_CONFIG_PATH`、`CAN_CHANGE_KEYS` 与 `NEXT_PUBLIC_API_URL`，避免 Next.js 读取不到根目录 `.env` 的问题。
- `servers/fastapi/services/llm_client.py`：在多处 Qwen 调用路径插入调试输出（非流式、流式、结构化 + custom 入口），目的是观察每次 Chat Completions 返回的内容，检查是否因格式/流中断造成生成卡住。

## 2. 当前问题
1. PPT 生成卡在“Almost there! Putting final touches”（约 95%）
2. 前端（Edge）提示 lazy loading 介入，但没有报错；怀疑后端没给出完成信号或 Qwen 高频返回异常内容。
3. 还未确认是 image pipeline、Qwen 响应格式，还是 streaming 逻辑中的阻塞。

## 3. 调试思路
1. **后端启动时观察`🛑 [DEBUG]`输出**：非流式/流式/结构化生成在终端会打印原始 chunks，握住 Qwen 返回内容是否完整。
2. **重新生成演示**（先禁用图片看是否完成），观察后端是否仍然卡住提示“Almost there”且终端 log 截止在某点。
3. **收集完整日志**：从点击 Generate 开始，到前端卡死为止的全部后端输出，包括 `🛑` 打印；若有异常就能判断是编码、格式，还是流式中途终止。
4. **浏览器辅助信息**：Edge Console/Network 是否存在 SSE 链接断开；若 Chrome 不复现则重点在浏览器层面。

## 4. Gemini 的目标建议
1. 检查 Qwen 返回内容是否符合 OpenAI 兼容格式（必要字段 `choices[0].message.content`、tool_call 数据）；是否存在空内容、json 语法破坏或 unicode 编码异常。
2. 确认流式数据接收流程：是否在某 chunk 之后没有 `delta.content` 造成 SSE 流终止、是否 `HAS_RESPONSE_SCHEMA` 逻辑在结构化模式中没跑完。
3. 关注 `DISABLE_IMAGE_GENERATION` 打开后是否仍卡住；若卡住，则重点转向结构化/stream 解析；若不卡，说明图片下载可能是瓶颈，需要补充超时与容错机制。
4. 若玄学卡住点在 SSE 终端，请提供“最后一次打印的 chunk”与“后端停止的 line”供进一步排查。

## 5. 说明信息
- 本地路径：`D:/project/presenton/presenton`
- 后端启动命令：`uvicorn api.main:app --reload --host 0.0.0.0 --port 8000`
- Conda 环境：`presenton_dev`、Python 3.11
- 问题复现 URL：`http://localhost:3000/presentation?id=<generated-id>&stream=true`
- Qwen 模型：`qwen-plus`

---

请作为第一步查看后端 `🛑` 输出内容，确认 Qwen 是否真的在最后阶段停止发消息，或只是我们没正确消费它。