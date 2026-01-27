import React from "react";
import Header from "@/app/(presentation-generator)/dashboard/components/Header";

export const APIKeyWarning: React.FC = () => {
  return (
    <div className="min-h-screen font-roboto bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <div className="flex items-center justify-center aspect-video mx-auto px-6">
        <div className="text-center space-y-2 my-6 bg-white p-10 rounded-lg shadow-lg">
          <h1 className="text-xl font-bold text-gray-900">
          请添加 "GOOGLE_API_KEY" 以启用 AI 模板生成功能。
          </h1>
          <h1 className="text-xl font-bold text-gray-900">请添加您的 OpenAI API 密钥以处理布局</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            此功能需要 OpenAI 模型 GPT-5。请在设置或环境变量中配置您的密钥。
          </p>
        </div>
      </div>
    </div>
  );
}; 