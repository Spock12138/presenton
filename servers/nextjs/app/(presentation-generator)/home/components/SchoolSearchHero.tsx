
import React, { useState, useEffect } from 'react';
import { Search, GraduationCap, MapPin } from 'lucide-react';
import { SCHOOLS, School } from './mockData';

interface SchoolSearchHeroProps {
  onSchoolSelect: (school: School | null) => void;
  selectedSchool: School | null;
}

export const SchoolSearchHero: React.FC<SchoolSearchHeroProps> = ({ onSchoolSelect, selectedSchool }) => {
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (selectedSchool) {
      setSearchValue(selectedSchool.name);
    } else if (selectedSchool === null) {
        setSearchValue('');
    }
  }, [selectedSchool]);

  const handleSearch = () => {
    if (!searchValue.trim()) {
      onSchoolSelect(null);
      return;
    }
    const school = SCHOOLS.find(s => s.name.includes(searchValue) || s.id.includes(searchValue.toLowerCase()));
    if (school) {
      onSchoolSelect(school);
    } else {
      // Optional: Show toast or feedback
      onSchoolSelect(null);
    }
  };

  const handleHotSchoolClick = (schoolId: string) => {
    const school = SCHOOLS.find(s => s.id === schoolId);
    if (school) {
      onSchoolSelect(school);
    }
  };

  const HOT_SCHOOLS = [
    { id: 'zju', name: '浙江大学' },
    { id: 'pku', name: '北京大学' },
    { id: 'tsinghua', name: '清华大学' },
    { id: 'fudan', name: '复旦大学' }
  ];

  return (
    <div className="bg-white border-b border-slate-200 py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-8">
        <GraduationCap className="w-4 h-4" />
        <span>专注高校演示文稿生成</span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
        选择你的学校，定制专属PPT
      </h1>
      <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto">
        包含校徽、校训及院系特色的专属模板，让你的汇报更胜一筹。
      </p>
      
      <div className="max-w-xl mx-auto mb-8 relative z-10">
        <div className="relative flex items-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl bg-white p-2 border border-slate-100 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <div className="pl-4 text-slate-400">
            <MapPin className="w-5 h-5" />
          </div>
          <input 
            type="text"
            className="flex-1 border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 text-lg py-2 px-4 outline-none"
            placeholder="输入学校名称，如：浙江大学"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            className="px-6 py-2 text-indigo-600 font-semibold hover:bg-indigo-50 rounded-xl transition-colors shrink-0"
          >
            搜索
          </button>
        </div>
      </div>

      {/* Hot Schools */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
        <span className="font-medium">热门高校：</span>
        {HOT_SCHOOLS.map(school => (
          <button
            key={school.id}
            onClick={() => handleHotSchoolClick(school.id)}
            className="px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm hover:border-indigo-100 hover:text-indigo-600 transition-all"
          >
            {school.name}
          </button>
        ))}
      </div>
    </div>
  );
};
