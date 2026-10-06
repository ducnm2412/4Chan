import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 90 dành cho ảnh phòng, 100 cho ảnh phủ kín khung ở phần chọn phòng;
    // mức nén 75 mặc định làm các ảnh này kém nét.
    qualities: [75, 90, 100],
  },
};

export default nextConfig;
