
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/(presentation-generator)/home/components/Header";
import { SchoolSearchHero } from "@/app/(presentation-generator)/home/components/SchoolSearchHero";
import { TemplateGallery } from "@/app/(presentation-generator)/home/components/TemplateGallery";
import { School } from "@/app/(presentation-generator)/home/components/mockData";

const HomePage: React.FC = () => {
  const router = useRouter();
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [activeTab, setActiveTab] = useState<'recommended' | 'general'>('recommended');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <Header />
      
      <SchoolSearchHero 
        onSchoolSelect={setSelectedSchool}
        selectedSchool={selectedSchool}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold text-slate-900">
            {activeTab === 'recommended' ? '精选模板' : '通用/快速模板'}
          </h2>
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('recommended')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'recommended'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              精选模板
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'general'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              通用/快速
            </button>
          </div>
        </div>

        <TemplateGallery 
            selectedSchool={selectedSchool}
            category={activeTab}
        />
      </main>
    </div>
  );
};

export default HomePage;
