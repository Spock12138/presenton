"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle, FileX } from "lucide-react";

interface LoadingStatesProps {
  type: "loading" | "error" | "empty";
  message?: string;
}

const LoadingStates: React.FC<LoadingStatesProps> = ({ type, message }) => {
  if (type === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <Card className="p-8 text-center shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="space-y-6">
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                <div className="absolute inset-0 w-16 h-16 border-4 border-blue-100 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                正在加载模板
              </h3>
              <p className="text-gray-600">
                {message || "正在发现并加载布局组件..."}
              </p>
            </div>

            {/* Loading animation dots */}
            <div className="flex justify-center space-x-1">
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <Card className="p-8 text-center shadow-xl border-0 bg-white/80 backdrop-blur-sm max-w-md">
          <CardContent className="space-y-6">
            <div className="w-16 h-16 mx-auto p-4 bg-red-100 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                出错了
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {message ||
                  "加载模板失败。请检查布局文件并重试。"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (type === "empty") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 flex items-center justify-center">
        <Card className="p-8 text-center shadow-xl border-0 bg-white/80 backdrop-blur-sm max-w-md">
          <CardContent className="space-y-6">
            <div className="w-16 h-16 mx-auto p-4 bg-gray-100 rounded-full">
              <FileX className="w-8 h-8 text-gray-400" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-700">
                未找到模板
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                未发现有效的模板文件。请确保您的布局组件导出了默认组件和Schema。
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-left text-xs text-gray-600">
              <p className="font-medium mb-2">Expected structure:</p>
              <code className="block">
                export default MyLayout
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default LoadingStates;
