import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { login, logout } from "@/store/slices/userProfile";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Settings, 
  CreditCard, 
  LogOut, 
  Crown, 
  HelpCircle,
  FolderOpen,
  Layout
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProfileSettingsDialog from "./ProfileSettingsDialog";

const UserProfileMenu = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoggedIn, userInfo } = useSelector((state: RootState) => state.userProfile);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    toast.info("已退出登录");
    // Clear session from localStorage
    localStorage.removeItem("auth_session");
    // Redirect to home or stay on current page (home)
    router.push("/home");
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/login">登录</Link>
        </Button>
        <Button asChild>
          <Link href="/register">注册</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <PopoverTrigger asChild>
          <button className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 hover:ring-2 hover:ring-indigo-100 transition-all focus:outline-none">
            <img 
              src={userInfo.avatar} 
              alt={userInfo.nickname} 
              className="w-full h-full object-cover"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="end">
          {/* Header Section */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-white shadow-sm">
                <img 
                  src={userInfo.avatar} 
                  alt={userInfo.nickname} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 truncate">{userInfo.nickname}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    普通用户
                  </span>
                  {/* Placeholder for Member Badge */}
                  {/* <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700 border border-amber-200">
                    <Crown className="w-3 h-3 mr-1" /> 会员
                  </span> */}
                </div>
              </div>
            </div>
            
            {/* Quota Section */}
            <div className="bg-white rounded-md border border-slate-200 p-3 shadow-sm">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-500">剩余免费额度</span>
                <span className="font-medium text-indigo-600">{userInfo.freeQuota} 次</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div 
                  className="bg-indigo-500 h-1.5 rounded-full" 
                  style={{ width: `${Math.min((userInfo.freeQuota / 10) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="mt-2 text-[10px] text-slate-400 text-center">
                升级会员解锁无限额度
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <Link 
              href="/my-presentations" 
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <FolderOpen className="w-4 h-4 text-slate-400" />
              我的演示
            </Link>
            
            <button 
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors text-left"
              onClick={() => {
                setIsMenuOpen(false);
                setIsProfileOpen(true);
              }}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              账号设置
            </button>

            <button 
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors text-left"
            >
              <CreditCard className="w-4 h-4 text-slate-400" />
              订阅管理
              <span className="ml-auto text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">PRO</span>
            </button>
            
            <div className="h-px bg-slate-100 my-1"></div>
            
            <button 
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors text-left"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              帮助与支持
            </button>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </button>
          </div>
        </PopoverContent>
      </Popover>

      <ProfileSettingsDialog open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </>
  );
};

export default UserProfileMenu;
