"use client";

import { useEffect, useRef, useState } from "react";

export const AnimateOnScroll = ({
  children,
  threshold = 0.1,
  animation = "fade-up",
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
      }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  const getAnimationClass = () => {
    switch (animation) {
      case "fade-up":
        return isVisible
          ? "opacity-100 translate-y-0 transition-all duration-1000"
          : "opacity-0 translate-y-10 transition-all duration-1000";
      case "fade-in":
        return isVisible
          ? "opacity-100 transition-opacity duration-1000"
          : "opacity-0 transition-opacity duration-1000";
      case "slide-right":
        return isVisible
          ? "opacity-100 translate-x-0 transition-all duration-1000"
          : "opacity-0 -translate-x-10 transition-all duration-1000";
      case "slide-left":
        return isVisible
          ? "opacity-100 translate-x-0 transition-all duration-1000"
          : "opacity-0 translate-x-10 transition-all duration-1000";
      default:
        return isVisible
          ? "opacity-100 translate-y-0 transition-all duration-1000"
          : "opacity-0 translate-y-10 transition-all duration-1000";
    }
  };

  return (
    <div ref={ref} className={getAnimationClass()}>
      {children}
    </div>
  );
};
