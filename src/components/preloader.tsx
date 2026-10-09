"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { img } from "@/lib/images";
import { lockScroll } from "@/lib/scroll";

// Thời gian tối thiểu màn hình chào hiện ra (để logo kịp hiện) và tối đa
// (để không bắt khách chờ khi ảnh tải chậm), tính từ lúc mở trang.
const MIN_SHOW = 1500;
const MAX_WAIT = 4000;
// Khớp với transition của .fc-loader.is-leaving trong globals.css
const LEAVE = 1000;

// Màn hình chào phủ kín trang lúc mới mở: logo nảy lên, tên và vạch kẻ hiện
// theo. Khi font và ảnh đã sẵn sàng, tấm màn kéo lên và hero bên dưới bắt
// đầu trồi lên (html[data-loaded] mở khoá animation .fc-rise). Overlay được
// dựng sẵn từ server nên không có khoảng trống trước khi JS chạy.
export function Preloader() {
  const [phase, setPhase] = useState<"loading" | "leaving" | "done">(
    "loading",
  );

  useEffect(() => {
    const root = document.documentElement;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.setAttribute("data-loaded", "");
      const t = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(t);
    }

    lockScroll(true);
    const timers: ReturnType<typeof setTimeout>[] = [];
    let leaving = false;
    const leave = () => {
      if (leaving) return;
      leaving = true;
      const wait = Math.max(0, MIN_SHOW - performance.now());
      timers.push(
        setTimeout(() => {
          setPhase("leaving");
          lockScroll(false);
          // Hero trồi lên khi tấm màn đã kéo lên được một đoạn
          timers.push(
            setTimeout(() => root.setAttribute("data-loaded", ""), 300),
          );
          timers.push(setTimeout(() => setPhase("done"), LEAVE));
        }, wait),
      );
    };

    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) =>
            addEventListener("load", () => resolve(), { once: true }),
          );
    Promise.all([document.fonts.ready, loaded]).then(leave);
    timers.push(setTimeout(leave, MAX_WAIT));

    return () => {
      timers.forEach(clearTimeout);
      lockScroll(false);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <>
      <noscript>
        <style>
          {".fc-loader{display:none}.fc-rise{animation-play-state:running}"}
        </style>
      </noscript>
      <div
        role="status"
        aria-label="Đang tải trang"
        aria-hidden={phase === "leaving"}
        className={`fc-loader fc-ondark fixed inset-0 z-50 flex flex-col items-center justify-center bg-deep text-cream ${phase === "leaving" ? "is-leaving" : ""}`}
      >
        <div className="fc-loader-body flex flex-col items-center">
          <Image
            src={img.logoMark}
            alt=""
            priority
            sizes="96px"
            className="fc-loader-logo size-[clamp(72px,10vw,96px)] rounded-[24%] bg-cream object-contain p-2 shadow-[0_18px_30px_-16px_rgba(0,0,0,0.7)]"
          />
          <p className="fc-loader-name mt-5 flex flex-col items-center leading-none">
            <span className="font-display text-[clamp(28px,3.6vw,38px)] font-bold tracking-[-0.01em]">
              4Chan
            </span>
            <span className="mt-1.5 font-script text-[clamp(22px,2.6vw,28px)] text-sand">
              Homestay
            </span>
          </p>
          <span
            aria-hidden="true"
            className="fc-loader-line mt-6 block h-px w-24 origin-left bg-sand/70"
          />
        </div>
      </div>
    </>
  );
}
