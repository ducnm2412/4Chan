"use client";

import { useEffect, useRef, useState } from "react";

// Các hiệu ứng cuộn của trang: hiện dần khi cuộn tới, thanh tiến độ đọc,
// ảnh nền trôi chậm (parallax) và nút lên đầu trang. Tất cả dùng
// IntersectionObserver và sự kiện scroll thường, vì CSS scroll-driven
// animation chưa có trên Firefox và Safari.
export function RevealOnScroll() {
  const bar = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const targets = document.querySelectorAll(".fc-reveal");
    let observer: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
      );
      targets.forEach((el) => observer?.observe(el));
    } else {
      targets.forEach((el) => el.classList.add("is-visible"));
    }

    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const layers = calm
      ? []
      : Array.from(document.querySelectorAll<HTMLElement>(".fc-parallax"));
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
      for (const layer of layers) {
        const rect = layer.parentElement?.getBoundingClientRect();
        if (!rect || rect.bottom < 0 || rect.top > innerHeight) continue;
        const offset =
          (rect.top + rect.height / 2 - innerHeight / 2) / innerHeight;
        layer.style.setProperty("--fc-shift", `${(offset * -70).toFixed(1)}px`);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      observer?.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <noscript>
        <style>{".fc-reveal,.fc-reveal .fc-pop{opacity:1;transform:none}"}</style>
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
        onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed right-3 bottom-[calc(84px+env(safe-area-inset-bottom,0px))] z-30 flex size-11 cursor-pointer items-center justify-center rounded-full bg-ink text-xl text-cream shadow-[0_10px_20px_-10px_rgba(0,0,0,0.6)] transition-[opacity,translate] duration-300 nav:right-[34px] nav:bottom-[104px] ${showTop ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
      >
        ↑
      </button>
    </>
  );
}
