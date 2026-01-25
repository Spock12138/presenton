"use client";

import React from "react";
import Link from "next/link";
import BackBtn from "@/components/BackBtn";
import { usePathname, useRouter } from "next/navigation";
import { Layout, Layers, Plus, LayoutDashboard } from "lucide-react";
import { trackEvent, MixpanelEvent } from "@/utils/mixpanel";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Brand */}
          <div className="flex items-center gap-6">
            {(pathname !== "/upload" && pathname !== "/dashboard") && <BackBtn />}
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3"
              onClick={() => trackEvent(MixpanelEvent.Navigation, { from: pathname, to: "/dashboard" })}
            >
              <img
                src="/jibaoLogo.png"
                alt="吉豹科技"
                className="h-9 object-contain"
              />
            </Link>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/dashboard"
              prefetch={false}
              onClick={() => trackEvent(MixpanelEvent.Navigation, { from: pathname, to: "/dashboard" })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === "/dashboard" 
                  ? "text-indigo-700 bg-indigo-50" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>仪表盘</span>
            </Link>
            <Link
              href="/template-preview"
              prefetch={false}
              onClick={() => trackEvent(MixpanelEvent.Navigation, { from: pathname, to: "/template-preview" })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === "/template-preview" 
                  ? "text-indigo-700 bg-indigo-50" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>模板库</span>
            </Link>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/upload"
              prefetch={false}
              onClick={() => trackEvent(MixpanelEvent.Navigation, { from: pathname, to: "/upload" })}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md hover:shadow-indigo-500/25"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">新建项目</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
