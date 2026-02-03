"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/userProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("请输入账号和密码");
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Mock validation
      if (email.includes("@") && password.length >= 6) {
        const userInfo = {
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email.split('@')[0]}`,
          nickname: "演示用户",
          level: "normal" as const,
          freeQuota: 5,
          email: email,
          phone: "138****8888",
          wechatBound: true
        };

        // Redux Login
        dispatch(login(userInfo));
        
        // Persistent Login (48 hours)
        const expiry = new Date().getTime() + 48 * 60 * 60 * 1000;
        localStorage.setItem("auth_session", JSON.stringify({
          expiry,
          user: userInfo
        }));

        toast.success("登录成功，欢迎回来！");
        router.push("/home");
      } else {
        toast.error("账号或密码错误");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-200/20 blur-3xl"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-200/20 blur-3xl"></div>
      </div>

      {/* Header/Nav */}
      <div className="relative z-10 p-6">
        <Link href="/home" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回首页
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src="/jibaoLogo.png" alt="JiBao Tech" className="h-12 object-contain" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              欢迎回来
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              登录您的账号以继续使用完整功能
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱 / 手机号</Label>
              <Input 
                id="email" 
                type="text"
                placeholder="请输入邮箱或手机号"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">密码</Label>
                <Button variant="link" className="p-0 h-auto text-xs text-indigo-600" type="button">
                  忘记密码?
                </Button>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg shadow-indigo-500/20" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  登录中...
                </div>
              ) : "立即登录"}
            </Button>

            <div className="text-center text-sm text-slate-600 mt-4">
              还没有账号？
              <Link href="/register" className="text-indigo-600 font-medium hover:underline ml-1">
                立即注册
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
