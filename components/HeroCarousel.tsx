"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  { src: "/hero/hero-1.png", label: "내 학습 대시보드" },
  { src: "/hero/hero-2.png", label: "단계별 진행률" },
  { src: "/hero/hero-3.png", label: "반복학습 3회차" },
  { src: "/hero/hero-4.png", label: "오답복습 · AI 해설" },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({ 0: true });

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setLoaded((prev) => ({ ...prev, [index]: true }));
  }, [index]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-card bg-gradient-to-br from-primary-pale/60 to-white p-3 shadow-cardHover sm:p-4">
      {SLIDES.map((slide, i) => {
        if (!loaded[i]) return null;
        const visible = i === index;
        return (
          <div
            key={slide.src}
            className="absolute inset-0 flex items-center justify-center p-3 transition-opacity duration-700 ease-in-out sm:p-4"
            style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
            aria-hidden={!visible}
          >
            <Image
              src={slide.src}
              alt={`${slide.label} 화면`}
              width={640}
              height={480}
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              sizes="(max-width: 768px) 90vw, 480px"
              className="max-h-full max-w-full rounded-card object-contain shadow-card"
            />
            <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary shadow-card">
              {slide.label}
            </span>
          </div>
        );
      })}

      <div className="absolute bottom-4 right-4 flex gap-1.5">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`${slide.label} 슬라이드 보기`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-2 bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
