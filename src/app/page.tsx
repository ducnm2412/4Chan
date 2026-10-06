import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { BookingForm, BookingProvider } from "@/components/booking";
import { Lightbox } from "@/components/lightbox";
import { RevealOnScroll } from "@/components/reveal";
import { RoomShowcase } from "@/components/rooms";
import { img } from "@/lib/images";
import {
  BRANCHES,
  EXTRA_HOUR,
  MAPS_EMBED,
  PACKAGES,
  ROOM_TYPES,
  SITE,
  WEEKEND_SURCHARGE,
  type BranchName,
} from "@/lib/site";

const branchCards: Record<
  BranchName,
  { image?: StaticImageData; alt?: string; position?: string; desc: string }
> = {
  "Khâm Thiên": {
    image: img.mayBanCong,
    alt: "Ban công phòng Mây Chill ở cơ sở Khâm Thiên",
    position: "object-[85%_center]",
    desc: "Bốn phòng theo chủ đề: Mây, Mèo, Retro Pop và Puzzle.",
  },
  "Thanh Xuân": {
    desc: "Nhắn Zalo để xem ảnh và phòng trống của cơ sở này.",
  },
  "Long Biên": {
    image: img.room601,
    alt: "Room 601 ở cơ sở Long Biên, cửa kính mở ra ban công",
    position: "object-[12%_center]",
    desc: "Các phòng từ tầng 2 đến tầng 7, có phòng ban công.",
  },
};

const gallery = [
  {
    src: img.room201,
    alt: "Room 201: màn chiếu lớn sát giường, bệ ngồi cam cạnh cửa sổ nhìn ra vườn cây",
    caption: "Xem phim tại giường",
    tilt: "-rotate-2",
  },
  {
    src: img.room501,
    alt: "Room 501: sofa đôi màu be, nắng vào qua cửa kính ban công",
    caption: "Nắng qua cửa ban công",
    tilt: "rotate-[1.5deg]",
  },
  {
    src: img.mayBep,
    alt: "Bếp mini phòng Mây Chill: tủ lạnh, bếp từ và bàn trà vàng",
    caption: "Bếp nhỏ, đủ đồ",
    tilt: "-rotate-1",
  },
  {
    src: img.meoDecor,
    alt: "Bộ bát đĩa in hình mèo và tranh mèo trong phòng Mèo Chill",
    caption: "Bát đĩa nhà mèo",
    tilt: "rotate-2",
  },
  {
    src: img.room602,
    alt: "Room 602: giường xám, ghế bành và cửa sổ nhìn ra thành phố",
    caption: "Thành phố ngoài cửa sổ",
    tilt: "-rotate-[1.5deg]",
  },
  {
    src: img.room202,
    alt: "Room 202: giường khung cam, ghế bành kem dưới mảng tường vòm",
    caption: "Một góc màu cam",
    tilt: "rotate-1",
  },
];

// Số giờ của từng gói, in trong ô vòm trên thẻ giá. Gói có ngủ qua đêm
// dùng ô màu tối.
const packageBadges: Record<
  (typeof PACKAGES)[number]["id"],
  { hours: string; night: boolean }
> = {
  "3h": { hours: "3h", night: false },
  trua: { hours: "5h", night: false },
  "12h": { hours: "12h", night: false },
  dem: { hours: "12h", night: true },
  "2n1d": { hours: "20h", night: true },
  "24h": { hours: "24h", night: true },
};

// Một quy trình có thứ tự thật, nên các bước được đánh số.
const steps = [
  {
    title: "Chọn phòng và gói giờ",
    desc: "Xem bảng giá, chọn cơ sở, loại phòng và khung giờ bạn cần.",
  },
  {
    title: "Nhắn Zalo để giữ phòng",
    desc: "Gửi yêu cầu ở cuối trang. 4Chan xác nhận phòng trống và giá.",
  },
  {
    title: "Nhận hướng dẫn check-in",
    desc: "Địa chỉ, đường vào và cách mở cửa được gửi riêng qua Zalo.",
  },
  {
    title: "Tự vào phòng, tự trả phòng",
    desc: "Đến nơi là vào thẳng phòng. Hết giờ thì khép cửa và ra về.",
  },
];

const faqs = [
  {
    q: "Tự check-in nghĩa là sao, có cần gặp lễ tân không?",
    a: "Không cần. Sau khi giữ phòng, 4Chan gửi hướng dẫn check-in qua Zalo. Bạn tự vào phòng và tự trả phòng khi hết giờ.",
  },
  {
    q: "Thứ 6, Thứ 7 giá có khác không?",
    a: `Có. Thứ 6 và Thứ 7 giá phòng cộng thêm ${WEEKEND_SURCHARGE}k so với bảng giá.`,
  },
  {
    q: "Ở quá giờ của gói thì tính thế nào?",
    a: `Mỗi giờ ở thêm ngoài thời gian của gói tính ${EXTRA_HOUR}k.`,
  },
  {
    q: "Gói 3 giờ và gói 12 giờ bắt đầu tính từ lúc nào?",
    a: "Hai gói này tính từ lúc bạn nhận phòng. Các gói còn lại có khung giờ cố định ghi trong bảng giá.",
  },
  {
    q: "Phòng cửa sổ và phòng ban công khác nhau thế nào?",
    a: "Phòng ban công có cửa kính mở ra ban công riêng, giá cao hơn phòng cửa sổ từ 30k đến 90k tuỳ gói.",
  },
  {
    q: "Trong phòng có những gì?",
    a: "Đệm cao su non, máy lạnh hai chiều, toilet khép kín, bếp mini và tủ lạnh. Nhiều phòng có máy chiếu và sofa.",
  },
];

function Icon({
  size,
  stroke = "#333A2B",
  width = 1.5,
  className,
  children,
}: {
  size: number;
  stroke?: string;
  width?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

const pinPath = (
  <>
    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.800-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.500" />
  </>
);
const phonePath = (
  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.600-3.100 19.500 19.500 0 0 1-6-6A19.800 19.800 0 0 1 2.100 4.200 2 2 0 0 1 4.100 2h3a2 2 0 0 1 2 1.700c.1 1 .4 1.900.7 2.800a2 2 0 0 1-.5 2.100L8.100 9.900a16 16 0 0 0 6 6l1.300-1.300a2 2 0 0 1 2.100-.4c.9.3 1.800.6 2.800.7a2 2 0 0 1 1.700 2z" />
);
const lockPath = (
  <>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    <path d="M12 15v2" />
  </>
);

function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src={img.logoMark}
        alt=""
        sizes="48px"
        className="size-12 rounded-[14px] bg-cream object-contain p-1"
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[26px] font-bold tracking-[-0.01em]">
          4Chan
        </span>
        <span className="mt-0.5 text-[13px] font-medium">Homestay</span>
      </span>
    </span>
  );
}

// Ảnh phòng làm nền cho cả dải, trôi chậm theo cuộn trang. `shade` là lớp
// phủ màu để chữ phía trên đọc được.
function Backdrop({ src, shade }: { src: StaticImageData; shade: string }) {
  return (
    <>
      <Image
        src={src}
        alt=""
        fill
        sizes="100vw"
        className="fc-parallax object-cover"
      />
      <div className={`absolute inset-0 ${shade}`} />
    </>
  );
}

// Đường gợn sóng nối hai dải màu: tô bằng màu nền của dải nằm phía dưới
// (hoặc phía trên khi lật bằng `flip`).
function Wave({ className, flip }: { className: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block h-[clamp(22px,3.6vw,50px)] w-full ${flip ? "rotate-180" : ""} ${className}`}
    >
      <path
        className="fc-wave-back"
        fill="currentColor"
        opacity="0.45"
        d="M0 38 C 200 0 420 70 720 34 C 1020 -2 1240 60 1440 22 V90 H0 Z"
      />
      <path
        fill="currentColor"
        d="M0 56 C 240 100 480 8 720 44 C 960 80 1200 14 1440 50 V90 H0 Z"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <BookingProvider>
      <RevealOnScroll />
      <Lightbox />

      <section
        id="top"
        className="fc-ondark relative flex min-h-svh flex-col overflow-hidden bg-deep text-cream nav:h-svh nav:min-h-[600px]"
      >
        <Image
          src={img.bgHero}
          alt=""
          fill
          preload
          sizes="100vw"
          className="fc-kenburns object-cover object-[center_60%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(39,45,32,0.84)_0%,rgba(39,45,32,0.55)_46%,rgba(39,45,32,0.12)_100%)]" />
        <header className="relative z-2">
          <div className="fc-container flex items-center justify-between gap-5 py-[18px]">
            <Link href="/" aria-label="4Chan Homestay – về trang chủ">
              <Wordmark />
            </Link>
            <nav
              aria-label="Điều hướng chính"
              className="hidden gap-[30px] text-[15px] font-medium nav:flex"
            >
              <a className="fc-link" href="#gioi-thieu">
                Giới thiệu
              </a>
              <a className="fc-link" href="#phong">
                Loại phòng
              </a>
              <a className="fc-link" href="#bang-gia">
                Bảng giá
              </a>
              <a className="fc-link" href="#co-so">
                Cơ sở
              </a>
            </nav>
            <div className="flex items-center gap-3.5">
              <a
                href={`tel:${SITE.phone}`}
                className="fc-link hidden min-h-11 items-center text-[15px] font-semibold whitespace-nowrap min-[481px]:inline-flex"
              >
                {SITE.phoneDisplay}
              </a>
              <a className="fc-btn" href="#dat-phong">
                Đặt phòng
              </a>
            </div>
          </div>
        </header>

        <div className="fc-container grid w-full grow content-center items-center gap-x-10 gap-y-7 pt-2 pb-[clamp(96px,7vw,84px)] nav:grid-cols-[1.1fr_0.9fr] nav:pb-[clamp(48px,6vw,80px)]">
          <div className="fc-rise">
            <h1 className="font-display text-[clamp(32px,min(5.4vw,8svh),66px)] leading-[1.06] font-bold tracking-[-0.02em] text-balance">
              Một chỗ riêng cho hai người, thuê theo giờ
            </h1>
            <p className="mt-4 max-w-[31em] text-[clamp(15px,1.5vw,17px)]">
              4Chan Homestay có ba cơ sở ở Khâm Thiên, Thanh Xuân và Long Biên.
              Bạn tự check-in, tự trả phòng, không qua lễ tân. Giá từ 249k cho 3
              giờ.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a className="fc-btn min-h-12 px-7 text-base" href="#dat-phong">
                Đặt phòng
              </a>
              <a
                className="fc-btn fc-btn-quiet min-h-12 border-cream px-7 text-base text-cream"
                href="#bang-gia"
              >
                Xem bảng giá
              </a>
            </div>
          </div>

          <div
            className="fc-rise relative mx-auto w-full max-w-[min(460px,31svh)] pb-5 pl-[12%] nav:max-w-[min(460px,56svh)]"
            style={{ animationDelay: "0.18s" }}
          >
            <Image
              src={img.room702}
              alt="Room 702 của 4Chan Homestay: mảng tường vòm xanh, sofa đơn và cửa sổ nhìn ra phố"
              preload
              sizes="(min-width: 860px) 400px, 80vw"
              placeholder="blur"
              style={{ "--ar": 0.8, "--r": "22px" } as CSSProperties}
              className="fc-arch fc-zoomable aspect-4/5 w-full object-cover object-[38%_center]"
            />
            <Image
              src={img.room401}
              alt="Room 401: sofa da cam và cửa kính mở ra ban công"
              sizes="180px"
              style={{ "--ar": 0.8 } as CSSProperties}
              className="fc-arch fc-zoomable absolute bottom-0 left-0 aspect-4/5 w-[38%] border-[5px] border-cream object-cover object-[28%_center]"
            />
            <p className="absolute -right-5 bottom-9 w-[62%] nav:-right-1 nav:bottom-12 nav:w-[46%] rotate-[4deg] rounded-md bg-cream px-3.5 py-3 text-center font-hand text-ink text-[clamp(13px,1.5vw,15.5px)] leading-[1.4] shadow-[0_16px_26px_-16px_rgba(39,45,32,0.6)]">
              Đáng giá không phải vì đi đâu, mà vì ở cùng ai.
            </p>
          </div>
        </div>
        <Wave className="absolute inset-x-0 -bottom-px z-1 text-blush" />
      </section>

      <div className="fc-container flex justify-center pt-[clamp(18px,2.5vw,30px)]">
        <div className="fc-reveal flex items-center justify-center gap-x-[clamp(8px,2.6vw,28px)] rounded-full bg-ink px-[clamp(16px,4vw,40px)] py-3 font-hand text-[clamp(15px,2.2vw,22px)] leading-[1.2] whitespace-nowrap text-cream">
          <span>Riêng tư</span>
          <span className="text-peach" aria-hidden="true">
            +
          </span>
          <span>Kín đáo</span>
          <span className="text-peach" aria-hidden="true">
            +
          </span>
          <span>Sạch sẽ</span>
        </div>
      </div>

      <section id="gioi-thieu" className="fc-paper fc-section">
        <div className="fc-container flex flex-wrap items-center gap-[clamp(32px,6vw,80px)]">
          <div className="fc-reveal fc-from-left min-w-0 flex-[1_1_380px]">
            <h2 className="fc-reveal fc-from-left fc-h2">
              Không gian cho những cuộc hẹn đáng nhớ
            </h2>
            <p className="fc-lede">
              Có những khoảng thời gian đáng giá không phải vì đi đâu, mà vì ở
              cùng ai. 4Chan là một không gian đủ riêng tư để nghỉ ngơi, trò
              chuyện và tận hưởng trọn vẹn từng khoảnh khắc bên nhau.
            </p>
            <div className="mt-7 grid grid-cols-3 gap-3 sm:gap-6">
              {[
                {
                  icon: lockPath,
                  title: "Tự check-in, tự trả phòng",
                  desc: "Không quầy lễ tân, không phải chờ",
                },
                {
                  icon: (
                    <>
                      <path d="M5 21V10a7 7 0 0 1 14 0v11" />
                      <path d="M3 21h18" />
                      <path d="M15 14v1" />
                    </>
                  ),
                  title: "Riêng tư, kín đáo",
                  desc: "Phòng khép kín, toilet trong phòng",
                },
                {
                  icon: (
                    <>
                      <path d="M12 3l1.800 4.700L18.500 9.500l-4.700 1.800L12 16l-1.800-4.700L5.500 9.500l4.700-1.800z" />
                      <path d="M18.500 15.500l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
                    </>
                  ),
                  title: "Sạch sẽ, gọn gàng",
                  desc: "Đệm cao su non, máy lạnh hai chiều",
                },
              ].map((fact) => (
                <div key={fact.title} className="flex flex-col gap-2">
                  <Icon size={38}>{fact.icon}</Icon>
                  <div className="text-sm leading-[1.3] font-semibold sm:text-base">
                    {fact.title}
                  </div>
                  <div className="text-[12.5px] leading-snug sm:text-sm">
                    {fact.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="fc-reveal fc-from-right relative min-w-0 flex-[1_1_340px] pr-[clamp(20px,4vw,44px)] pb-[clamp(28px,4vw,48px)]">
            <Image
              src={img.room501}
              alt="Room 501: sofa đôi màu be, giường thấp và cửa kính mở ra ban công"
              sizes="(min-width: 860px) 520px, 100vw"
              className="fc-zoomable aspect-4/3 w-full rounded-[28px] object-cover"
            />
            <div className="absolute right-0 bottom-0 w-[34%] rotate-[4deg] bg-white px-2 pt-2 pb-[22px] shadow-[0_16px_30px_-14px_rgba(39,45,32,0.5)]">
              <Image
                src={img.bep402}
                alt="Cửa phòng màu xanh có khoá mã số, cạnh bếp mini"
                sizes="200px"
                className="fc-zoomable aspect-3/4 w-full object-cover object-[80%_center]"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="phong"
        className="relative overflow-hidden bg-deep py-[clamp(48px,6vw,80px)]"
      >
        <Backdrop
          src={img.bgPhong}
          shade="bg-[linear-gradient(180deg,rgba(39,45,32,0.74)_0%,rgba(39,45,32,0.28)_38%,rgba(39,45,32,0.16)_100%)]"
        />
        <Wave flip className="absolute inset-x-0 -top-px text-blush" />
        <Wave className="absolute inset-x-0 -bottom-px text-blush" />
        <div className="fc-container">
          <h2 className="fc-reveal fc-from-left fc-h2 text-cream">
            Mỗi phòng một kiểu, chọn theo ý bạn
          </h2>
          <p className="fc-lede text-cream">
            Chọn cơ sở rồi bấm vào từng phòng để xem. Tất cả là ảnh chụp phòng
            thật.
          </p>
          <RoomShowcase />
        </div>
      </section>

      <section id="bang-gia" className="fc-paper fc-section">
        <div className="fc-container grid items-start gap-x-[clamp(28px,4vw,56px)] gap-y-7 nav:grid-cols-[0.78fr_1.6fr]">
          <div className="nav:sticky nav:top-8">
            <h2 className="fc-reveal fc-from-left fc-h2">Bảng giá theo giờ</h2>
            <p className="fc-lede">
              Giá cho một phòng, áp dụng ở cả ba cơ sở. Phòng ban công có cửa
              kính mở ra ban công riêng.
            </p>
            <dl className="fc-reveal mt-5 grid grid-cols-2 gap-3 nav:grid-cols-1">
              {[
                [`+${WEEKEND_SURCHARGE}k`, "Thứ 6 và Thứ 7, cho mọi gói"],
                [`+${EXTRA_HOUR}k`, "Mỗi giờ ở thêm ngoài thời gian của gói"],
              ].map(([amount, note]) => (
                <div
                  key={amount}
                  className="flex flex-col gap-x-4 gap-y-0.5 rounded-[18px] border-[1.5px] border-dashed border-peach bg-cream px-4 py-3 nav:flex-row nav:items-center"
                >
                  <dt className="order-2 text-[14px] leading-snug text-muted">
                    {note}
                  </dt>
                  <dd className="order-1 font-display text-[26px] leading-tight font-bold whitespace-nowrap text-clay">
                    {amount}
                  </dd>
                </div>
              ))}
            </dl>
            <a
              className="fc-btn mt-5 min-h-12 px-7 text-base"
              href="#dat-phong"
            >
              Đặt phòng
            </a>
          </div>

          <ul className="grid max-[559px]:overflow-hidden max-[559px]:rounded-[20px] max-[559px]:border max-[559px]:border-line max-[559px]:bg-white min-[560px]:grid-cols-2 min-[560px]:gap-3.5 nav:gap-4">
            <li
              aria-hidden="true"
              className="flex items-center justify-between bg-sage px-3 py-2 text-[12.5px] font-semibold min-[560px]:hidden"
            >
              <span>Gói</span>
              <span className="grid grid-cols-2 gap-1.5 text-center">
                {ROOM_TYPES.map((type) => (
                  <span key={type} className="w-[62px]">
                    {type}
                  </span>
                ))}
              </span>
            </li>
            {PACKAGES.map((pkg, i) => {
              const { hours, night } = packageBadges[pkg.id];
              return (
                <li
                  key={pkg.id}
                  style={{ transitionDelay: `${(i % 2) * 90}ms` }}
                  className="fc-reveal fc-lift flex items-center gap-2 border-line px-3 py-2 max-[559px]:border-t min-[560px]:flex-col min-[560px]:border min-[560px]:bg-white min-[560px]:items-stretch min-[560px]:gap-3.5 min-[560px]:rounded-[24px] min-[560px]:p-4"
                >
                  <div className="flex min-w-0 grow items-center gap-2.5 min-[560px]:gap-3.5">
                    <span
                      aria-hidden="true"
                      style={{ "--ar": 0.8, "--r": "10px" } as CSSProperties}
                      className={`fc-arch fc-pop flex h-[38px] w-[30px] shrink-0 items-end justify-center pb-1 font-display text-[12px] font-bold min-[560px]:h-[60px] min-[560px]:w-12 min-[560px]:pb-2 min-[560px]:text-[17px] ${night ? "bg-ink text-cream" : "bg-peach text-white"}`}
                    >
                      {hours}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-[15px] leading-tight font-bold whitespace-nowrap min-[560px]:text-[19px] min-[560px]:leading-snug">
                        {pkg.label}
                      </h3>
                      <div className="text-[12px] leading-snug whitespace-nowrap text-muted min-[560px]:text-[14px]">
                        {pkg.window || "Tính từ lúc nhận phòng"}
                      </div>
                    </div>
                  </div>
                  <dl className="grid shrink-0 grid-cols-2 gap-1.5 min-[560px]:gap-2.5">
                    {ROOM_TYPES.map((type, t) => (
                      <div
                        key={type}
                        className={`max-[559px]:w-[62px] max-[559px]:bg-transparent max-[559px]:text-center min-[560px]:rounded-[16px] min-[560px]:px-3.5 min-[560px]:py-2.5 ${t ? "bg-sand-soft" : "bg-sage-soft"}`}
                      >
                        <dt className="text-[13px] whitespace-nowrap text-muted max-[559px]:sr-only">
                          <span className="max-[559px]:hidden">Phòng </span>
                          <span className="min-[560px]:lowercase">{type}</span>
                        </dt>
                        <dd className="font-display text-[17px] leading-tight font-bold min-[560px]:text-[clamp(24px,2.6vw,30px)]">
                          {pkg.prices[t]}k
                        </dd>
                      </div>
                    ))}
                  </dl>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="relative overflow-hidden bg-sage py-[clamp(48px,6vw,80px)]">
        <Backdrop
          src={img.bgCheckin}
          shade="bg-[linear-gradient(90deg,rgba(181,190,163,0.92)_0%,rgba(181,190,163,0.7)_42%,rgba(181,190,163,0.22)_100%)]"
        />
        <Wave flip className="absolute inset-x-0 -top-px text-blush" />
        <Wave className="absolute inset-x-0 -bottom-px text-blush" />
        <div className="fc-container">
          <h2 className="fc-reveal fc-from-left fc-h2">
            Tự check-in trong bốn bước
          </h2>
          <p className="fc-lede text-ink">
            Từ lúc đặt đến lúc về, bạn không cần gặp ai. Thông tin đặt phòng chỉ
            dùng để giữ phòng và gửi hướng dẫn cho bạn.
          </p>
          <ol className="mt-6 grid gap-2.5 min-[560px]:gap-4 min-[560px]:grid-cols-2 nav:grid-cols-4">
            {steps.map((step, i) => (
              <li
                key={step.title}
                style={{ transitionDelay: `${i * 70}ms` }}
                className="fc-reveal flex items-start gap-3.5 rounded-[20px] bg-cream p-3.5 min-[560px]:flex-col min-[560px]:gap-2 min-[560px]:rounded-[22px] min-[560px]:p-5"
              >
                <span
                  aria-hidden="true"
                  style={{ "--ar": 0.8, "--r": "8px" } as CSSProperties}
                  className="fc-arch fc-pop flex h-[50px] w-10 shrink-0 items-end justify-center bg-peach pb-1.5 font-display text-xl font-bold text-white"
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-[17px] leading-snug font-bold min-[560px]:mt-1 min-[560px]:text-lg">
                    {step.title}
                  </h3>
                  <p className="mt-0.5 text-[14px] text-muted min-[560px]:mt-2 min-[560px]:text-[14.5px]">
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="co-so" className="fc-paper fc-section">
        <div className="fc-container">
          <h2 className="fc-reveal fc-from-left fc-h2">Ba cơ sở tại Hà Nội</h2>
          <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
            {BRANCHES.map((branch, i) => {
              const card = branchCards[branch.name];
              return (
                <article
                  key={branch.name}
                  style={{ transitionDelay: `${i * 70}ms` }}
                  className={`fc-reveal ${["fc-from-left", "", "fc-from-right"][i]} flex items-center gap-4 rounded-[22px] border border-line bg-white p-3.5`}
                >
                  {card.image ? (
                    <Image
                      src={card.image}
                      alt={card.alt ?? ""}
                      sizes="104px"
                      style={{ "--ar": 0.76 } as CSSProperties}
                      className={`fc-arch fc-zoomable h-[136px] w-[104px] shrink-0 object-cover ${card.position ?? ""}`}
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      style={{ "--ar": 0.76 } as CSSProperties}
                      className="fc-arch flex h-[136px] w-[104px] shrink-0 items-center justify-center bg-sand-soft"
                    >
                      <Icon size={30} stroke="#8A583C">
                        {pinPath}
                      </Icon>
                    </div>
                  )}
                  <div className="flex min-w-0 flex-col gap-1">
                    <h3 className="font-display text-lg leading-snug font-bold">
                      Homestay theo giờ {branch.name}
                    </h3>
                    <div className="text-sm font-medium">{branch.address}</div>
                    <div className="text-sm text-muted">{card.desc}</div>
                    <a
                      href={branch.maps}
                      target="_blank"
                      rel="noopener"
                      className="mt-0.5 inline-flex min-h-9 items-center self-start text-sm font-semibold text-clay underline underline-offset-4"
                    >
                      Chỉ đường tới {branch.name}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="hinh-anh"
        className="fc-paper pb-[clamp(32px,4.5vw,56px)] pt-[clamp(4px,1vw,12px)]"
      >
        <div className="fc-container">
          <h2 className="fc-reveal fc-from-left fc-h2 text-center">
            Ảnh thật trong phòng
          </h2>
          <div className="mx-auto mt-9 grid max-w-[900px] grid-cols-2 gap-x-[clamp(14px,3vw,36px)] gap-y-[clamp(26px,4vw,44px)] nav:grid-cols-3">
            {gallery.map((shot, i) => (
              <figure
                key={shot.caption}
                style={{ transitionDelay: `${(i % 3) * 70}ms` }}
                className={`fc-reveal fc-zoom-in fc-polaroid relative bg-white px-[clamp(7px,1vw,11px)] pt-[clamp(7px,1vw,11px)] pb-2.5 shadow-[0_18px_30px_-16px_rgba(39,45,32,0.5)] ${shot.tilt}`}
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-3 left-1/2 h-6 w-[34%] -translate-x-1/2 -rotate-2 bg-sage/85 shadow-sm"
                />
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  sizes="(min-width: 860px) 280px, 46vw"
                  className="fc-zoomable aspect-[5/4] w-full object-cover"
                />
                <figcaption className="pt-2 text-center font-hand text-[clamp(13px,1.7vw,16px)] leading-[1.3]">
                  {shot.caption}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noopener"
              className="fc-btn fc-btn-quiet px-6"
            >
              Xem thêm ảnh trên Facebook
            </a>
          </div>
        </div>
      </section>

      <section className="fc-ondark relative overflow-hidden bg-deep pt-[clamp(44px,5vw,64px)] pb-[clamp(32px,3.4vw,44px)]">
        <Backdrop src={img.bgDatPhong} shade="bg-deep/70" />
        <Wave flip className="absolute inset-x-0 -top-px text-blush" />
        <div className="fc-container grid gap-x-[clamp(28px,4vw,56px)] gap-y-8 nav:grid-cols-[0.92fr_1.08fr]">
          <div className="fc-reveal fc-from-left flex flex-col">
            <h2 className="font-display text-[clamp(24px,2.5vw,30px)] leading-tight font-bold text-cream">
              Những câu hỏi thường gặp
            </h2>
            <div className="mt-3 border-t border-cream/25">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="fc-faq border-b border-cream/25 text-cream"
                >
                  <summary className="flex min-h-[48px] items-center justify-between gap-4 py-2 text-[15px] font-medium nav:min-h-[43px] nav:py-1.5">
                    <span>{faq.q}</span>
                    <span
                      className="fc-plus flex size-6 shrink-0 items-center justify-center rounded-full bg-cream/15 text-[19px] leading-none text-sand"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <div className="max-w-[40em] pr-10 pb-4 text-[15px] text-mist">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
            <div className="mt-auto pt-4">
              <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 rounded-[18px] border border-cream/25 bg-deep/45 px-4 py-2.5">
                <p className="text-[15px] text-cream">Chưa thấy câu trả lời?</p>
                <div className="flex gap-2.5">
                  <a
                    className="fc-btn min-h-10 bg-cream px-4 text-ink"
                    href={SITE.zalo}
                    target="_blank"
                    rel="noopener"
                  >
                    Nhắn Zalo
                  </a>
                  <a
                    className="fc-btn fc-btn-quiet min-h-10 border-cream px-4 text-cream"
                    href={`tel:${SITE.phone}`}
                  >
                    Gọi
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="fc-reveal fc-from-right rounded-[24px] bg-cream p-[clamp(16px,1.8vw,22px)] text-ink shadow-[0_30px_50px_-30px_rgba(0,0,0,0.8)]">
            <h2 className="font-display text-[clamp(22px,2.1vw,26px)] leading-tight font-bold">
              Gửi yêu cầu đặt phòng
            </h2>
            <p className="mt-1 text-[14px] text-muted">
              Trang này không lưu thông tin của bạn.
            </p>
            <BookingForm />
          </div>
        </div>
      </section>

      <footer
        id="lien-he"
        className="fc-footer relative bg-blush pt-[clamp(48px,5.5vw,84px)] text-[14.5px] text-ink"
      >
        <Wave flip className="absolute inset-x-0 -top-px text-deep" />
        <div className="fc-container grid gap-x-10 gap-y-7 nav:grid-cols-[1fr_1.3fr_1.2fr]">
          <div className="flex flex-col items-start gap-3">
            <Link
              href="/"
              aria-label="4Chan Homestay – về trang chủ"
              className="fc-link"
            >
              <Wordmark />
            </Link>
            <span>Homestay theo giờ, tự check-in tại Hà Nội</span>
            <div className="flex flex-wrap gap-x-5">
              {[
                ["Facebook", SITE.facebook],
                ["Messenger", SITE.messenger],
                ["Zalo", SITE.zalo],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  className="fc-link inline-flex min-h-11 items-center font-medium underline underline-offset-4"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="font-display text-lg font-bold">Liên hệ</div>
            {BRANCHES.map((branch) => (
              <div key={branch.name} className="flex gap-2.5">
                <Icon
                  size={18}
                  stroke="#333A2B"
                  width={1.8}
                  className="mt-[3px] shrink-0"
                >
                  {pinPath}
                </Icon>
                <span>{branch.address}</span>
              </div>
            ))}
            <div className="flex gap-2.5">
              <Icon
                size={18}
                stroke="#333A2B"
                width={1.8}
                className="mt-[3px] shrink-0"
              >
                {phonePath}
              </Icon>
              <span>
                SĐT / Zalo:{" "}
                <a
                  href={`tel:${SITE.phone}`}
                  className="fc-link font-semibold underline underline-offset-4"
                >
                  {SITE.phoneDisplay}
                </a>
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-sage">
            <iframe
              src={MAPS_EMBED}
              title="Bản đồ 4Chan Homestay, 107 Ngõ Văn Hương, Khâm Thiên, Hà Nội"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[190px] w-full border-0"
            />
            <a
              href={SITE.maps}
              target="_blank"
              rel="noopener"
              className="absolute right-2 bottom-2 rounded-lg bg-white px-3 py-1.5 text-[13px] font-semibold text-ink shadow-md hover:text-clay!"
            >
              Mở Google Maps
            </a>
          </div>
        </div>
        <div className="fc-container mt-6 border-t border-ink/20 pt-4 text-[13.5px]">
          © 2026 {SITE.name}
        </div>
      </footer>

      <a
        className="fc-btn fixed right-6 bottom-6 z-30 hidden size-16 border-[3px] border-white bg-[#0A63D8] p-0 text-base shadow-[0_12px_24px_-10px_rgba(0,0,0,0.55)] nav:flex"
        href={SITE.zalo}
        target="_blank"
        rel="noopener"
        aria-label="Nhắn Zalo cho 4Chan Homestay"
      >
        Zalo
      </a>

      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-line bg-white px-3 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom,0px))] font-semibold shadow-[0_-10px_24px_-18px_rgba(39,45,32,0.5)] nav:hidden">
        <a
          href={`tel:${SITE.phone}`}
          className="flex min-h-[50px] flex-[1_1_0] items-center justify-center rounded-xl border-[1.5px] border-ink"
        >
          Gọi
        </a>
        <a
          href={SITE.zalo}
          target="_blank"
          rel="noopener"
          className="flex min-h-[50px] flex-[1_1_0] items-center justify-center rounded-xl border-[1.5px] border-ink"
        >
          Zalo
        </a>
        <a
          href="#dat-phong"
          className="flex min-h-[50px] flex-[2_1_0] items-center justify-center rounded-xl bg-clay text-white"
        >
          Đặt phòng
        </a>
      </div>
    </BookingProvider>
  );
}
