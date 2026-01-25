import React, { useMemo } from "react";

import { Card } from "@/components/ui/card";
import { DashboardApi } from "@/app/(presentation-generator)/services/api/dashboard";
import { MoreHorizontal, Trash2, Download, Edit3 } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTemplateLayouts } from "@/app/(presentation-generator)/hooks/useTemplateLayouts";

// Helper function to format relative time
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "刚刚";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} 分钟前`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} 小时前`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} 天前`;
  
  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
};

export const PresentationCard = ({
  id,
  title,
  created_at,
  slide,
  onDeleted
}: {
  id: string;
  title: string;
  created_at: string;
  slide: any;
  onDeleted?: (presentationId: string) => void;
}) => {
  const router = useRouter();
  const { renderSlideContent } = useTemplateLayouts();

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/presentation?id=${id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const response = await DashboardApi.deletePresentation(id);

    if (response) {
      toast.success("演示文稿已删除", {
        description: "该演示文稿已成功删除",
      });
      if (onDeleted) {
        onDeleted(id);
      }
    } else {
      toast.error("删除演示文稿时出错");
    }
  };

  return (
    <Card
      onClick={handlePreview}
      className="group bg-white rounded-xl cursor-pointer overflow-hidden border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md hover:shadow-slate-200/50 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-slate-50 overflow-hidden">
        <div className="absolute bg-transparent z-40 top-0 left-0 w-full h-full" />
        <div className="transform scale-[0.2] flex justify-center items-center origin-top-left w-[500%] h-[500%]">
          {renderSlideContent(slide, false)}
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-slate-800 truncate group-hover:text-slate-900 transition-colors">
              {title || "无标题"}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {formatRelativeTime(created_at)}
            </p>
          </div>
          
          {/* Actions Menu */}
          <Popover>
            <PopoverTrigger 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-200" 
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </PopoverTrigger>
            <PopoverContent align="end" className="bg-white w-[160px] p-1 shadow-lg border border-slate-100 rounded-lg">
              <button
                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/presentation?id=${id}`);
                }}
              >
                <Edit3 className="w-4 h-4" />
                <span>编辑</span>
              </button>
              <button
                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
                <span>删除</span>
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </Card>
  );
};
