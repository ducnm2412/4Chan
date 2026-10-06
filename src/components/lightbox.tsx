"use client";

import { useEffect, useRef, useState } from "react";

type Shot = { src: string; srcSet: string; alt: string };

const buttonClass =
  "absolute flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/15 text-2xl text-white transition-colors hover:bg-white/30";

const toShot = (el: HTMLImageElement): Shot => ({
  src: el.currentSrc || el.src,
  srcSet: el.srcset,
  alt: el.alt,
});

// Mọi ảnh có lớp fc-zoomable trên trang đều mở được trong khung xem lớn.
// Bắt sự kiện ở document nên ảnh do server dựng không cần tự gắn handler.
export function Lightbox() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [shots, setShots] = useState<Shot[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const zoomables = () =>
      Array.from(
        document.querySelectorAll<HTMLImageElement>("img.fc-zoomable"),
      );
    for (const el of zoomables()) {
      el.tabIndex = 0;
      el.setAttribute("role", "button");
    }
    const open = (target: EventTarget | null) => {
      if (!(target instanceof HTMLImageElement)) return false;
      const all = zoomables();
      const at = all.indexOf(target);
      if (at < 0) return false;
      setShots(all.map(toShot));
      setIndex(at);
      dialog.current?.showModal();
      return true;
    };
    const onClick = (e: MouseEvent) => {
      open(e.target);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && open(e.target)) {
        e.preventDefault();
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const step = (by: number) =>
    setIndex((i) => (i + by + shots.length) % shots.length);
  const shot = shots[index];

  return (
    <dialog
      ref={dialog}
      aria-label="Xem ảnh"
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/88"
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
    >
      {shot && (
        <div
          className="flex h-full flex-col items-center justify-center gap-3 px-3"
          onClick={(e) => {
            if (e.target === e.currentTarget) dialog.current?.close();
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- dùng lại srcset mà next/image đã sinh cho ảnh gốc */}
          <img
            key={shot.src}
            src={shot.src}
            srcSet={shot.srcSet || undefined}
            sizes="100vw"
            alt={shot.alt}
            className="max-h-[82dvh] max-w-full rounded-lg object-contain shadow-2xl"
          />
          <p className="max-w-[40em] text-center text-sm text-white/85">
            {shot.alt} · {index + 1}/{shots.length}
          </p>
          <button
            type="button"
            aria-label="Đóng"
            onClick={() => dialog.current?.close()}
            className={`${buttonClass} top-4 right-4`}
          >
            ×
          </button>
          <button
            type="button"
            aria-label="Ảnh trước"
            onClick={() => step(-1)}
            className={`${buttonClass} top-1/2 left-3 -translate-y-1/2`}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Ảnh tiếp theo"
            onClick={() => step(1)}
            className={`${buttonClass} top-1/2 right-3 -translate-y-1/2`}
          >
            ›
          </button>
        </div>
      )}
    </dialog>
  );
}
