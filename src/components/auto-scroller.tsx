"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Dải trượt ngang tự chạy từng thẻ. Chỉ chạy khi nội dung thật sự tràn ngang
// (tức là trên mobile); trên desktop các thẻ xếp lưới nên nó đứng yên.
export function AutoScroller({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pausedUntil = 0;
    const pause = () => {
      pausedUntil = Date.now() + 8000;
    };
    const timer = setInterval(() => {
      if (Date.now() < pausedUntil || el.scrollWidth <= el.clientWidth + 4) {
        return;
      }
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      const card = el.firstElementChild;
      if (!(card instanceof HTMLElement)) return;
      const step =
        card.offsetWidth + parseFloat(getComputedStyle(el).columnGap);
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({
        left: atEnd ? 0 : el.scrollLeft + step,
        behavior: "smooth",
      });
    }, 3500);

    el.addEventListener("pointerdown", pause);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("focusin", pause);
    return () => {
      clearInterval(timer);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("focusin", pause);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
