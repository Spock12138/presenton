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
import { z } from "zod";

// Zod schema for validation
const registerSchema = z.object({
  nickname: z.string().min(2, "昵称至少需要2个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string()
    .min(8, "密码至少需要8个字符")
    .regex(/[A-Za-z]/, "密码需要包含字母")
    .regex(/[0-9]/, "密码需要包含数字"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
});

const RegisterPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear error when user types
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // Success
      dispatch(login({
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.nickname}`,
        nickname: formData.nickname,
        level: "normal",
        freeQuota: 5,
        email: formData.email,
        wechatBound: false
      }));
      
      toast.success("注册成功，欢迎加入！");
      router.push("/home");
    }, 1500);
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
              创建您的账号
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              注册即享免费额度，开启 AI 演示之旅
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nickname">昵称</Label>
              <Input 
                id="nickname" 
                placeholder="如何称呼您"
                value={formData.nickname}
                onChange={handleChange}
                className={errors.nickname ? "border-red-500 focus-visible:ring-red-200" : ""}
              />
              {errors.nickname && <p className="text-xs text-red-500 mt-1">{errors.nickname}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">邮箱地址</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500 focus-visible:ring-red-200" : ""}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">设置密码</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="8位以上，包含字母和数字"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "border-red-500 focus-visible:ring-red-200" : ""}
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
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="请再次输入密码"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-200" : ""}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg shadow-indigo-500/20" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  注册中...
                </div>
              ) : "立即注册"}
            </Button>

            <div className="text-center text-xs text-slate-500 mt-4">
              点击注册即表示同意
              <Link href="#" className="text-indigo-600 hover:underline mx-1">用户协议</Link>
              和
              <Link href="#" className="text-indigo-600 hover:underline mx-1">隐私政策</Link>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              已有账号？
              <Button variant="link" className="text-indigo-600 font-medium px-1" onClick={() => {
                // Open login dialog? Or link to login page if we had one.
                // For now, let's just go back to home and open login dialog?
                // Or maybe the user wants a separate login page too? 
                // Let's assume for now we go back to home.
                router.push("/home");
              }}>
                立即登录
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
