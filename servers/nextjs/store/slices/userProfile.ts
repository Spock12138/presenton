import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserInfo {
  avatar: string;
  nickname: string;
  level: "normal" | "vip";
  freeQuota: number;
  phone?: string;
  email?: string;
  wechatBound?: boolean;
}

interface UserProfileState {
  isLoggedIn: boolean;
  userInfo: UserInfo;
}

const initialState: UserProfileState = {
  isLoggedIn: false,
  userInfo: {
    avatar: "https://github.com/shadcn.png",
    nickname: "Guest User",
    level: "normal",
    freeQuota: 3,
    phone: "",
    email: "",
    wechatBound: false,
  },
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserInfo>) => {
      state.isLoggedIn = true;
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      // Reset to default guest state or keep last known? Resetting is safer.
      state.userInfo = initialState.userInfo;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserInfo>>) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
    },
    // For demo purposes, quick actions
    setQuota: (state, action: PayloadAction<number>) => {
      state.userInfo.freeQuota = action.payload;
    },
  },
});

export const { login, logout, updateProfile, setQuota } = userProfileSlice.actions;
export default userProfileSlice.reducer;
