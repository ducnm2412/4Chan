"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { registerLenis } from "@/lib/scroll";

// Cuộn mượt và chậm rãi bằng Lenis: bánh xe chuột không nhảy từng nấc mà
// trôi dần tới vị trí mới (lerp). Trên điện thoại giữ cuộn chạm gốc của hệ
// điều hành vì quán tính gốc đã đủ mượt. Lenis tự tắt mượt khi người dùng
// bật "giảm chuyển động".
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.075,
      wheelMultiplier: 0.9,
      autoRaf: true,
      // Nhảy tới mục qua link #id, chừa chỗ cho header cố định
      anchors: { offset: -76, duration: 1.6 },
      // Không cuộn trang khi lăn chuột trên khung xem ảnh hoặc dải trượt ngang
      allowNestedScroll: true,
      prevent: (node) => node.tagName === "DIALOG",
    });
    registerLenis(lenis);
    return () => {
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
