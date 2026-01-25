import React from "react";
import { PresentationCard } from "./PresentationCard";
import { Plus, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PresentationResponse } from "@/app/(presentation-generator)/services/api/dashboard";

interface PresentationGridProps {
  presentations: PresentationResponse[];
  type: "slide" | "video";
  isLoading?: boolean;
  error?: string | null;
  onPresentationDeleted?: (presentationId: string) => void;
}

export const PresentationGrid = ({
  presentations,
  type,
  isLoading = false,
  error = null,
  onPresentationDeleted,
}: PresentationGridProps) => {
  const router = useRouter();
  const handleCreateNewPresentation = () => {
    if (type === "slide") {
      router.push("/upload");
    } else {
      router.push("/editor");
    }
  };

  const ShimmerCard = () => (
    <div className="flex flex-col gap-4 min-h-[240px] bg-white rounded-xl p-4 animate-pulse shadow-sm">
      <div className="w-full aspect-video bg-slate-100 rounded-lg"></div>
      <div className="space-y-3 mt-auto">
        <div className="h-4 bg-slate-100 rounded w-3/4"></div>
        <div className="h-3 bg-slate-100 rounded w-1/2"></div>
      </div>
    </div>
  );

  const CreateNewCard = () => (
    <div
      onClick={handleCreateNewPresentation}
      className="group relative flex flex-col gap-4 min-h-[240px] cursor-pointer border-2 border-dashed border-slate-200 hover:border-indigo-300 bg-white/50 hover:bg-gradient-to-br hover:from-indigo-50/80 hover:to-purple-50/80 rounded-xl items-center justify-center transition-all duration-300 overflow-hidden"
    >
      {/* Decorative gradient blob */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 group-hover:from-indigo-100 group-hover:to-purple-100 p-4 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-200/50">
          <Wand2 className="w-8 h-8 text-slate-400 group-hover:text-indigo-600 transition-colors duration-300" />
        </div>
        <h3 className="font-semibold text-slate-700 group-hover:text-slate-900 mb-1 transition-colors">
          新建演示文稿
        </h3>
        <p className="text-sm text-slate-400 group-hover:text-slate-500 text-center px-6 transition-colors">
          让 AI 帮你创建专业 PPT
        </p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="flex flex-col gap-4 min-h-[240px] cursor-pointer border-2 border-dashed border-slate-200 bg-white/50 rounded-xl items-center justify-center animate-pulse">
          <div className="rounded-2xl bg-slate-100 p-4 mb-4">
            <div className="w-8 h-8" />
          </div>
          <div className="text-center space-y-2 px-6">
            <div className="h-4 bg-slate-100 rounded w-28 mx-auto"></div>
            <div className="h-3 bg-slate-100 rounded w-36 mx-auto"></div>
          </div>
        </div>
        {[...Array(3)].map((_, i) => (
          <ShimmerCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <CreateNewCard />
        <div className="col-span-full sm:col-span-1 lg:col-span-2 xl:col-span-3 flex items-center justify-center py-12">
          <div className="text-center text-slate-500">
            <p className="mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-indigo-600 hover:text-indigo-700 font-medium underline underline-offset-2"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!presentations || presentations.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <CreateNewCard />
        <div className="col-span-full sm:col-span-1 lg:col-span-2 xl:col-span-3 flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Plus className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">还没有演示文稿</h3>
            <p className="text-slate-500">点击左侧卡片或使用上方输入框创建你的第一个演示文稿</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <CreateNewCard />
      {presentations.map((presentation) => (
        <PresentationCard
          key={presentation.id}
          id={presentation.id}
          title={presentation.title}
          created_at={presentation.created_at}
          slide={presentation.slides[0]}
          onDeleted={onPresentationDeleted}
        />
      ))}
    </div>
  );
};
