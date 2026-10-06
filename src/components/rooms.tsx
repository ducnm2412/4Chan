"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
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

const cards: Record<
  RoomName,
  {
    image: StaticImageData;
    alt: string;
    position?: string;
    desc: string;
    tags: string[];
  }
> = {
  "Phòng Mây Chill": {
    image: img.mayBanCong,
    alt: "Phòng Mây Chill: đèn mây cầu vồng trên tường, màn chiếu và cửa kính mở ra ban công",
    position: "object-[78%_center]",
    desc: "Đèn mây cầu vồng trên tường, cửa kính mở ra ban công đón nắng chiều.",
    tags: ["Máy chiếu", "Bếp mini"],
  },
  "Phòng Mèo Chill": {
    image: img.meoGocNgu,
    alt: "Phòng Mèo Chill: gương hình mặt mèo phát sáng trên mảng tường xanh, cạnh màn chiếu",
    position: "object-[18%_center]",
    desc: "Gương mèo phát sáng trên mảng tường xanh, màn chiếu ngay cạnh giường.",
    tags: ["Máy chiếu", "Bếp mini"],
  },
  "Phòng Retro Pop": {
    image: img.retroGocNgu,
    alt: "Phòng Retro Pop: đĩa than và tranh pop trên tường, sofa lười vàng cạnh giường",
    position: "object-[60%_center]",
    desc: "Đĩa than và tranh pop trên tường, sofa lười vàng cạnh giường.",
    tags: ["Máy chiếu", "Bếp mini"],
  },
  "Phòng Puzzle Chill": {
    image: img.puzzleGocNgu,
    alt: "Phòng Puzzle Chill: tường gỗ gắn hình ghép nhiều màu, sofa vàng và giường thấp",
    position: "object-[62%_center]",
    desc: "Tường gỗ gắn hình ghép nhiều màu, sofa vàng để ngồi thư giãn.",
    tags: ["Máy chiếu", "Bếp mini"],
  },
  "Room 702": {
    image: img.room702,
    alt: "Room 702: mảng tường vòm xanh lá, sofa đơn và cửa sổ nhìn ra phố",
    desc: "Mảng tường vòm xanh lá, cửa sổ nhìn ra mái phố.",
    tags: ["Sofa đơn", "Bếp mini"],
  },
  "Room 402": {
    image: img.room402,
    alt: "Room 402: ba vòm đỏ sơn trên tường, giường đầu bọc da cam và ghế bành xám",
    desc: "Ba vòm đỏ sơn trên tường, đầu giường bọc da cam.",
    tags: ["Ghế bành", "Bếp mini"],
  },
  "Room 601": {
    image: img.room601,
    alt: "Room 601: cửa kính lớn mở ra ban công nhìn hàng cây, sofa đôi và máy chiếu",
    position: "object-[20%_center]",
    desc: "Cửa kính lớn mở ra ban công nhìn hàng cây, sofa đôi cạnh giường.",
    tags: ["Máy chiếu 4K", "Sofa đôi"],
  },
  "Room 401": {
    image: img.room401,
    alt: "Room 401: sofa da cam trước mảng vòm đỏ, cửa kính mở ra ban công",
    position: "object-[30%_center]",
    desc: "Sofa da cam trước mảng vòm đỏ, cửa kính mở ra ban công.",
    tags: ["Máy chiếu 4K", "Sofa đôi"],
  },
};

const branches = BRANCHES.map((b) => b.name).filter((name) =>
  ROOMS.some((r) => r.branch === name),
);
const fromPrice = (room: (typeof ROOMS)[number]) =>
  priceOf(room.type, PACKAGES[0]);

// Khung trưng bày phòng: băng ảnh trượt ngang kèm nút qua lại, bên cạnh là
// danh sách phòng của cơ sở đang chọn. Ảnh tự trượt cho tới khi khách bấm,
// vuốt hoặc chọn phòng.
export function RoomShowcase() {
  const [branch, setBranch] = useState<BranchName>(branches[0]);
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const touchX = useRef<number | null>(null);

  const list = ROOMS.filter((r) => r.branch === branch);
  const count = list.length;
  const room = list[index] ?? list[0];
  const card = cards[room.name];

  useEffect(() => {
    if (!auto || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 4500);
    return () => clearInterval(timer);
  }, [auto, count]);

  const go = (to: number) => {
    setAuto(false);
    setIndex((to + count) % count);
  };
  const pickBranch = (name: BranchName) => {
    setAuto(false);
    setBranch(name);
    setIndex(0);
  };

  const arrowClass =
    "absolute top-1/2 z-1 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-cream/90 text-ink shadow-[0_10px_20px_-10px_rgba(0,0,0,0.7)] transition-[background-color,scale] hover:bg-cream active:scale-90";

  return (
    <div className="fc-reveal mt-6">
      <div className="flex gap-2 min-[400px]:gap-2.5">
        {branches.map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={name === branch}
            onClick={() => pickBranch(name)}
            className={`min-h-11 cursor-pointer rounded-full border-[1.5px] px-3 text-[14px] font-semibold whitespace-nowrap transition-colors max-nav:flex-1 min-[400px]:px-5 min-[400px]:text-[15px] ${name === branch ? "border-cream bg-cream text-ink" : "border-cream/70 text-cream hover:bg-cream/15"}`}
          >
            Cơ sở {name}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3.5 nav:grid-cols-[1.55fr_1fr] nav:gap-5">
        <article
          aria-roledescription="carousel"
          aria-label={`Phòng ở cơ sở ${branch}`}
          className="relative flex flex-col overflow-hidden rounded-[24px] bg-deep text-cream shadow-[0_30px_50px_-30px_rgba(0,0,0,0.7)] nav:min-h-[470px] nav:rounded-[28px]"
        >
          <div
            className="relative aspect-[4/3] overflow-hidden nav:absolute nav:inset-0 nav:aspect-auto"
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
            }}
          >
            <div
              className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
            >
              {list.map((r, i) => (
                <div
                  key={r.name}
                  aria-hidden={i !== index}
                  className="relative h-full w-full shrink-0"
                >
                  <Image
                    src={cards[r.name].image}
                    alt={cards[r.name].alt}
                    fill
                    sizes="(min-width: 860px) 680px, 100vw"
                    className={`fc-zoomable object-cover ${cards[r.name].position ?? ""}`}
                  />
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(39,45,32,0)_38%,rgba(39,45,32,0.9)_100%)] nav:block" />
            <button
              type="button"
              aria-label="Phòng trước"
              onClick={() => go(index - 1)}
              className={`${arrowClass} left-3`}
            >
              <Arrow flip />
            </button>
            <button
              type="button"
              aria-label="Phòng tiếp theo"
              onClick={() => go(index + 1)}
              className={`${arrowClass} right-3`}
            >
              <Arrow />
            </button>
            <div className="absolute top-3 right-3 flex gap-1.5 rounded-full bg-deep/55 px-2.5 py-2">
              {list.map((r, i) => (
                <span
                  key={r.name}
                  aria-hidden="true"
                  className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${i === index ? "w-5 bg-cream" : "w-1.5 bg-cream/50"}`}
                />
              ))}
            </div>
          </div>

          <div
            key={room.name}
            aria-live="polite"
            className="fc-rise pointer-events-none relative flex flex-wrap items-end justify-between gap-x-6 gap-y-3 p-4 nav:absolute nav:inset-x-0 nav:bottom-0 nav:p-[clamp(16px,2.4vw,28px)]"
          >
            <div className="min-w-0 flex-[1_1_300px]">
              <div className="text-[13px] font-medium text-sand nav:text-sm">
                Cơ sở {room.branch}
              </div>
              <h3 className="font-display text-[clamp(23px,3vw,36px)] leading-tight font-bold">
                {room.name}
              </h3>
              <p className="mt-1 max-w-[30em] text-[14.5px] nav:text-[15px]">
                {card.desc}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {[`Phòng ${room.type.toLowerCase()}`, ...card.tags].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-cream/20 px-3 py-[3px] text-[13px]"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </div>
            <div className="pointer-events-auto flex items-center gap-4 max-nav:w-full max-nav:justify-between">
              <span className="flex flex-col text-[13px] leading-tight">
                3 giờ từ
                <strong className="font-display text-[26px] font-bold">
                  {fromPrice(room)}k
                </strong>
              </span>
              <BookRoomLink room={room.name} />
            </div>
          </div>
        </article>

        <ul className="grid grid-cols-2 gap-2.5 nav:flex nav:flex-col nav:gap-3">
          {list.map((r, i) => {
            const on = i === index;
            return (
              <li key={r.name} className="nav:flex-1">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => go(i)}
                  className={`flex h-full w-full cursor-pointer items-center gap-2.5 rounded-[18px] p-2 text-left text-ink transition-[background-color,translate,box-shadow] duration-300 nav:gap-3.5 nav:rounded-[20px] nav:p-2.5 nav:pr-4 ${on ? "bg-cream shadow-[0_16px_28px_-18px_rgba(0,0,0,0.7)] nav:-translate-x-2" : "bg-cream/75 hover:bg-cream/90"}`}
                >
                  <Image
                    src={cards[r.name].image}
                    alt=""
                    sizes="72px"
                    style={{ "--ar": 0.8, "--r": "10px" } as CSSProperties}
                    className={`fc-arch h-[60px] w-12 shrink-0 object-cover nav:h-[86px] nav:w-[69px] ${cards[r.name].position ?? ""}`}
                  />
                  <span className="flex min-w-0 grow flex-col">
                    <span className="font-display text-[14.5px] leading-tight font-bold nav:text-[17px] nav:leading-snug">
                      {r.name}
                    </span>
                    <span className="text-[12.5px] text-muted nav:text-[13.5px]">
                      Phòng {r.type.toLowerCase()}
                      <span className="font-semibold text-clay nav:hidden">
                        , {fromPrice(r)}k
                      </span>
                    </span>
                  </span>
                  <span className="font-display text-lg font-bold whitespace-nowrap text-clay max-nav:hidden">
                    {fromPrice(r)}k
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Arrow({ flip }: { flip?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={flip ? "-scale-x-100" : ""}
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}
