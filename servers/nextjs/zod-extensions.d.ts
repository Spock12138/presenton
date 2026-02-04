import { ZodType } from "zod";

declare module "zod" {
  interface ZodType<Output = any, Def extends ZodTypeDef = ZodTypeDef, Input = Output> {
    meta(meta: Record<string, any>): this;
  }
}
