import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: () => void;
  defaultTab?: "login" | "register";
}

const AuthDialog = ({ open, onOpenChange, onLoginSuccess }: AuthDialogProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
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
      // Simple mock validation
      if (email.includes("@") && password.length >= 6) {
        toast.success("登录成功");
        onLoginSuccess();
        onOpenChange(false);
      } else {
        toast.error("账号或密码错误");
      }
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            欢迎回来
          </DialogTitle>
          <DialogDescription className="text-center">
            登录您的账号以继续使用完整功能
          </DialogDescription>
        </DialogHeader>

        <div className="w-full mt-2">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">邮箱 / 手机号</Label>
                <Input 
                  id="login-email" 
                  type="text" 
                  placeholder="请输入邮箱或手机号"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">密码</Label>
                  <Button variant="link" className="p-0 h-auto text-xs text-indigo-600" type="button">
                    忘记密码?
                  </Button>
                </div>
                <div className="relative">
                  <Input 
                    id="login-password" 
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
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                {loading ? "登录中..." : "立即登录"}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-slate-600">
              还没有账号？
              <Button variant="link" className="text-indigo-600 font-medium px-1" onClick={() => window.location.href = "/register"}>
                立即注册
              </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
