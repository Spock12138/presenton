import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updateProfile } from "@/store/slices/userProfile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User, Shield, Key, Mail, Smartphone, LogOut } from "lucide-react";

interface ProfileSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileSettingsDialog = ({ open, onOpenChange }: ProfileSettingsDialogProps) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.userProfile);
  
  const [nickname, setNickname] = useState(userInfo.nickname);
  const [activeTab, setActiveTab] = useState("profile");

  const handleSaveProfile = () => {
    dispatch(updateProfile({ nickname }));
    toast.success("个人信息已更新");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>账号管理</DialogTitle>
          <DialogDescription>
            管理您的个人信息和账号安全设置
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">个人资料</TabsTrigger>
            <TabsTrigger value="security">账号安全</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100">
                <img 
                  src={userInfo.avatar} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-white text-xs">更换头像</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nickname">昵称</Label>
              <Input 
                id="nickname" 
                value={nickname} 
                onChange={(e) => setNickname(e.target.value)} 
                placeholder="请输入昵称"
              />
            </div>
            
            <div className="pt-4 flex justify-end">
               <Button onClick={handleSaveProfile}>保存修改</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">登录密码</div>
                    <div className="text-xs text-slate-500">定期修改密码可以保护账号安全</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">修改</Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-full text-green-600">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">手机绑定</div>
                    <div className="text-xs text-slate-500">{userInfo.phone || "未绑定手机号"}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">{userInfo.phone ? "更换" : "绑定"}</Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 rounded-full text-orange-600">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">邮箱绑定</div>
                    <div className="text-xs text-slate-500">{userInfo.email || "未绑定邮箱"}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">{userInfo.email ? "更换" : "绑定"}</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettingsDialog;
