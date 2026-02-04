
import React, { useState, useEffect, useRef } from 'react';
import { Search, GraduationCap, MapPin, Loader2 } from 'lucide-react';

// Use local interface instead of importing from mockData to decouple
export interface School {
  id: string;
  name: string;
  logo?: string;
}

interface SchoolSearchHeroProps {
  onSchoolSelect: (school: School | null) => void;
  selectedSchool: School | null;
}

export const SchoolSearchHero: React.FC<SchoolSearchHeroProps> = ({ onSchoolSelect, selectedSchool }) => {
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedSchool) {
      setSearchValue(selectedSchool.name);
    } else if (selectedSchool === null) {
        // Only clear if explicitly null (reset), but if user types, don't clear?
        // Actually when selectedSchool changes to null, we might want to keep text or clear it.
        // If user clears selection, we probably want to clear text.
        // But let's check if this conflicts with typing.
        // If user types, selectedSchool might not change immediately until they select.
        // So this effect only runs when parent changes it.
    }
  }, [selectedSchool]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue.trim()) {
        searchSchools(searchValue);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const searchSchools = async (query: string) => {
    setIsLoading(true);
    try {
      // Increased limit to 50 to allow finding more schools
      const res = await fetch(`/api/v1/schools/search?q=${encodeURIComponent(query)}&limit=50`);
      if (res.ok) {
        const data = await res.json();
        const mapped: School[] = data.map((item: any) => ({
           id: item.alias || item.code || String(item.id),
           name: item.name,
           logo: item.logo_url
        }));
        setResults(mapped);
        // Always show dropdown if we have results
        if (mapped.length > 0) {
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
      }
    } catch (err) {
      console.error("Failed to search schools:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (school: School) => {
    onSchoolSelect(school);
    setSearchValue(school.name);
    setShowDropdown(false);
  };

  const handleSearchClick = () => {
      // If user clicks search, and we have results, select the first one?
      // Or just trigger search again?
      if (results.length > 0) {
          handleSelect(results[0]);
      } else {
          // Maybe trigger a search immediately?
          searchSchools(searchValue);
      }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-12 mb-12 px-4">
      <div className="text-center mb-10">
        {selectedSchool ? (
          <>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              已选择 <span className="text-indigo-600">{selectedSchool.name}</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              包含校徽、校训及院系特色的专属模板，让你的汇报更胜一筹。
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              选择你的学校，定制专属PPT
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              包含校徽、校训及院系特色的专属模板，让你的汇报更胜一筹。
            </p>
          </>
        )}
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
        <div className="relative flex items-center bg-white rounded-xl shadow-xl ring-1 ring-slate-900/5">
          <div className="flex-none p-4 text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <input 
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              // Clear selection when user types new query
              if (selectedSchool && e.target.value !== selectedSchool.name) {
                onSchoolSelect(null);
              }
            }}
            onFocus={() => {
               if (results.length > 0) setShowDropdown(true);
               // Trigger search if empty?
               if (!searchValue && !selectedSchool) {
                   // Optional: show recent or popular schools?
               }
            }}
            placeholder="搜索你的学校（如：浙江大学）..."
            className="flex-auto py-4 pr-4 text-lg text-slate-900 placeholder:text-slate-400 bg-transparent border-none focus:ring-0 focus:outline-none"
          />
          <div className="flex-none p-2">
            <button 
                onClick={handleSearchClick}
                className="px-6 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "搜索"}
            </button>
          </div>
        </div>

        {/* Results Dropdown */}
        {showDropdown && results.length > 0 && (
          <div 
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl ring-1 ring-black/5 overflow-hidden z-50 max-h-80 overflow-y-auto"
          >
            <div className="p-2">
              {results.map((school) => (
                <button
                  key={school.id}
                  onClick={() => handleSelect(school)}
                  className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left group/item"
                >
                  <div className="flex-none p-2 bg-slate-100 rounded-lg text-slate-400 group-hover/item:text-indigo-600 group-hover/item:bg-indigo-50 transition-colors">
                    {school.logo ? (
                        <img src={school.logo} alt={school.name} className="w-6 h-6 object-contain" />
                    ) : (
                        <GraduationCap className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-auto">
                    <div className="font-medium text-slate-900">{school.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
