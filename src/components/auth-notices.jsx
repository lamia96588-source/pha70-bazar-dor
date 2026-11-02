"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AuthNotices() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const notice = url.searchParams.get("auth_notice");
    if (!notice) return;

    url.searchParams.delete("auth_notice");
    url.searchParams.delete("error");
    window.history.replaceState(window.history.state, "", url);

    if (notice === "failed") {
      toast.error("সাইন ইন সম্পন্ন হয়নি। আবার চেষ্টা করুন।", { id: "social-auth" });
      return;
    }
    if (notice === "signed-in") {
      authClient.getSession().then(({ data }) => {
        if (data?.user) toast.success("সাইন ইন সফল হয়েছে।", { id: "social-auth" });
      }).catch(() => {
        toast.error("সেশন যাচাই করা যায়নি। আবার সাইন ইন করুন।", { id: "social-auth" });
      });
    }
  }, []);

  return null;
}
