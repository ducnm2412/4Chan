"use client";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  BRANCHES,
  PACKAGES,
  ROOM_TYPES,
  ROOMS,
  SITE,
  WEEKEND_SURCHARGE,
  priceOf,
  type RoomName,
  type RoomType,
} from "@/lib/site";

type Fields = {
  date: string;
  time: string;
  pkg: string;
  type: string;
  branch: string;
  room: string;
  name: string;
  phone: string;
  note: string;
};

type Booking = Fields & {
  today: string;
  set: (key: keyof Fields, value: string) => void;
  pickRoom: (room: string) => void;
};

const BookingContext = createContext<Booking | null>(null);

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toDate = (v: string) => {
  const [y, m, d] = v.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const vn = (v: string) => v.split("-").reverse().join("/");

// Ngày hôm nay chỉ có ở trình duyệt: trang được dựng tĩnh nên server trả về rỗng.
const subscribe = () => () => {};
const getToday = () => iso(new Date());
const getServerToday = () => "";

export function BookingProvider({ children }: { children: ReactNode }) {
  const today = useSyncExternalStore(subscribe, getToday, getServerToday);
  const [fields, setFields] = useState<Fields>({
    date: "",
    time: "14:00",
    pkg: PACKAGES[0].id,
    type: ROOM_TYPES[0],
    branch: BRANCHES[0].name,
    room: "",
    name: "",
    phone: "",
    note: "",
  });

  const set = (key: keyof Fields, value: string) =>
    setFields((f) => {
      const next = { ...f, [key]: value };
      // Đổi cơ sở hay loại phòng thì phòng đã chọn có thể không còn khớp.
      const picked = ROOMS.find((r) => r.name === next.room);
      if (
        picked &&
        (picked.branch !== next.branch || picked.type !== next.type)
      )
        next.room = "";
      return next;
    });
  const pickRoom = (room: string) =>
    setFields((f) => {
      const picked = ROOMS.find((r) => r.name === room);
      return picked
        ? { ...f, room, branch: picked.branch, type: picked.type }
        : { ...f, room: "" };
    });

  return (
    <BookingContext
      value={{ ...fields, date: fields.date || today, today, set, pickRoom }}
    >
      {children}
    </BookingContext>
  );
}

function useBooking() {
  const booking = useContext(BookingContext);
  if (!booking) throw new Error("useBooking phải nằm trong BookingProvider");
  return booking;
}

export function BookRoomLink({ room }: { room: RoomName }) {
  const { pickRoom } = useBooking();
  return (
    <a
      className="fc-btn min-h-10 px-4 text-sm"
      href="#dat-phong"
      onClick={() => pickRoom(room)}
    >
      Đặt phòng
    </a>
  );
}

const labelClass = "text-[13px] font-medium text-muted";

export function BookingForm() {
  const b = useBooking();
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const pkg = PACKAGES.find((p) => p.id === b.pkg) ?? PACKAGES[0];
  const weekend = b.date ? [5, 6].includes(toDate(b.date).getDay()) : false;
  const price =
    priceOf(b.type as RoomType, pkg) + (weekend ? WEEKEND_SURCHARGE : 0);

  const dateOk = b.date !== "" && b.date >= b.today;
  const phoneOk = b.phone.replace(/\D/g, "").length >= 9;
  const valid = dateOk && phoneOk;
  const errorText = !dateOk
    ? "Ngày nhận phòng đã qua. Chọn hôm nay hoặc một ngày sắp tới rồi gửi lại."
    : "Nhập số điện thoại hoặc Zalo để 4Chan gửi hướng dẫn check-in.";
  const when = pkg.window || `nhận phòng lúc ${b.time}`;
  const summary = valid
    ? `${b.name ? `${b.name}, ` : ""}${b.phone}. Đặt ${b.room || `phòng ${b.type.toLowerCase()}`} tại cơ sở ${b.branch}, gói ${pkg.label} (${when}), ngày ${vn(b.date)}. Tạm tính ${price}k.${b.note ? ` Ghi chú: ${b.note}` : ""}`
    : "";

  // Zalo không nhận nội dung soạn sẵn qua link, nên chép sẵn để khách dán vào.
  const copySummary = () => {
    navigator.clipboard?.writeText(summary).then(
      () => setCopied(true),
      () => {},
    );
  };

  return (
    <form
      id="dat-phong"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        setCopied(false);
      }}
      className="fc-compact mt-3"
    >
      <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 nav:grid-cols-3 nav:gap-x-2.5 nav:gap-y-2">
        <div className="flex flex-col gap-[5px]">
          <label htmlFor="f-branch" className={labelClass}>
            Cơ sở
          </label>
          <select
            id="f-branch"
            className="fc-field"
            value={b.branch}
            onChange={(e) => b.set("branch", e.target.value)}
          >
            {BRANCHES.map((o) => (
              <option key={o.name} value={o.name}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-[5px]">
          <label htmlFor="f-type" className={labelClass}>
            Loại phòng
          </label>
          <select
            id="f-type"
            className="fc-field"
            value={b.type}
            onChange={(e) => b.set("type", e.target.value)}
          >
            {ROOM_TYPES.map((t) => (
              <option key={t} value={t}>
                Phòng {t.toLowerCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2 flex flex-col gap-[5px] nav:col-span-1">
          <label htmlFor="f-pkg" className={labelClass}>
            Gói giờ
          </label>
          <select
            id="f-pkg"
            className="fc-field"
            value={b.pkg}
            onChange={(e) => b.set("pkg", e.target.value)}
          >
            {PACKAGES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
                {p.window ? `, ${p.window}` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2 flex flex-col gap-[5px] nav:col-span-1">
          <label htmlFor="f-room" className={labelClass}>
            Phòng muốn ở
          </label>
          <select
            id="f-room"
            className="fc-field"
            value={b.room}
            onChange={(e) => b.pickRoom(e.target.value)}
          >
            <option value="">Chưa chọn, nhờ 4Chan xếp phòng trống</option>
            {ROOMS.map((r) => (
              <option key={r.name} value={r.name}>
                {r.name}, {r.branch}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-[5px]">
          <label htmlFor="f-date" className={labelClass}>
            Ngày nhận phòng
          </label>
          <input
            id="f-date"
            className="fc-field"
            type="date"
            min={b.today}
            value={b.date}
            onChange={(e) => b.set("date", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-[5px]">
          <label htmlFor="f-time" className={labelClass}>
            Giờ nhận phòng
          </label>
          {pkg.window ? (
            <output
              id="f-time"
              className="fc-field flex items-center bg-sand-soft text-[14px]"
            >
              {pkg.window.split("–")[0]}, theo gói
            </output>
          ) : (
            <input
              id="f-time"
              className="fc-field"
              type="time"
              value={b.time}
              onChange={(e) => b.set("time", e.target.value)}
            />
          )}
        </div>
        <div className="flex flex-col gap-[5px]">
          <label htmlFor="f-name" className={labelClass}>
            Tên gọi
          </label>
          <input
            id="f-name"
            className="fc-field"
            type="text"
            autoComplete="given-name"
            placeholder="Không bắt buộc"
            value={b.name}
            onChange={(e) => b.set("name", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-[5px]">
          <label htmlFor="f-phone" className={labelClass}>
            SĐT / Zalo
          </label>
          <input
            id="f-phone"
            className="fc-field"
            type="tel"
            autoComplete="tel"
            placeholder="Để nhận mã check-in"
            value={b.phone}
            onChange={(e) => b.set("phone", e.target.value)}
          />
        </div>
        <div className="col-span-2 flex flex-col gap-[5px] nav:col-span-1">
          <label htmlFor="f-note" className={labelClass}>
            Ghi chú
          </label>
          <textarea
            rows={1}
            id="f-note"
            className="fc-field"
            placeholder="Nếu có"
            value={b.note}
            onChange={(e) => b.set("note", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 rounded-xl bg-sage-soft px-4 py-3 nav:mt-3 nav:flex-nowrap nav:py-2">
        <div aria-live="polite" className="min-w-0">
          <div className="text-[13px] text-muted">
            Tạm tính
            {weekend && `, đã gồm +${WEEKEND_SURCHARGE}k Thứ 6, Thứ 7`}
          </div>
          <div className="font-display text-[26px] leading-tight font-bold nav:text-[22px]">
            {price}k
          </div>
        </div>
        <button
          type="submit"
          className="fc-btn min-h-12 flex-[1_1_200px] cursor-pointer text-base nav:min-h-11 nav:flex-none nav:shrink-0 nav:px-7 nav:text-[15px]"
        >
          Gửi yêu cầu đặt phòng
        </button>
      </div>

      {sent && !valid && (
        <p
          role="alert"
          className="mt-3 rounded-[10px] bg-[#F7E7DD] px-3.5 py-3 text-[14.5px] text-[#6B3A20]"
        >
          {errorText}
        </p>
      )}
      {sent && valid && (
        <div
          role="status"
          className="mt-3.5 flex flex-col gap-2.5 rounded-xl border border-line bg-white p-4"
        >
          <div className="text-[15px] font-semibold">
            Yêu cầu đặt phòng của bạn
          </div>
          <div className="text-[15px]">{summary}</div>
          <div className="text-sm text-muted">
            {copied
              ? "Đã sao chép nội dung. Dán vào khung chat để 4Chan giữ phòng."
              : "Gửi nội dung này cho 4Chan để giữ phòng và nhận hướng dẫn check-in."}
          </div>
          <div className="flex flex-wrap gap-2.5">
            <a
              className="fc-btn min-h-12 flex-[1_1_140px] bg-ink px-4"
              href={SITE.zalo}
              target="_blank"
              rel="noopener"
              onClick={copySummary}
            >
              Gửi qua Zalo
            </a>
            <a
              className="fc-btn min-h-12 flex-[1_1_140px] bg-ink px-4"
              href={SITE.messenger}
              target="_blank"
              rel="noopener"
              onClick={copySummary}
            >
              Messenger
            </a>
            <a
              className="fc-btn fc-btn-quiet min-h-12 flex-[1_1_140px] px-4"
              href={`tel:${SITE.phone}`}
            >
              Gọi {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </form>
  );
}
