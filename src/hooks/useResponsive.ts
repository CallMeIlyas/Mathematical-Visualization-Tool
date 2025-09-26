import { useState, useEffect } from "react";

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
};

export function useResponsive() {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // tentukan kategori
  const isMobile = width < breakpoints.sm;
  const isTablet = width >= breakpoints.sm && width < breakpoints.lg;
  const isDesktop = width >= breakpoints.lg;

  // tambahkan class ke body agar global
  useEffect(() => {
    const body = document.body;
    body.classList.remove("mobile", "tablet", "desktop");

    if (isMobile) body.classList.add("mobile");
    if (isTablet) body.classList.add("tablet");
    if (isDesktop) body.classList.add("desktop");
  }, [isMobile, isTablet, isDesktop]);

  return { width, isMobile, isTablet, isDesktop };
}