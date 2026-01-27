
import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Check, Plus, Heart } from 'lucide-react';
import { MOCK_TEMPLATES, FILTERS, SCHOOLS, Template, School } from './mockData';
import { useRouter } from 'next/navigation';
import { UserConfigApi } from '@/app/(presentation-generator)/services/api/user-config';

interface TemplateGalleryProps {
  selectedSchool: School | null;
  category?: 'recommended' | 'general' | 'favorites';
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ selectedSchool, category = 'recommended' }) => {
  const router = useRouter();
  const [selectedMajor, setSelectedMajor] = useState('全部');
  const [selectedUsage, setSelectedUsage] = useState('全部');
  const [favorites, setFavorites] = useState<string[]>([]);

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

  const filteredTemplates = useMemo(() => {
    return MOCK_TEMPLATES.filter(template => {
      let matchCategory = true;
      
      if (category === 'recommended') {
         // Show school specific if school selected, otherwise show all SCHOOL specific templates (exclude generic).
         if (selectedSchool) {
             matchCategory = template.schoolId === selectedSchool.id;
         } else {
             // If no school selected, show all school-specific templates (exclude generic/universal)
             matchCategory = template.schoolId !== 'all'; 
         }
       } else if (category === 'general') {
         // Show only generic/universal templates
         matchCategory = template.schoolId === 'all';
       } else if (category === 'favorites') {
        matchCategory = favorites.includes(template.id);
      }

      const matchMajor = selectedMajor === '全部' || template.major === '全部' || template.major === selectedMajor;
      const matchUsage = selectedUsage === '全部' || template.usage === selectedUsage;

      return matchCategory && matchMajor && matchUsage;
    });
  }, [selectedSchool, selectedMajor, selectedUsage, category, favorites]);

  const handleTemplateClick = (template: Template) => {
    // Navigate to creation page with this template selected
    // We pass the template ID and maybe the school name as context
    const params = new URLSearchParams();
    params.set('templateId', template.id);
    if (selectedSchool) {
      params.set('schoolName', selectedSchool.name);
    }
    router.push(`/upload?${params.toString()}`);
  };

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

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map(template => (
            <div 
                key={template.id}
                onClick={() => handleTemplateClick(template)}
                className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-300 transition-all duration-300 cursor-pointer"
            >
                {/* Thumbnail */}
                <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden">
                    <img 
                        src={template.thumbnail} 
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    
                    {/* Tags Overlay */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        {template.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 text-xs font-medium bg-black/50 text-white backdrop-blur-sm rounded">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Favorite Button */}
                    <button
                        onClick={(e) => toggleFavorite(e, template.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors z-10 ${
                            favorites.includes(template.id)
                            ? 'bg-rose-500/90 text-white'
                            : 'bg-black/30 text-white hover:bg-black/50 opacity-0 group-hover:opacity-100'
                        }`}
                    >
                        <Heart className={`w-4 h-4 ${favorites.includes(template.id) ? 'fill-current' : ''}`} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {template.usage}
                        </span>
                        {template.schoolId !== 'all' && (
                             <span className="text-xs text-slate-400">
                                {SCHOOLS.find(s => s.id === template.schoolId)?.name}
                             </span>
                        )}
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-indigo-700 transition-colors">
                        {template.name}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2">
                        {template.description}
                    </p>
                </div>
                
                {/* Hover Action */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-lg">
                        立即使用 <Check className="w-3 h-3" />
                    </span>
                </div>
            </div>
        ))}

        {/* Add Custom Template Card */}
        <div 
            onClick={() => router.push('/custom-template')}
            className="group relative bg-white rounded-xl border-2 border-dashed border-slate-300 overflow-hidden hover:shadow-lg hover:border-indigo-500 transition-all duration-300 cursor-pointer"
        >
            <div className="aspect-[16/9] bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors duration-300">
                <Plus className="w-12 h-12 text-slate-400 group-hover:text-indigo-500 transition-colors duration-300" />
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                     <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded opacity-0">
                        Placeholder
                    </span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-indigo-700 transition-colors">
                    添加自定义模版
                </h3>
                <p className="text-sm text-slate-500">
                    先创建模版，再生成 PPT
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
