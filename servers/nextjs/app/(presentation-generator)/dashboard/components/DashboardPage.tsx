"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardApi } from "@/app/(presentation-generator)/services/api/dashboard";
import { PresentationGrid } from "@/app/(presentation-generator)/dashboard/components/PresentationGrid";
import Header from "@/app/(presentation-generator)/dashboard/components/Header";
import { Sparkles, ArrowRight, Zap } from "lucide-react";

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [presentations, setPresentations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const loadData = async () => {
      await fetchPresentations();
    };
    loadData();
  }, []);

  const fetchPresentations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await DashboardApi.getPresentations();
      data.sort(
        (a: any, b: any) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      setPresentations(data);
    } catch (err) {
      setError(null);
      setPresentations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const removePresentation = (presentationId: string) => {
    setPresentations((prev: any) =>
      prev ? prev.filter((p: any) => p.id !== presentationId) : []
    );
  };

  const handleQuickGenerate = () => {
    if (inputValue.trim()) {
      // Navigate to upload page with the prompt pre-filled
      router.push(`/upload?prompt=${encodeURIComponent(inputValue.trim())}`);
    } else {
      router.push("/upload");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleQuickGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <Header />
      
      {/* Hero Section with Quick Generate */}
      <div className="relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          {/* Hero Content */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-full text-sm text-indigo-700 font-medium mb-6">
              <Zap className="w-4 h-4" />
              <span>AI 驱动的演示文稿生成</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              选择你的学校，挑选你的心仪模板
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              输入你的主题或想法，让 AI 为你生成专业的演示文稿
            </p>
          </div>

          {/* Quick Generate Input */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              {/* Glow effect on focus */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500" />
              
              <div className="relative flex items-center bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200 overflow-hidden transition-all duration-300 group-focus-within:border-indigo-300 group-focus-within:shadow-xl group-focus-within:shadow-indigo-100/50">
                <div className="pl-5 pr-3 py-4">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                </div>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="例如：2024年度工作总结、产品发布会、商业计划书..."
                  className="flex-1 py-4 pr-4 text-slate-800 placeholder:text-slate-400 bg-transparent outline-none text-base"
                />
                <button
                  onClick={handleQuickGenerate}
                  className="m-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]"
                >
                  <span>生成</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-sm text-slate-500">热门：</span>
              {["计算机专业", "浙江工业大学", "产品介绍", "技术分享"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setInputValue(tag)}
                  className="px-3 py-1.5 text-sm text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-full transition-colors duration-200"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              我的演示文稿
            </h2>
            <p className="text-slate-500 mt-1">
              管理和编辑你创建的所有演示文稿
            </p>
          </div>
        </div>

        {/* Presentation Grid */}
        <PresentationGrid
          presentations={presentations}
          type="slide"
          isLoading={isLoading}
          error={error}
          onPresentationDeleted={removePresentation}
        />
      </main>
    </div>
  );
};

export default DashboardPage;
