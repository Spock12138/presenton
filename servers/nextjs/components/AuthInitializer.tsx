"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/userProfile";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem("auth_session");
      if (storedAuth) {
        const { expiry, user } = JSON.parse(storedAuth);
        
        // Check if session is expired
        if (new Date().getTime() < expiry) {
          dispatch(login(user));
        } else {
          // Clear expired session
          localStorage.removeItem("auth_session");
        }
      }
    } catch (error) {
      console.error("Failed to restore auth session:", error);
      localStorage.removeItem("auth_session");
    }
  }, [dispatch]);

  return null;
}
