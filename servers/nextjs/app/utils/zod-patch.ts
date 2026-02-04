import { z } from "zod";

// Patch Zod to add meta method if it doesn't exist
if (typeof (z.ZodType.prototype as any).meta === "undefined") {
  (z.ZodType.prototype as any).meta = function (meta: any) {
    this._def.meta = meta;
    return this;
  };
}
