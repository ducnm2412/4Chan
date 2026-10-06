export const SITE = {
  name: "4Chan Homestay",
  phone: "0365247685",
  phoneDisplay: "0365 247 685",
  zalo: "https://zalo.me/0365247685",
  messenger: "https://m.me/4ChanHomestay",
  facebook: "https://www.facebook.com/4ChanHomestay",
  maps: "https://maps.app.goo.gl/2TD5HpYrWHy9j4VH9",
} as const;

const mapsSearch = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, Hà Nội`)}`;

export const BRANCHES = [
  {
    name: "Khâm Thiên",
    address: "107 Ngõ Văn Hương, Khâm Thiên",
    maps: mapsSearch("107 Ngõ Văn Hương, Khâm Thiên"),
  },
  {
    name: "Thanh Xuân",
    address: "49/40 Phan Đình Giót, Thanh Xuân",
    maps: mapsSearch("49/40 Phan Đình Giót, Thanh Xuân"),
  },
  {
    name: "Long Biên",
    address: "20B1 Khu 918 Phúc Đồng, Long Biên",
    maps: mapsSearch("20B1 Khu 918 Phúc Đồng, Long Biên"),
  },
] as const;

export type BranchName = (typeof BRANCHES)[number]["name"];

export const MAPS_EMBED = `https://www.google.com/maps?q=${encodeURIComponent("107 Ngõ Văn Hương, Đống Đa, Hà Nội")}&z=16&output=embed`;

export const ROOM_TYPES = ["Cửa sổ", "Ban công"] as const;
export type RoomType = (typeof ROOM_TYPES)[number];

// Giá tính bằng nghìn đồng. `window` là khung giờ cố định của gói; gói không
// có `window` thì tính từ lúc khách nhận phòng.
export const PACKAGES = [
  { id: "3h", label: "3 giờ", window: "", prices: [249, 279] },
  {
    id: "trua",
    label: "Combo trưa 5 giờ",
    window: "10:00–15:00",
    prices: [279, 309],
  },
  { id: "12h", label: "Trong ngày 12 giờ", window: "", prices: [409, 479] },
  {
    id: "dem",
    label: "Qua đêm 12 giờ",
    window: "21:00–09:00 hôm sau",
    prices: [449, 539],
  },
  {
    id: "2n1d",
    label: "2 ngày 1 đêm",
    window: "15:00–11:00 hôm sau",
    prices: [479, 549],
  },
  {
    id: "24h",
    label: "Một ngày 24 giờ",
    window: "10:00–10:00 hôm sau",
    prices: [549, 609],
  },
] as const;

export const EXTRA_HOUR = 60;
export const WEEKEND_SURCHARGE = 50;

export const ROOMS = [
  { name: "Phòng Mây Chill", branch: "Khâm Thiên", type: "Ban công" },
  { name: "Phòng Mèo Chill", branch: "Khâm Thiên", type: "Cửa sổ" },
  { name: "Phòng Retro Pop", branch: "Khâm Thiên", type: "Cửa sổ" },
  { name: "Phòng Puzzle Chill", branch: "Khâm Thiên", type: "Cửa sổ" },
  { name: "Room 702", branch: "Long Biên", type: "Cửa sổ" },
  { name: "Room 402", branch: "Long Biên", type: "Cửa sổ" },
  { name: "Room 601", branch: "Long Biên", type: "Ban công" },
  { name: "Room 401", branch: "Long Biên", type: "Ban công" },
] as const satisfies readonly {
  name: string;
  branch: BranchName;
  type: RoomType;
}[];

export type RoomName = (typeof ROOMS)[number]["name"];

export const priceOf = (type: RoomType, pkg: (typeof PACKAGES)[number]) =>
  pkg.prices[ROOM_TYPES.indexOf(type)];
