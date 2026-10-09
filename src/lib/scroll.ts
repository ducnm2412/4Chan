import type Lenis from "lenis";

// Điểm gặp nhau giữa các component cần cuộn trang: SmoothScroll đăng ký
// instance Lenis, Preloader khoá cuộn khi màn hình chào đang hiện, nút "lên
// đầu trang" cuộn qua Lenis để hai cách cuộn không giành nhau.
let lenis: Lenis | null = null;
let locked = false;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
  if (instance && locked) instance.stop();
}

export function lockScroll(on: boolean) {
  locked = on;
  if (on) lenis?.stop();
  else lenis?.start();
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0);
  else scrollTo({ top: 0, behavior: "smooth" });
}
