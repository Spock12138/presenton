"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardApi } from "@/app/(presentation-generator)/services/api/dashboard";
import { PresentationGrid } from "@/app/(presentation-generator)/dashboard/components/PresentationGrid";
import Header from "@/app/(presentation-generator)/dashboard/components/Header";
import { SchoolSearchHero } from "./SchoolSearchHero";
import { TemplateGallery } from "./TemplateGallery";
import { School } from "./mockData";
import { ChevronDown, ChevronUp } from "lucide-react";

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [presentations, setPresentations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [showMyPresentations, setShowMyPresentations] = useState(true);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <Header />
      
      {/* 1. School Selection Hero */}
      <SchoolSearchHero 
        onSchoolSelect={setSelectedSchool} 
        selectedSchool={selectedSchool}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* 2. Template Gallery (Based on Selection) */}
        <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        {selectedSchool ? `${selectedSchool.name}专属模板` : "精选模板推荐"}
                    </h2>
                    <p className="text-slate-500 mt-1">
                        {selectedSchool ? "根据你的学校为你筛选的专属设计" : "浏览所有学校的优秀设计模板"}
                    </p>
                </div>
            </div>
            <TemplateGallery selectedSchool={selectedSchool} />
        </section>

        {/* Separator */}
        <div className="my-12 border-t border-slate-200"></div>

        {/* 3. My Presentations (Collapsible or just lower) */}
        <section>
            <div 
                className="flex items-center justify-between mb-8 cursor-pointer group"
                onClick={() => setShowMyPresentations(!showMyPresentations)}
            >
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors flex items-center gap-2">
                        我的演示文稿
                        {showMyPresentations ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </h2>
                    <p className="text-slate-500 mt-1">
                        管理和编辑你创建的所有演示文稿
                    </p>
                </div>
            </div>

            {showMyPresentations && (
                <PresentationGrid
                    presentations={presentations}
                    type="slide"
                    isLoading={isLoading}
                    error={error}
                    onPresentationDeleted={removePresentation}
                />
            )}
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
