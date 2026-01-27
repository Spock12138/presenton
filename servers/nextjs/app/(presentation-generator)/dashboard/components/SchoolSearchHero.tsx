
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, School as SchoolIcon, ChevronRight } from 'lucide-react';
import { SCHOOLS, School } from './mockData';

interface SchoolSearchHeroProps {
  onSchoolSelect: (school: School | null) => void;
  selectedSchool: School | null;
}

export const SchoolSearchHero: React.FC<SchoolSearchHeroProps> = ({ onSchoolSelect, selectedSchool }) => {
  const [inputValue, setInputValue] = useState(selectedSchool?.name || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(selectedSchool?.name || '');
  }, [selectedSchool]);

  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredSchools([]);
      return;
    }
    const filtered = SCHOOLS.filter(school => 
      school.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredSchools(filtered);
  }, [inputValue]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSelect = (school: School) => {
    setInputValue(school.name);
    onSchoolSelect(school);
    setShowSuggestions(false);
  };

  return (
    <div className="relative overflow-hidden bg-white shadow-sm border-b border-slate-200">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-100/50 to-cyan-100/50 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-sm text-indigo-700 font-medium mb-6">
              <SchoolIcon className="w-4 h-4" />
              <span>专注高校演示文稿生成</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              {selectedSchool ? (
                <>
                  已选择 <span className="text-indigo-600">{selectedSchool.name}</span>
                </>
              ) : (
                "选择你的学校，定制专属PPT"
              )}
            </h1>
            
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
              包含校徽、校训及院系特色的专属模板，让你的汇报更胜一筹。
            </p>

            {/* Search Box */}
            <div className="max-w-xl mx-auto relative" ref={wrapperRef}>
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
                    <div className="relative flex items-center bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                        <div className="pl-4 text-slate-400">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <input 
                            type="text" 
                            className="flex-1 py-4 px-4 text-slate-800 placeholder:text-slate-400 bg-transparent outline-none text-lg"
                            placeholder="输入学校名称，如：浙江大学"
                            value={inputValue}
                            onChange={(e) => {
                              setInputValue(e.target.value);
                              setShowSuggestions(true);
                              if(e.target.value === '') onSchoolSelect(null);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                        />
                        <button className="pr-4 pl-2 text-indigo-600 font-medium hover:text-indigo-700">
                            搜索
                        </button>
                    </div>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && filteredSchools.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                        {filteredSchools.map(school => (
                            <div 
                                key={school.id}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                                onClick={() => handleSelect(school)}
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <SchoolIcon className="w-4 h-4" />
                                </div>
                                <span className="text-slate-700 font-medium">{school.name}</span>
                                <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Popular Schools Tags */}
            {!selectedSchool && (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <span className="text-sm text-slate-500 py-1">热门高校：</span>
                    {SCHOOLS.slice(0, 4).map(school => (
                        <button 
                            key={school.id}
                            onClick={() => handleSelect(school)}
                            className="px-3 py-1 text-sm text-slate-600 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 rounded-full transition-all"
                        >
                            {school.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};
