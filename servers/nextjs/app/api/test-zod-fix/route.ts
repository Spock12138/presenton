import { NextResponse } from "next/server";
import { zodToJsonSchema } from "zod-to-json-schema";
import * as z from "zod";

export async function GET() {
    try {
        const simpleSchema = z.string();
        const jsonSchema = zodToJsonSchema(simpleSchema, "mySchema");
        
        return NextResponse.json({ 
            success: true, 
            zodVersion: (z as any).version || "unknown",
            schema: jsonSchema 
        });
    } catch (error: any) {
        return NextResponse.json({ 
            success: false, 
            error: error.message,
            stack: error.stack
        });
    }
}
