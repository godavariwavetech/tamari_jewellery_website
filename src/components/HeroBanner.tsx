import { useState, useEffect, useRef, useCallback } from "react";
import { apiService } from "../services/api";

const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

import banner1 from "../assets/banner1.jpeg";
import banner2 from "../assets/banner2.jpeg";
import banner3 from "../assets/banner3.jpg";

const GOLD = "#c9a84c";

interface HeroBannerProps {
  w: number;
}

const HeroBanner = ({ w }: HeroBannerProps) => {
  const [bannerImages, setBannerImages] = useState<string[]>([banner1, banner2, banner3]);
  const [loading, setLoading] = useState(true);
  const banners = bannerImages;
  const total = banners.length;
  const cloneCount = total;
  
  const fetchBanners = useCallback(async (isInitial: boolean = false) => {
    try {
      if (isInitial) setLoading(true);
      const banners = await apiService.getBanners();
      if (banners && banners.length > 0) {
        setBannerImages(banners.map(b => b.banner_image));
      }
    } catch (error) {
      console.warn('Failed to fetch banners, using defaults:', error);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchBanners(true);
  }, [fetchBanners]);
  
  // Reset carousel index when banners change to avoid blanks after navigation
  useEffect(() => {
    setCurrent(banners.length);
  }, [banners.length]);

  const extendedSlides = [
    ...banners.slice(-cloneCount),
    ...banners,
    ...banners.slice(0, cloneCount),
  ];

  const [current, setCurrent] = useState(cloneCount);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const [aspectRatio, setAspectRatio] = useState(16 / 9); // default fallback

  const trackRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(current);
  currentRef.current = current;

  // 🔥 Load image & calculate ratio
  useEffect(() => {
    const img = new Image();
    img.src = banners[((current - cloneCount) % total + total) % total];

    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      setAspectRatio(ratio);
    };
  }, [current]);

  // Responsive
  const isDesktop = w >= 1200;
  const isTablet = w >= 768 && w < 1200;
  const isMobile = w < 768;

  const slideWidth = isDesktop ? 80 : isTablet ? 90 : 100;
  const gap = isDesktop ? 16 : isTablet ? 10 : 0;
  const centerOffset = (100 - slideWidth) / 2;

  const realIndex = ((current - cloneCount) % total + total) % total;

  const getTransformValue = useCallback(
    (idx: number) =>
      `translateX(calc(${centerOffset - idx * (slideWidth + (gap * 100) / (w || 1200))}%))`,
    [centerOffset, slideWidth, gap, w]
  );

  const applyTransform = useCallback(
    (idx: number, animate: boolean) => {
      const track = trackRef.current;
      if (!track) return;
      track.style.transition = animate ? "transform 0.7s ease-in-out" : "none";
      track.style.transform = getTransformValue(idx);
    },
    [getTransformValue]
  );

  useEffect(() => {
    applyTransform(current, true);
  }, [current, applyTransform]);

  const handleTransitionEnd = useCallback(() => {
    const idx = currentRef.current;
    if (idx >= cloneCount + total) {
      const realIdx = cloneCount + (idx - (cloneCount + total));
      applyTransform(realIdx, false);
      setCurrent(realIdx);
    } else if (idx < cloneCount) {
      const realIdx = cloneCount + total - (cloneCount - idx);
      applyTransform(realIdx, false);
      setCurrent(realIdx);
    }
  }, [cloneCount, total, applyTransform]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => setCurrent((p) => p + 1), 3000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const next = () => { setIsAutoPlaying(false); setCurrent((p) => p + 1); };
  const prev = () => { setIsAutoPlaying(false); setCurrent((p) => p - 1); };
  const goTo = (i: number) => { setIsAutoPlaying(false); setCurrent(cloneCount + i); };

  if (loading && banners.length === 0) {
    return (
      <section style={{ position: "relative", width: "100%", height: "200px", marginTop: 16 }} />
    );
  }

  return (
    <section style={{
      position: "relative",
      width: isMobile ? "100vw" : "100%",
      overflow: "hidden",
      marginTop: isMobile ? 12 : 16, // gap above banners
    }}>
      <div
        ref={trackRef}
        onTransitionEnd={handleTransitionEnd}
        style={{
          display: "flex",
          alignItems: "center",
          gap: `${gap}px`,
          transform: getTransformValue(current),
          transition: "transform 0.7s ease-in-out",
        }}
      >
        {extendedSlides.map((img, index) => {
          const slideRealIndex = ((index - cloneCount) % total + total) % total;
          const isActive = slideRealIndex === realIndex;

          return (
            <div key={index} style={{
              width: `${slideWidth}%`,
              flexShrink: 0,
              opacity: isMobile ? 1 : (isActive ? 1 : 0.7),
              transform: isMobile ? "scale(1)" : (isActive ? "scale(1)" : "scale(0.95)"),
            }}>
              <div style={{
                width: "100%",
                aspectRatio: aspectRatio.toString(), // 🔥 AUTO HEIGHT MAGIC
                borderRadius: isMobile ? "0" : "20px",
                overflow: "hidden",
                position: "relative",
                background: "#000",
              }}>
                <img
                  src={img}
                  alt={`Banner ${index}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: isActive ? "contain" : "cover",
                    objectPosition: "center",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Arrows */}
      <button onClick={prev} style={arrowStyle("left", isDesktop)}>
        <ChevronLeft />
      </button>

      <button onClick={next} style={arrowStyle("right", isDesktop)}>
        <ChevronRight />
      </button>

      {/* Dots */}
      <div style={{
        position: "absolute",
        bottom: "12px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "6px",
      }}>
        {banners.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: i === realIndex ? "20px" : "8px",
            height: "6px",
            borderRadius: "3px",
            border: "none",
            background: i === realIndex ? GOLD : "#ccc",
          }} />
        ))}
      </div>
    </section>
  );
};

const arrowStyle = (side: "left" | "right", isDesktop: boolean) => ({
  position: "absolute" as const,
  top: "50%",
  [side]: isDesktop ? "20px" : "8px",
  transform: "translateY(-50%)",
  background: "#fff",
  borderRadius: "50%",
  width: isDesktop ? "40px" : "34px",
  height: isDesktop ? "40px" : "34px",
  border: "none",
  cursor: "pointer",
});

export default HeroBanner;
