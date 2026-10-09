import Image, { type StaticImageData } from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { BookingForm, BookingProvider } from "@/components/booking";
import { CountUp } from "@/components/count-up";
import { Lightbox } from "@/components/lightbox";
import { MobileMenu } from "@/components/mobile-menu";
import { Preloader } from "@/components/preloader";
import { RevealOnScroll } from "@/components/reveal";
import { RoomShowcase } from "@/components/rooms";
import { SmoothScroll } from "@/components/smooth-scroll";
import { img } from "@/lib/images";
import {
  BRANCHES,
  EXTRA_HOUR,
  MAPS_EMBED,
  PACKAGES,
  ROOM_TYPES,
  ROOMS,
  SITE,
  WEEKEND_SURCHARGE,
  type BranchName,
} from "@/lib/site";

const navLinks = [
  { href: "#gioi-thieu", label: "Giới thiệu" },
  { href: "#phong", label: "Loại phòng" },
  { href: "#bang-gia", label: "Bảng giá" },
  { href: "#co-so", label: "Cơ sở" },
];

const branchCards: Record<
  BranchName,
  { image?: StaticImageData; alt?: string; position?: string }
> = {
  "Khâm Thiên": {
    image: img.mayBanCong,
    alt: "Ban công phòng Mây Chill ở cơ sở Khâm Thiên",
    position: "object-[85%_center]",
  },
  // Chưa có ảnh thật của cơ sở này nên dùng tạm ảnh một phòng ở Long Biên
  "Thanh Xuân": {
    image: img.room202,
    alt: "Ảnh minh hoạ phòng 4Chan Homestay: giường khung cam dưới mảng tường vòm",
    position: "object-[30%_center]",
  },
  "Long Biên": {
    image: img.room601,
    alt: "Room 601 ở cơ sở Long Biên, cửa kính mở ra ban công",
    position: "object-[12%_center]",
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
    q: "Trong phòng có những gì?",
    a: "Đệm cao su non, máy lạnh hai chiều, toilet khép kín, bếp mini và tủ lạnh. Nhiều phòng có máy chiếu và sofa.",
  },
];

// Những việc khách hay làm trong phòng, kèm ảnh thật của góc đó. Ảnh đầu
// chiếm ô lớn của lưới.
const moments = [
  {
    src: img.room201,
    alt: "Màn chiếu lớn sát giường ở Room 201",
    label: "Xem phim tại giường",
  },
  {
    src: img.mayBep,
    alt: "Bếp mini phòng Mây Chill",
    label: "Nấu ăn ở bếp mini",
  },
  {
    src: img.mayBanCong,
    alt: "Ban công phòng Mây Chill nhìn ra mái phố",
    label: "Ngắm phố từ ban công",
  },
  {
    src: img.room501,
    alt: "Sofa đôi cạnh cửa kính ở Room 501",
    label: "Nằm dài trên sofa",
  },
  {
    src: img.meoDecor,
    alt: "Bộ bát đĩa in hình mèo ở phòng Mèo Chill",
    label: "Trà chiều nhà mèo",
  },
];

// Ba bước từ lúc nhắn tin tới lúc vào phòng
const steps = [
  {
    title: "Nhắn Zalo giữ phòng",
    text: "Chọn cơ sở, phòng và gói giờ rồi nhắn cho 4Chan. Có phòng là chốt ngay.",
  },
  {
    title: "Nhận hướng dẫn check-in",
    text: "Trước giờ nhận phòng, bạn nhận địa chỉ chi tiết và mã cửa qua Zalo.",
  },
  {
    title: "Tự vào phòng, tự trả phòng",
    text: "Không qua lễ tân. Hết giờ, bạn chỉ cần khép cửa lại là xong.",
  },
];

// Số liệu lấy từ dữ liệu thật của trang
const stats = [
  { value: BRANCHES.length, unit: "", label: "cơ sở ở Hà Nội" },
  { value: ROOMS.length, unit: "", label: "phòng, mỗi phòng một phong cách" },
  { value: PACKAGES[0].prices[0], unit: "k", label: "giá từ, cho gói 3 giờ" },
  { value: 24, unit: "/7", label: "tự check-in bất kể giờ nào" },
];

const amenities = [
  {
    title: "Máy chiếu màn lớn",
    text: "Xem phim ngay trên giường, có sẵn Netflix và YouTube.",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="12" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
  },
  {
    title: "Đệm cao su non",
    text: "Nằm êm, không lún, ga gối thay mới sau mỗi lượt khách.",
    icon: (
      <>
        <path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" />
        <path d="M5 10V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3M3 18h18M3 21v-3M21 21v-3" />
      </>
    ),
  },
  {
    title: "Bếp mini và tủ lạnh",
    text: "Bếp từ, nồi chảo, bát đĩa. Nấu được bữa nhỏ cho hai người.",
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M4 10h16M9 6v1M9 14v2" />
      </>
    ),
  },
  {
    title: "Máy lạnh hai chiều",
    text: "Mát mùa hè, ấm mùa đông, điều khiển ngay đầu giường.",
    icon: (
      <>
        <rect x="3" y="6" width="18" height="8" rx="2" />
        <path d="M7 10h.01M7 17l-1 3M12 17v3M17 17l1 3" />
      </>
    ),
  },
  {
    title: "Toilet khép kín",
    text: "Nước nóng, khăn tắm, dầu gội và sữa tắm có sẵn.",
    icon: (
      <>
        <path d="M4 12h16v2a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-2z" />
        <path d="M6 12V5a2 2 0 0 1 2-2h1M16 7l2-2 2 2" />
      </>
    ),
  },
  {
    title: "Wifi và khoá mã số",
    text: "Mạng mạnh, cửa khoá mã riêng cho từng lượt ở.",
    icon: (
      <>
        <path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0" />
        <circle cx="12" cy="19.5" r="1" />
        <path d="M2 8.5a15 15 0 0 1 20 0" />
      </>
    ),
  },
];

const houseRules = [
  { ok: true, text: "Mang theo CCCD để xác nhận khi cần" },
  { ok: true, text: "Giữ phòng yên tĩnh sau 22h" },
  { ok: true, text: "Đồ ăn mang vào thoải mái, dọn gọn trước khi về" },
  { ok: false, text: "Không hút thuốc trong phòng" },
  { ok: false, text: "Không mang thú cưng" },
  { ok: false, text: "Không tụ tập quá số người đã báo" },
];

function HowItWorks() {
  return (
    <section
      id="cach-dat"
      className="fc-ondark relative overflow-hidden bg-deep pt-[clamp(56px,7vw,100px)] pb-[clamp(72px,9vw,130px)] text-cream"
    >
      <Wave flip className="absolute inset-x-0 -top-px text-blush" />
      {/* Mép dưới cắt chéo, dẫn sang nền kem của phần chọn phòng */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[clamp(28px,5vw,72px)] bg-sand-soft [clip-path:polygon(0_100%,100%_0,100%_100%)]"
      />
      <div className="fc-container">
        <div className="grid gap-x-12 gap-y-4 nav:grid-cols-[1fr_auto] nav:items-end">
          <div>
            <p className="fc-reveal fc-slow font-hand text-[20px] text-sand">
              Cách đặt phòng
            </p>
            <h2 className="fc-reveal fc-slow fc-from-left fc-h2 mt-1 max-w-[16em]">
              Từ tin nhắn tới lúc khép cửa, chỉ ba bước
            </h2>
          </div>
          <a
            className="fc-btn fc-reveal fc-slow fc-from-right justify-self-start bg-cream px-7 text-ink nav:justify-self-end"
            href={SITE.zalo}
            target="_blank"
            rel="noopener"
          >
            Nhắn Zalo ngay
          </a>
        </div>

        {/* Dòng thời gian: đường kẻ tự vẽ qua ba mốc khi cuộn tới */}
        <ol className="fc-reveal fc-slow relative mt-12 grid gap-10 nav:mt-16 nav:grid-cols-3 nav:gap-8">
          <svg
            aria-hidden="true"
            viewBox="0 0 100 1"
            preserveAspectRatio="none"
            className="absolute top-[26px] left-[16.6%] hidden h-[2px] w-[66.8%] nav:block"
          >
            <line
              x1="0"
              y1="0.5"
              x2="100"
              y2="0.5"
              pathLength={1}
              className="fc-draw"
              stroke="currentColor"
              strokeOpacity="0.4"
              strokeWidth="1"
              strokeDasharray="0.012 0.012"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {steps.map((step, i) => (
            <li
              key={step.title}
              style={{ transitionDelay: `${300 + i * 420}ms` }}
              className="fc-reveal fc-slow relative flex gap-5 nav:flex-col nav:items-center nav:text-center"
            >
              <span
                aria-hidden="true"
                className="fc-pop relative z-1 flex size-[52px] shrink-0 items-center justify-center rounded-full border-2 border-sand bg-deep font-serif text-[22px] font-bold text-sand"
              >
                0{i + 1}
              </span>
              <div className="nav:mt-5">
                <h3 className="font-display text-[20px] leading-tight font-bold">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[26em] text-[15px] text-cream/75">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <dl className="mt-14 grid grid-cols-2 divide-cream/15 overflow-hidden rounded-[24px] border border-cream/15 bg-cream/5 nav:mt-20 nav:grid-cols-4 nav:divide-x">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              style={{ transitionDelay: `${i * 160}ms` }}
              className={`fc-reveal fc-slow px-5 py-6 max-nav:border-cream/15 nav:px-7 ${i % 2 === 1 ? "max-nav:border-l" : ""} ${i >= 2 ? "max-nav:border-t" : ""}`}
            >
              <dd className="font-serif text-[clamp(38px,4.4vw,56px)] leading-none font-bold tracking-[-0.02em] text-sand">
                <CountUp value={stat.value} />
                {stat.unit}
              </dd>
              <dt className="mt-2 text-[14px] text-cream/75 sm:text-[15px]">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

// Ô ảnh chen giữa các ô tiện nghi trong lưới bento
const amenityShots = [
  { src: img.bep601, alt: "Bếp mini Room 601 với bếp từ và tủ lạnh nhỏ" },
  { src: img.phongTam601, alt: "Phòng tắm khép kín Room 601" },
];

function Amenities() {
  // Màu nền xen kẽ cho các ô chữ
  const tones = ["bg-white", "bg-sage-soft", "bg-sand-soft"];
  return (
    <section
      id="tien-nghi"
      className="fc-paper fc-overlap relative z-3 -mt-[clamp(24px,4vw,56px)] rounded-t-[clamp(32px,5vw,64px)] pt-[clamp(44px,6vw,84px)] pb-[clamp(36px,5vw,72px)]"
    >
      <div className="fc-container">
        <div className="mx-auto max-w-[36em] text-center">
          <p className="fc-reveal fc-slow font-hand text-[20px] text-clay">
            Tiện nghi
          </p>
          <h2 className="fc-reveal fc-slow fc-zoom-in fc-h2 mt-1">
            Mọi phòng đều có sẵn
          </h2>
          <p className="fc-reveal fc-slow fc-lede mx-auto">
            Không phải hỏi trước, không phải mang theo. Đến là ở.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 nav:grid-cols-4 nav:grid-rows-[repeat(3,minmax(0,1fr))] nav:gap-4">
          {/* Ô ảnh lớn bên trái, chiếm hai hàng */}
          <li
            className="fc-reveal fc-slow fc-from-left relative col-span-2 overflow-hidden rounded-[24px] max-nav:aspect-[16/10] nav:col-span-1 nav:row-span-2"
          >
            <Image
              src={amenityShots[0].src}
              alt={amenityShots[0].alt}
              fill
              sizes="(min-width: 860px) 300px, 100vw"
              className="fc-zoomable object-cover"
            />
          </li>
          {amenities.slice(0, 4).map((a, i) => (
            <AmenityTile key={a.title} a={a} tone={tones[i % 3]} delay={i} />
          ))}
          <li className="fc-reveal fc-slow fc-from-right relative overflow-hidden rounded-[24px] max-nav:aspect-square nav:col-start-4 nav:row-span-2 nav:row-start-2">
            <Image
              src={amenityShots[1].src}
              alt={amenityShots[1].alt}
              fill
              sizes="(min-width: 860px) 300px, 50vw"
              className="fc-zoomable object-cover"
            />
          </li>
          {amenities.slice(4).map((a, i) => (
            <AmenityTile
              key={a.title}
              a={a}
              tone={tones[(i + 1) % 3]}
              delay={i + 4}
            />
          ))}
          <li className="fc-reveal fc-slow fc-zoom-in flex flex-col justify-between rounded-[24px] bg-ink p-5 text-cream">
            <span className="font-hand text-[18px] text-sand">
              Và còn nữa
            </span>
            <p className="mt-3 text-[14px] leading-snug text-cream/80 sm:text-[15px]">
              Máy sấy tóc, bàn là, nước lọc, dép đi trong phòng.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}

function AmenityTile({
  a,
  tone,
  delay,
}: {
  a: (typeof amenities)[number];
  tone: string;
  delay: number;
}) {
  return (
    <li
      style={{ transitionDelay: `${delay * 150}ms` }}
      className={`fc-reveal fc-slow fc-zoom-in fc-lift flex flex-col justify-between gap-4 rounded-[24px] p-5 ${tone}`}
    >
      <Icon size={30} width={1.6}>
        {a.icon}
      </Icon>
      <div>
        <h3 className="font-display text-[16px] leading-tight font-bold sm:text-[17px]">
          {a.title}
        </h3>
        <p className="mt-1 text-[13px] leading-snug text-muted sm:text-[14px]">
          {a.text}
        </p>
      </div>
    </li>
  );
}

function HouseRules() {
  return (
    <section
      id="luu-y"
      className="fc-paper fc-overlap relative z-3 -mt-[clamp(20px,3vw,40px)] rounded-t-[clamp(32px,5vw,64px)] bg-sand-soft pt-[clamp(40px,5vw,72px)] pb-[clamp(28px,3.6vw,48px)]"
    >
      <div className="fc-container grid items-center gap-x-[clamp(28px,5vw,72px)] gap-y-8 nav:grid-cols-[1fr_1.1fr]">
        <div className="fc-reveal fc-slow fc-from-left relative">
          <Image
            src={img.room601}
            alt="Room 601: giường xám và ghế bành cạnh cửa kính ra ban công"
            quality={90}
            sizes="(min-width: 860px) 480px, 100vw"
            className="fc-zoomable aspect-[4/5] w-full rounded-[28px] object-cover nav:aspect-[4/4.6]"
          />
          <p className="absolute -right-2 bottom-6 rotate-[-3deg] rounded-full bg-cream px-4 py-1.5 font-hand text-[18px] text-ink shadow-[0_14px_24px_-14px_rgba(39,45,32,0.6)] nav:right-[-14px]">
            Phòng của bạn, trong vài giờ
          </p>
        </div>
        <div>
          <h2 className="fc-reveal fc-slow fc-from-right fc-h2">
            Vài lưu ý nhỏ để buổi hẹn trọn vẹn
          </h2>
          <p className="fc-reveal fc-slow fc-from-right fc-lede">
            Nhà nhỏ, khách tự vào tự ra, nên mình nhờ bạn vài điều.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {houseRules.map((rule, i) => (
              <li
                key={rule.text}
                style={{ transitionDelay: `${i * 140}ms` }}
                className="fc-reveal fc-slow fc-from-right flex items-start gap-3 rounded-[16px] bg-white/70 px-4 py-3"
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${rule.ok ? "bg-sage text-ink" : "bg-peach text-white"}`}
                >
                  {rule.ok ? "✓" : "×"}
                </span>
                <span className="text-[15px] leading-snug">{rule.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function DateIdeas() {
  return (
    <section className="fc-ondark relative overflow-hidden bg-deep py-[clamp(48px,6vw,84px)] text-cream">
      <Wave flip className="absolute inset-x-0 -top-px text-blush" />
      <Wave className="absolute inset-x-0 -bottom-px z-1 text-blush" />
      <div className="fc-container">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <h2 className="fc-reveal fc-from-left fc-h2">
            Một buổi hẹn, đủ trò để làm
          </h2>
          <a
            className="fc-btn fc-reveal bg-cream px-7 text-ink"
            href="#dat-phong"
          >
            Đặt phòng
          </a>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 nav:h-[clamp(380px,52svh,460px)] nav:grid-cols-4 nav:grid-rows-2 nav:gap-4">
          {moments.map((m, i) => (
            <figure
              key={m.label}
              style={{ transitionDelay: `${i * 130}ms` }}
              className={`fc-reveal fc-zoom-in group relative overflow-hidden rounded-[20px] ${i === 0 ? "col-span-2 max-nav:aspect-[4/3] nav:row-span-2" : "max-nav:aspect-square"}`}
            >
              <Image
                src={m.src}
                alt={m.alt}
                fill
                quality={90}
                sizes={
                  i === 0
                    ? "(min-width: 860px) 600px, 100vw"
                    : "(min-width: 860px) 300px, 50vw"
                }
                className="fc-zoomable object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
              />
              <figcaption className="pointer-events-none absolute bottom-2.5 left-2.5 rounded-full bg-cream px-3 py-1 font-hand text-[15px] leading-tight text-ink nav:bottom-3 nav:left-3 nav:text-[17px]">
                {m.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

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
      <span className="flex flex-col leading-none max-[359px]:hidden">
        <span className="font-display text-[26px] font-bold tracking-[-0.01em]">
          4Chan
        </span>
        <span className="mt-0.5 text-[13px] font-medium">Homestay</span>
      </span>
    </span>
  );
}

// Nền ghép từ tám ảnh phòng. Mỗi ô nhỏ hơn kích thước gốc của ảnh nên nền
// luôn nét, khác với một ảnh duy nhất bị phóng to ra cả màn hình. `shade` là
// lớp phủ màu để chữ phía trên đọc được.
const wall = [
  img.room702,
  img.room401,
  img.room202,
  img.room601,
  img.room402,
  img.room501,
  img.room602,
  img.room201,
];

function PhotoWall({ shade, eager }: { shade: string; eager?: boolean }) {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 grid-rows-4 nav:grid-cols-4 nav:grid-rows-2"
      >
        {wall.map((src, i) => (
          <div key={i} className="relative overflow-hidden">
            <Image
              src={src}
              alt=""
              fill
              quality={90}
              preload={eager && i < 4}
              sizes="(min-width: 860px) 25vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
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
      <Preloader />
      <SmoothScroll />
      <RevealOnScroll />
      <Lightbox />

      <section
        id="top"
        className="fc-ondark relative flex min-h-svh flex-col overflow-hidden bg-deep pt-[84px] text-cream nav:h-svh nav:min-h-[600px]"
      >
        <PhotoWall
          eager
          shade="bg-[radial-gradient(ellipse_at_center,rgba(39,45,32,0.86)_0%,rgba(39,45,32,0.7)_45%,rgba(39,45,32,0.42)_100%)]"
        />
        <header className="fc-header fixed inset-x-0 top-0 z-30">
          <div className="fc-header-bar fc-container flex items-center justify-between gap-3 py-[18px] nav:gap-5">
            <a href="#top" aria-label="4Chan Homestay – về đầu trang">
              <Wordmark />
            </a>
            <nav
              aria-label="Điều hướng chính"
              className="hidden gap-[30px] text-[15px] font-medium nav:flex"
            >
              {navLinks.map((l) => (
                <a key={l.href} className="fc-link" href={l.href}>
                  {l.label}
                </a>
              ))}
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
              <MobileMenu
                links={navLinks}
                phone={SITE.phone}
                phoneDisplay={SITE.phoneDisplay}
              />
            </div>
          </div>
        </header>

        <div className="fc-container flex w-full grow flex-col items-center justify-center pb-[clamp(40px,8svh,96px)] text-center">
          <div className="fc-rise flex max-w-[1000px] flex-col items-center">
            <Image
              src={img.logoMark}
              alt="Logo 4Chan Homestay"
              sizes="120px"
              className="mb-5 size-[clamp(76px,min(9vw,13svh),112px)] rounded-[24%] bg-cream object-contain p-2 shadow-[0_18px_30px_-16px_rgba(0,0,0,0.7)]"
            />
            <h1 className="[text-shadow:0_2px_22px_rgba(39,45,32,0.55)]">
              <span className="block font-serif text-[clamp(36px,min(5.4vw,8.6svh),74px)] leading-[1.02] font-semibold tracking-[-0.01em] text-balance">
                Một chỗ riêng cho hai người
              </span>
              <span className="mt-1 block font-script text-[clamp(40px,min(6.6vw,9.6svh),86px)] leading-[1.05] text-sand">
                thuê theo giờ
              </span>
            </h1>
            <p className="mt-5 flex items-center gap-4 text-[clamp(15px,1.5vw,18px)] font-medium tracking-[0.05em] whitespace-nowrap">
              <span
                aria-hidden="true"
                className="h-px w-12 bg-cream/60 max-[479px]:hidden"
              />
              Tự check-in. Từ 249k cho 3 giờ.
              <span
                aria-hidden="true"
                className="h-px w-12 bg-cream/60 max-[479px]:hidden"
              />
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a className="fc-btn min-h-12 px-7 text-base" href="#dat-phong">
                Đặt phòng
              </a>
              <a
                className="fc-btn fc-btn-quiet min-h-12 border-cream px-7 text-base text-cream"
                href="#phong"
              >
                Xem phòng
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="gioi-thieu" className="fc-paper fc-section">
        <div className="fc-container flex flex-wrap items-center gap-[clamp(32px,6vw,80px)]">
          <div className="fc-reveal fc-from-left min-w-0 flex-[1_1_380px]">
            <h2 className="fc-reveal fc-from-left fc-h2">
              Không gian cho những cuộc hẹn đáng nhớ
            </h2>
            <p className="fc-lede">
              Đáng giá không phải vì đi đâu, mà vì ở cùng ai.
            </p>
            <div className="mt-7 grid grid-cols-3 gap-3 sm:gap-6">
              {[
                {
                  icon: lockPath,
                  title: "Tự check-in, tự trả phòng",
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
                },
                {
                  icon: (
                    <>
                      <path d="M12 3l1.800 4.700L18.500 9.500l-4.700 1.800L12 16l-1.800-4.700L5.500 9.500l4.700-1.800z" />
                      <path d="M18.500 15.500l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
                    </>
                  ),
                  title: "Sạch sẽ, gọn gàng",
                },
              ].map((fact) => (
                <div key={fact.title} className="flex flex-col gap-2">
                  <Icon size={38}>{fact.icon}</Icon>
                  <div className="text-sm leading-[1.3] font-semibold sm:text-base">
                    {fact.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="fc-reveal fc-from-right relative min-w-0 flex-[1_1_340px] pr-[clamp(20px,4vw,44px)] pb-[clamp(28px,4vw,48px)]">
            <Image
              src={img.room501}
              alt="Room 501: sofa đôi màu be, giường thấp và cửa kính mở ra ban công"
              quality={90}
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

      <HowItWorks />

      <RoomShowcase />

      <Amenities />

      <section id="bang-gia" className="fc-paper fc-section">
        <div className="fc-container grid items-start gap-x-[clamp(28px,4vw,56px)] gap-y-7 nav:grid-cols-[0.78fr_1.6fr]">
          <div className="nav:sticky nav:top-8">
            <h2 className="fc-reveal fc-from-left fc-h2">Bảng giá theo giờ</h2>
            <p className="fc-lede">Áp dụng ở cả ba cơ sở.</p>
            <dl className="fc-reveal mt-5 grid grid-cols-2 gap-3 nav:grid-cols-1">
              {[
                [`+${WEEKEND_SURCHARGE}k`, "Thứ 6, Thứ 7"],
                [`+${EXTRA_HOUR}k`, "Mỗi giờ ở thêm"],
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
                  style={{ transitionDelay: `${(i % 2) * 160}ms` }}
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

      <DateIdeas />

      <section id="co-so" className="fc-paper fc-section">
        <div className="fc-container">
          <h2 className="fc-reveal fc-from-left fc-h2">Ba cơ sở tại Hà Nội</h2>
          <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
            {BRANCHES.map((branch, i) => {
              const card = branchCards[branch.name];
              return (
                <article
                  key={branch.name}
                  style={{ transitionDelay: `${i * 130}ms` }}
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
                style={{ transitionDelay: `${(i % 3) * 130}ms` }}
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

      <HouseRules />

      <section className="fc-ondark relative overflow-hidden bg-deep pt-[clamp(44px,5vw,64px)] pb-[clamp(32px,3.4vw,44px)]">
        <PhotoWall shade="bg-deep/85" />
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
        className="fc-footer relative bg-blush pt-6 text-[14.5px] text-ink"
      >
        <div className="fc-container grid gap-x-10 gap-y-5 nav:grid-cols-[1fr_1.3fr_1.2fr]">
          <div className="flex flex-col items-start gap-1.5">
            <a
              href="#top"
              aria-label="4Chan Homestay – về đầu trang"
              className="fc-link"
            >
              <Wordmark />
            </a>
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

          <div className="flex flex-col gap-1.5">
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
              className="block h-[150px] w-full border-0"
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
        <div className="fc-container mt-4 border-t border-ink/20 pt-3 text-[13.5px]">
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
