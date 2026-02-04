
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Filter, Check, Plus, Heart, Loader2, ExternalLink, Sparkles, Upload, FileUp, X } from 'lucide-react';
import { FILTERS, SCHOOLS, School } from './mockData';
import { useRouter } from 'next/navigation';
import { UserConfigApi } from '@/app/(presentation-generator)/services/api/user-config';
import { useLayout } from '@/app/(presentation-generator)/context/LayoutContext';
import { Card } from '@/components/ui/card';
import { getHeader } from '@/app/(presentation-generator)/services/api/header';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface TemplateGalleryProps {
  selectedSchool: School | null;
  category?: 'recommended' | 'general' | 'favorites' | 'custom';
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ selectedSchool, category = 'recommended' }) => {
  const router = useRouter();
  const [selectedMajor, setSelectedMajor] = useState('全部');
  const [selectedUsage, setSelectedUsage] = useState('全部');
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // 模板上传对话框状态
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // 自定义模板的元数据（名称、描述、更新时间）
  const [customTemplateMeta, setCustomTemplateMeta] = useState<Record<string, { 
    lastUpdatedAt?: number; 
    name?: string; 
    description?: string 
  }>>({});

  // 使用 LayoutContext 获取模板数据
  const {
    getAllTemplateIDs,
    getLayoutsByTemplateID,
    getTemplateSetting,
    getFullDataByTemplateID,
    loading,
    error,
  } = useLayout();

  useEffect(() => {
    // 加载 Tailwind CSS（用于模板渲染）
    const existingScript = document.querySelector('script[src*="tailwindcss.com"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://cdn.tailwindcss.com';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // 获取自定义模板的元数据
  useEffect(() => {
    fetch('/api/v1/ppt/template-management/summary', {
      headers: getHeader(),
    })
      .then((res) => res.json())
      .then((data) => {
        const map: Record<string, { lastUpdatedAt?: number; name?: string; description?: string }> = {};
        if (data && Array.isArray(data.presentations)) {
          for (const p of data.presentations) {
            const slug = `custom-${p.presentation_id}`;
            map[slug] = {
              lastUpdatedAt: p.last_updated_at ? new Date(p.last_updated_at).getTime() : 0,
              name: p.template?.name,
              description: p.template?.description,
            };
          }
        }
        setCustomTemplateMeta(map);
      })
      .catch(() => setCustomTemplateMeta({}));
  }, []);

  useEffect(() => {
    // Load favorites
    UserConfigApi.getConfig().then(config => {
      setFavorites(config.favorite_templates || []);
    }).catch(console.error);
  }, []);

  const toggleFavorite = async (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation();
    try {
        const newFavorites = await UserConfigApi.toggleFavorite(templateId);
        setFavorites(newFavorites);
    } catch (err) {
        console.error('Failed to toggle favorite', err);
    }
  };

  // 将 context 数据转换为模板列表
  const layoutTemplates = useMemo(() => {
    return getAllTemplateIDs().map((templateID) => ({
      templateID,
      layouts: getLayoutsByTemplateID(templateID),
      settings: getTemplateSetting(templateID) || { description: '', ordered: false, name: templateID },
      isCustom: templateID.toLowerCase().startsWith('custom-'),
    }));
  }, [getAllTemplateIDs, getLayoutsByTemplateID, getTemplateSetting]);

  // 内置模板（排除 custom- 开头的）
  const inBuiltTemplates = useMemo(() => {
    return layoutTemplates.filter(g => !g.isCustom);
  }, [layoutTemplates]);

  // 自定义模板（custom- 开头的），按更新时间排序
  const customTemplates = useMemo(() => {
    return layoutTemplates
      .filter(g => g.isCustom)
      .sort((a, b) => 
        (customTemplateMeta[b.templateID]?.lastUpdatedAt || 0) - 
        (customTemplateMeta[a.templateID]?.lastUpdatedAt || 0)
      );
  }, [layoutTemplates, customTemplateMeta]);

  // 根据 category 筛选模板
  const filteredTemplates = useMemo(() => {
    let templates = inBuiltTemplates;

    // 根据 category 筛选
    if (category === 'recommended') {
      // 推荐：显示学校特定模板
      if (selectedSchool) {
        templates = templates.filter(t => {
          // Strict matching: split templateID by '_' and check if it contains the school ID as a distinct token
          // This prevents "zju" from matching "school_zjut_opening"
          const tokens = t.templateID.toLowerCase().split('_');
          return tokens.includes(selectedSchool.id.toLowerCase());
        });
      } else {
        // 没选择学校时，显示所有学校特定模板（包含 school_ 的）
        templates = templates.filter(t => t.templateID.toLowerCase().includes('school_'));
      }
    } else if (category === 'general') {
      // 通用：显示非学校特定模板
      templates = templates.filter(t => !t.templateID.toLowerCase().includes('school_'));
    } else if (category === 'favorites') {
      templates = templates.filter(t => favorites.includes(t.templateID));
    }

    // 根据用途筛选
    if (selectedUsage !== '全部') {
      const usageMap: Record<string, string> = {
        '开题报告': 'opening',
        '毕业答辩': 'defense',
        '期末汇报': 'report',
        '组会汇报': 'meeting',
        '学术讲座': 'lecture',
      };
      const usageKey = usageMap[selectedUsage];
      if (usageKey) {
        templates = templates.filter(t => t.templateID.toLowerCase().includes(usageKey));
      }
    }

    return templates;
  }, [inBuiltTemplates, selectedSchool, selectedUsage, category, favorites]);

  const handleTemplateClick = (templateID: string) => {
    // 跳转到模板详情页
    router.push(`/template-preview/${templateID}`);
  };

  const handleUseTemplate = (e: React.MouseEvent, templateID: string) => {
    e.stopPropagation();
    // 使用此模板创建 PPT
    const params = new URLSearchParams();
    params.set('templateId', templateID);
    if (selectedSchool) {
      params.set('schoolName', selectedSchool.name);
    }
    router.push(`/upload?${params.toString()}`);
  };

  // 模板上传相关处理函数
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.toLowerCase().endsWith('.pptx')) {
        setUploadFile(file);
      } else {
        toast.error('仅支持 .pptx 格式的文件');
      }
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.toLowerCase().endsWith('.pptx')) {
        setUploadFile(file);
      } else {
        toast.error('仅支持 .pptx 格式的文件');
      }
    }
  }, []);

  const handleUploadTemplate = async () => {
    if (!uploadFile) return;
    
    // 验证文件大小 (50MB)
    const maxSize = 50 * 1024 * 1024;
    if (uploadFile.size > maxSize) {
      toast.error('文件大小不能超过 50MB');
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      
      const response = await fetch('/api/v1/templates/request-upload', {
        method: 'POST',
        // 不设置 Content-Type，让浏览器自动设置 multipart/form-data 和 boundary
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || '上传失败');
      }
      
      toast.success('上传成功！我们正在处理您的模板，请耐心等待。');
      setIsUploadDialogOpen(false);
      setUploadFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : '上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenUploadDialog = () => {
    setUploadFile(null);
    setIsUploadDialogOpen(true);
  };

  // 加载状态
  if (loading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-slate-500">加载模板中...</p>
          </div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-xl">!</span>
            </div>
            <p className="text-slate-700 font-medium">加载模板失败</p>
            <p className="text-slate-500 text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-6">
            
            {/* Filter Group: Major */}
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-3 text-sm font-medium text-slate-700">
                    <Filter className="w-4 h-4" />
                    <span>学院 / 专业</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {FILTERS.majors.map(major => (
                        <button
                            key={major}
                            onClick={() => setSelectedMajor(major)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                selectedMajor === major 
                                ? 'bg-indigo-100 text-indigo-700 font-medium' 
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {major}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-px bg-slate-200 hidden sm:block"></div>

            {/* Filter Group: Usage */}
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-3 text-sm font-medium text-slate-700">
                    <Filter className="w-4 h-4" />
                    <span>用途类型</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {FILTERS.usages.map(usage => (
                        <button
                            key={usage}
                            onClick={() => setSelectedUsage(usage)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                selectedUsage === usage 
                                ? 'bg-purple-100 text-purple-700 font-medium' 
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {usage}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* AI 自定义模板区域 */}
      {customTemplates.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-slate-900">AI 生成的模板</h2>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                {customTemplates.length}
              </span>
            </div>
            <button
              onClick={() => router.push('/custom-template')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              创建新模板 <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customTemplates.map((template) => {
              const layoutTemplate = getFullDataByTemplateID(template.templateID);
              const meta = customTemplateMeta[template.templateID];
              const displayName = meta?.name || template.settings.name || template.templateID;
              const displayDescription = meta?.description || template.settings.description || '';

              return (
                <Card
                  key={template.templateID}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 group border border-purple-200 overflow-hidden bg-gradient-to-br from-purple-50/50 to-white"
                  onClick={() => handleTemplateClick(template.templateID)}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <h3 className="text-lg font-semibold text-slate-900 capitalize group-hover:text-purple-600 transition-colors">
                          {displayName}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {template.layouts.length} 页
                        </span>
                        <button
                          onClick={(e) => toggleFavorite(e, template.templateID)}
                          className={`p-1.5 rounded-full transition-colors ${
                            favorites.includes(template.templateID)
                              ? 'bg-rose-100 text-rose-500'
                              : 'text-slate-400 hover:bg-slate-100 hover:text-rose-500'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(template.templateID) ? 'fill-current' : ''}`} />
                        </button>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                      {displayDescription}
                    </p>

                    {/* Layout Previews */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {layoutTemplate &&
                        layoutTemplate.slice(0, 4).map((layout: any, index: number) => {
                          const {
                            component: LayoutComponent,
                            sampleData,
                            templateID,
                          } = layout;
                          return (
                            <div
                              key={`${templateID}-${index}`}
                              className="relative border border-purple-200 rounded overflow-hidden aspect-video bg-white"
                            >
                              <div className="absolute inset-0 bg-transparent z-10" />
                              <div className="transform scale-[0.2] origin-top-left w-[500%] h-[500%]">
                                <LayoutComponent data={sampleData} />
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={(e) => handleUseTemplate(e, template.templateID)}
                      className="w-full py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
                      立即使用 <Check className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* 内置模板标题 */}
      {filteredTemplates.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-slate-900">内置模板</h2>
          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
            {filteredTemplates.length}
          </span>
        </div>
      )}

      {/* Templates Grid - 使用与 template-preview 相同的卡片样式 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const layoutTemplate = getFullDataByTemplateID(template.templateID);
          const displayName = template.settings.name || template.templateID;
          const displayDescription = template.settings.description || '';

          return (
            <Card
              key={template.templateID}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 group border border-slate-200 overflow-hidden"
              onClick={() => handleTemplateClick(template.templateID)}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-900 capitalize group-hover:text-indigo-600 transition-colors">
                    {displayName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                      {template.layouts.length} 页
                    </span>
                    <button
                      onClick={(e) => toggleFavorite(e, template.templateID)}
                      className={`p-1.5 rounded-full transition-colors ${
                        favorites.includes(template.templateID)
                          ? 'bg-rose-100 text-rose-500'
                          : 'text-slate-400 hover:bg-slate-100 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(template.templateID) ? 'fill-current' : ''}`} />
                    </button>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {displayDescription}
                </p>

                {/* Layout Previews - 显示前4个布局的预览 */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {layoutTemplate &&
                    layoutTemplate.slice(0, 4).map((layout: any, index: number) => {
                      const {
                        component: LayoutComponent,
                        sampleData,
                        templateID,
                      } = layout;
                      return (
                        <div
                          key={`${templateID}-${index}`}
                          className="relative border border-slate-200 rounded overflow-hidden aspect-video bg-white"
                        >
                          <div className="absolute inset-0 bg-transparent z-10" />
                          <div className="transform scale-[0.2] origin-top-left w-[500%] h-[500%]">
                            <LayoutComponent data={sampleData} />
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => handleUseTemplate(e, template.templateID)}
                  className="w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  立即使用 <Check className="w-4 h-4" />
                </button>
              </div>
            </Card>
          );
        })}

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium mb-1">暂无匹配的模板</p>
            <p className="text-slate-400 text-sm">请尝试调整筛选条件</p>
          </div>
        )}

        {/* Add Custom Template Card */}
        <Card
          onClick={handleOpenUploadDialog}
          className="cursor-pointer hover:shadow-lg transition-all duration-200 group border-2 border-dashed border-slate-300 hover:border-indigo-500"
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                添加自定义模版
              </h3>
              <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <p className="text-sm text-slate-600 mb-4">
              上传您的 PPT 模板，我们将人工审核后录入系统
            </p>
            <div className="flex-1 flex items-center justify-center min-h-[200px] bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
              <FileUp className="w-12 h-12 text-slate-300 group-hover:text-indigo-400 transition-colors" />
            </div>
          </div>
        </Card>
      </div>

      {/* Template Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">提交模板收录申请</DialogTitle>
            <DialogDescription className="text-slate-600">
              上传您学校或公司的 PPT 模板，我们团队将人工适配并录入系统，以确保最佳质量。
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${isDragging 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : uploadFile 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                }
              `}
            >
              <input
                type="file"
                accept=".pptx"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              
              {uploadFile ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">{uploadFile.name}</p>
                  <p className="text-xs text-slate-500">
                    {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadFile(null);
                    }}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mx-auto"
                  >
                    <X className="w-3 h-3" /> 移除文件
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
                    <FileUp className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    拖拽文件到此处，或点击选择文件
                  </p>
                  <p className="text-xs text-slate-500">
                    仅支持 .pptx 格式，最大 50MB
                  </p>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUploadTemplate}
              disabled={!uploadFile || isUploading}
              className={`
                w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2
                ${uploadFile && !isUploading
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }
              `}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  上传中...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  上传
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
