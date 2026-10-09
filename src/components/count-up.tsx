"use client";

import { useEffect, useRef } from "react";

// Số đếm dần từ 0 lên giá trị thật khi cuộn tới, chạy chậm với easing giảm
// dần. Giá trị cuối được dựng sẵn từ server nên không có JS vẫn đọc đúng số.
export function CountUp({
  value,
  duration = 2200,
}: {
  value: number;
  duration?: number;
}) {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          node.textContent = Math.round(value * eased).toLocaleString("vi-VN");
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return <span ref={el}>{value.toLocaleString("vi-VN")}</span>;
}
