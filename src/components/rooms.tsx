"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { BookRoomLink } from "@/components/booking";
import { img } from "@/lib/images";
import {
  BRANCHES,
  PACKAGES,
  ROOMS,
  priceOf,
  type BranchName,
  type RoomName,
} from "@/lib/site";

// Ảnh gốc của từng phòng, dùng nguyên bản để giữ độ nét.
const posters: Record<RoomName, StaticImageData> = {
  "Phòng Mây Chill": img.posterMay,
  "Phòng Mèo Chill": img.posterMeo,
  "Phòng Retro Pop": img.posterRetro,
  "Phòng Puzzle Chill": img.posterPuzzle,
  "Room 201": img.poster201,
  "Room 202": img.poster202,
  "Room 401": img.poster401,
  "Room 402": img.poster402,
  "Room 501": img.poster501,
  "Room 502": img.poster502,
  "Room 601": img.poster601,
  "Room 602": img.poster602,
  "Room 702": img.poster702,
};

const branches = BRANCHES.map((b) => b.name).filter((name) =>
  ROOMS.some((r) => r.branch === name),
);
const fromPrice = (room: (typeof ROOMS)[number]) =>
  priceOf(room.type, PACKAGES[0]);

const roundButton =
  "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-ink/50 transition-colors duration-300 hover:bg-ink hover:text-cream";

// Phần chọn phòng: bên phải là danh sách phòng của cơ sở đang chọn, bên trái
// là ảnh gốc của phòng, hiện trọn vẹn và đủ nét. Khi đổi phòng, ảnh mới lộ
// dần từ phải sang (xem .fc-slide-bg). Ảnh tự chuyển cho tới khi khách bấm
// hoặc vuốt.
export function RoomShowcase() {
  const [branch, setBranch] = useState<BranchName>(branches[0]);
  const [{ cur, prev }, setSlide] = useState<{
    cur: number;
    prev: number | null;
  }>({ cur: 0, prev: null });
  const [auto, setAuto] = useState(true);
  const touchX = useRef<number | null>(null);
  const strip = useRef<HTMLUListElement>(null);

  const list = ROOMS.filter((r) => r.branch === branch);
  const count = list.length;
  const room = list[cur] ?? list[0];

  useEffect(() => {
    if (!auto || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(
      () => setSlide((s) => ({ cur: (s.cur + 1) % count, prev: s.cur })),
      6500,
    );
    return () => clearTimeout(timer);
  }, [auto, cur, count]);

  // Trên mobile dải ảnh nhỏ trượt ngang: đưa ảnh đang chọn vào giữa dải.
  // Chỉ cuộn ngang bên trong dải nên trang không bị kéo theo.
  useEffect(() => {
    const ul = strip.current;
    const item = ul?.children[cur];
    if (!ul || !(item instanceof HTMLElement)) return;
    if (ul.scrollWidth <= ul.clientWidth) return;
    ul.scrollTo({
      left: item.offsetLeft - (ul.clientWidth - item.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [cur, branch]);

  const go = (to: number) => {
    setAuto(false);
    setSlide((s) => {
      const next = (to + count) % count;
      return next === s.cur ? s : { cur: next, prev: s.cur };
    });
  };
  const pickBranch = (name: BranchName) => {
    setAuto(false);
    setBranch(name);
    setSlide({ cur: 0, prev: null });
  };

  return (
    <section
      id="phong"
      className="relative bg-sand-soft py-[clamp(40px,5vw,72px)]"
    >
      <div className="fc-container grid items-center gap-x-[clamp(32px,5vw,72px)] gap-y-5 nav:grid-cols-[auto_1fr]">
        <div className="fc-reveal fc-from-right nav:col-start-2 nav:self-end">
          <h2 className="fc-h2">Chọn phòng</h2>
          <div className="mt-4 flex gap-2 min-[400px]:gap-2.5">
            {branches.map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={name === branch}
                onClick={() => pickBranch(name)}
                className={`min-h-11 cursor-pointer rounded-full border-[1.5px] px-4 text-[14px] font-semibold whitespace-nowrap transition-colors duration-300 max-[479px]:flex-1 min-[400px]:text-[15px] ${name === branch ? "border-ink bg-ink text-cream" : "border-ink/40 hover:bg-ink/10"}`}
              >
                Cơ sở {name}
              </button>
            ))}
          </div>
        </div>

        <div
          aria-roledescription="carousel"
          aria-label={`Phòng ở cơ sở ${branch}`}
          className="fc-reveal fc-zoom-in relative isolate aspect-square w-full overflow-hidden rounded-[24px] bg-cream shadow-[0_30px_50px_-28px_rgba(39,45,32,0.6)] nav:col-start-1 nav:row-span-2 nav:row-start-1 nav:w-[min(46vw,76svh,600px)]"
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
          }}
        >
          {list.map((r, i) => (
            <div
              key={r.name}
              className={`fc-slide-bg ${i === cur ? `is-current ${prev === null ? "" : "is-opening"}` : i === prev ? "is-prev" : ""}`}
            >
              <Image
                src={posters[r.name]}
                alt={
                  i === cur
                    ? `${r.name}, cơ sở ${r.branch}: ảnh phòng, tiện nghi và giá`
                    : ""
                }
                fill
                quality={100}
                sizes="(min-width: 860px) 600px, 100vw"
                className={`object-cover ${i === cur ? "fc-zoomable" : ""}`}
              />
            </div>
          ))}
        </div>

        <div className="fc-reveal fc-from-right min-w-0 nav:col-start-2 nav:self-start">
          {/* Tên phòng và cụm nút luôn xếp hai hàng: tên dài ngắn khác nhau nên
              nếu để chung một hàng, cụm nút sẽ lúc nằm cạnh lúc rớt xuống dưới */}
          <div className="flex flex-col items-start gap-3 nav:mt-2">
            <div key={room.name} aria-live="polite" className="fc-rise">
              <h3 className="font-display text-[clamp(26px,3.2vw,42px)] leading-[1.05] font-bold tracking-[-0.01em]">
                {room.name}
              </h3>
              <p className="mt-1 text-[15px] text-muted">
                Phòng {room.type.toLowerCase()}, 3 giờ từ {fromPrice(room)}k
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                aria-label="Phòng trước"
                onClick={() => go(cur - 1)}
                className={roundButton}
              >
                <Arrow flip />
              </button>
              <button
                type="button"
                aria-label="Phòng tiếp theo"
                onClick={() => go(cur + 1)}
                className={roundButton}
              >
                <Arrow />
              </button>
              <BookRoomLink room={room.name} />
            </div>
          </div>

          {/* Mobile: một dải trượt ngang, hít vào từng ảnh. Desktop: lưới. */}
          <ul
            ref={strip}
            className={`fc-scroller relative mt-5 flex snap-x snap-mandatory scroll-px-1 gap-2.5 overflow-x-auto border-t border-ink/15 px-1 pt-5 pb-1 nav:grid nav:snap-none nav:gap-y-3 nav:overflow-visible nav:px-0 nav:pb-0 ${count > 4 ? "nav:grid-cols-5" : "nav:grid-cols-4"}`}
          >
            {list.map((r, i) => (
              <li key={r.name} className="w-[88px] shrink-0 snap-start nav:w-auto">
                <button
                  type="button"
                  aria-pressed={i === cur}
                  onClick={() => go(i)}
                  className={`group block w-full cursor-pointer text-center transition-opacity duration-300 ${i === cur ? "" : "opacity-65 hover:opacity-100"}`}
                >
                  <span
                    className={`relative block aspect-square overflow-hidden rounded-[12px] transition-shadow duration-300 ${i === cur ? "shadow-[0_0_0_3px_var(--color-clay)]" : ""}`}
                  >
                    <Image
                      src={posters[r.name]}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </span>
                  <span className="mt-1.5 block text-[12px] leading-tight font-semibold whitespace-nowrap min-[480px]:text-[13px] nav:whitespace-normal">
                    {r.name.replace("Phòng ", "")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Arrow({ flip }: { flip?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={flip ? "-scale-x-100" : ""}
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}
