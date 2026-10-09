"use client";

import { useEffect, useRef, useState } from "react";

type Link = { href: string; label: string };

// Menu cho màn hình hẹp (dưới mốc nav, 860px), nơi thanh điều hướng ngang bị
// ẩn. Nút ba gạch mở một tấm thả xuống ngay dưới header; bấm một mục, bấm ra
// ngoài hoặc nhấn Esc đều đóng lại.
export function MobileMenu({
  links,
  phone,
  phoneDisplay,
}: {
  links: Link[];
  phone: string;
  phoneDisplay: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    // Màn hình xoay ngang hoặc kéo rộng qua mốc desktop thì đóng menu
    const wide = matchMedia("(min-width: 860px)");
    const onWide = () => {
      if (wide.matches) setOpen(false);
    };
    addEventListener("keydown", onKey);
    addEventListener("pointerdown", onPointer);
    wide.addEventListener("change", onWide);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener("pointerdown", onPointer);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <div ref={root} className="nav:hidden">
      <button
        ref={button}
        type="button"
        aria-label={open ? "Đóng menu" : "Mở menu"}
        aria-expanded={open}
        aria-controls="fc-mobile-menu"
        onClick={() => setOpen((o) => !o)}
        className="relative flex size-11 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-cream/60"
      >
        <span aria-hidden="true" className="relative block h-3.5 w-5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`absolute left-0 block h-[2px] w-5 rounded-full bg-current transition-[transform,opacity] duration-300 ${
                i === 0
                  ? open
                    ? "top-1.5 rotate-45"
                    : "top-0"
                  : i === 1
                    ? `top-1.5 ${open ? "opacity-0" : ""}`
                    : open
                      ? "top-1.5 -rotate-45"
                      : "top-3"
              }`}
            />
          ))}
        </span>
      </button>

      <nav
        id="fc-mobile-menu"
        aria-label="Điều hướng chính"
        inert={!open}
        className={`fc-ondark absolute inset-x-0 top-full border-t border-cream/10 bg-deep/97 shadow-[0_24px_30px_-20px_rgba(0,0,0,0.7)] transition-[opacity,translate] duration-400 ${open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
      >
        <ul className="fc-container flex flex-col py-2">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center border-b border-cream/10 text-[17px] font-medium"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={`tel:${phone}`}
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center text-[17px] font-semibold text-sand"
            >
              Gọi {phoneDisplay}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
