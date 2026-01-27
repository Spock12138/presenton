
"use client";

import React, { useState, useEffect } from 'react';
import Header from "@/app/(presentation-generator)/dashboard/components/Header";
import { PresentationGrid } from "@/app/(presentation-generator)/dashboard/components/PresentationGrid";
import { TemplateGallery } from "@/app/(presentation-generator)/dashboard/components/TemplateGallery";
import { DashboardApi } from "@/app/(presentation-generator)/services/api/dashboard";

export const MyPresentationsPage: React.FC = () => {
  const [presentations, setPresentations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        setIsLoading(true);
        const data = await DashboardApi.getPresentations();
        data.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        setPresentations(data);
      } catch (err) {
        setError("Failed to load presentations");
        setPresentations([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPresentations();
  }, []);

  const removePresentation = (id: string) => {
    setPresentations((prev: any) => prev.filter((p: any) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">我的演示文稿</h2>
            <PresentationGrid
              presentations={presentations}
              type="slide"
              isLoading={isLoading}
              error={error}
              onPresentationDeleted={removePresentation}
            />
        </section>

        <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">我的收藏</h2>
            <TemplateGallery selectedSchool={null} category="favorites" />
        </section>
      </main>
    </div>
  );
};
