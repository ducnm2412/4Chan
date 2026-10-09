"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToTop } from "@/lib/scroll";

// Các hiệu ứng cuộn của trang: hiện dần mỗi lần cuộn tới (cả hai chiều),
// thanh tiến độ đọc, header đổi nền và nút lên đầu trang. Tất cả dùng
// IntersectionObserver và sự kiện scroll thường, vì CSS scroll-driven
// animation chưa có trên Firefox và Safari.
export function RevealOnScroll() {
  const bar = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const targets = document.querySelectorAll(".fc-reveal");
    let observer: IntersectionObserver | undefined;
    let leaver: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) entry.target.classList.add("is-visible");
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
      );
      // Khi phần tử ra hẳn khỏi màn hình thì ẩn lại, để lần cuộn tới sau (kể
      // cả cuộn ngược lên) hiệu ứng chạy lại. data-from ghi nó đã đi ra phía
      // nào, CSS dựa vào đó cho nó trượt vào đúng chiều.
      leaver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.dataset.from = entry.boundingClientRect.top < 0 ? "top" : "bottom";
          el.classList.remove("is-visible");
        }
      });
      targets.forEach((el) => {
        observer?.observe(el);
        leaver?.observe(el);
      });
    } else {
      targets.forEach((el) => el.classList.add("is-visible"));
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const max = root.scrollHeight - innerHeight;
      const y = window.scrollY;
      if (bar.current) {
        bar.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      }
      setShowTop(y > 700);
      // Header cố định đổi sang nền đặc khi đã rời đầu trang (xem .fc-header)
      root.toggleAttribute("data-scrolled", y > 24);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      observer?.disconnect();
      leaver?.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <noscript>
        <style>
          {".fc-reveal,.fc-reveal .fc-pop{opacity:1;transform:none}"}
        </style>
      </noscript>
      <div
        ref={bar}
        aria-hidden="true"
        style={{ transform: "scaleX(0)" }}
        className="fixed inset-x-0 top-0 z-40 h-[3px] origin-left bg-clay"
      />
      <button
        type="button"
        aria-label="Lên đầu trang"
        tabIndex={showTop ? 0 : -1}
        onClick={scrollToTop}
        className={`fixed right-3 bottom-[calc(84px+env(safe-area-inset-bottom,0px))] z-30 flex size-11 cursor-pointer items-center justify-center rounded-full bg-ink text-xl text-cream shadow-[0_10px_20px_-10px_rgba(0,0,0,0.6)] transition-[opacity,translate] duration-500 nav:right-[34px] nav:bottom-[104px] ${showTop ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
      >
        ↑
      </button>
    </>
  );
}
