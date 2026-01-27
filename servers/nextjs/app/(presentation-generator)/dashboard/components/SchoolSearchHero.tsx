
import React from 'react';
import { Search } from 'lucide-react';
import { SCHOOLS, School } from './mockData';

interface SchoolSearchHeroProps {
  onSchoolSelect: (school: School | null) => void;
  selectedSchool: School | null;
}

export const SchoolSearchHero: React.FC<SchoolSearchHeroProps> = ({ onSchoolSelect, selectedSchool }) => {
  return (
    <div className="bg-white border-b border-slate-200 py-12 px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">
        选择你的学校，获取专属模板
      </h1>
      <p className="text-slate-500 mb-8 max-w-2xl mx-auto">
        我们需要知道你所在的学校，以便为你推荐符合学校视觉规范的 PPT 模板
      </p>
      
      <div className="max-w-md mx-auto relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <select
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white text-slate-900"
            value={selectedSchool?.id || ''}
            onChange={(e) => {
              const school = SCHOOLS.find(s => s.id === e.target.value) || null;
              onSchoolSelect(school);
            }}
          >
            <option value="">全部学校 / 通用模板</option>
            {SCHOOLS.map(school => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
