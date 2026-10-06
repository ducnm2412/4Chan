import type { Metadata } from "next";
import { Be_Vietnam_Pro, Playpen_Sans, Quicksand } from "next/font/google";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin", "vietnamese"],
});

const playpen = Playpen_Sans({
  variable: "--font-playpen",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title:
    "4Chan Homestay – Homestay theo giờ Khâm Thiên, Thanh Xuân, Long Biên",
  description:
    "Homestay theo giờ tại Hà Nội, ba cơ sở ở Khâm Thiên, Thanh Xuân và Long Biên. Tự check-in, riêng tư, sạch sẽ. Từ 249k cho 3 giờ, đặt phòng qua Zalo 0365 247 685.",
  keywords: [
    "homestay theo giờ Khâm Thiên",
    "homestay theo giờ Thanh Xuân",
    "homestay theo giờ Long Biên",
    "homestay tự check-in Hà Nội",
    "4Chan Homestay",
  ],
  openGraph: {
    title: "4Chan Homestay – Homestay theo giờ tại Hà Nội",
    description:
      "Ba cơ sở ở Khâm Thiên, Thanh Xuân, Long Biên. Tự check-in, riêng tư, từ 249k cho 3 giờ.",
    images: ["/images/room-702.jpg"],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${beVietnam.variable} ${quicksand.variable} ${playpen.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
