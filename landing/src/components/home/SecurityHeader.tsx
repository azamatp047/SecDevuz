"use client";

import { Locale } from "@/lib/i18n/config";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface Shape {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  type: "circle" | "rect" | "dot" | "line";
  rotation: number;
  rotationSpeed: number;
}

interface DictType {
  nav: {
    home: string;
    about: string;
    services: string;
    blog: string;
    vacancies: string;
    contact: string;
    logout: string;
  };
  hero: {
    title: string;
    subtitle: string;
    aboutCompany: string;
    ourServices: string;
  };
}

interface SecurityHeaderProps {
  dict: DictType;
  locale: Locale;
}

export default function SecurityHeader({ dict, locale }: SecurityHeaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize shapes
    const initShapes = () => {
      const shapes: Shape[] = [];
      const shapeCount = 77;

      for (let i = 0; i < shapeCount; i++) {
        shapes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 40 + 20,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          type: ["circle", "rect", "dot", "line"][
            Math.floor(Math.random() * 4)
          ] as Shape["type"],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
        });
      }

      shapesRef.current = shapes;
    };

    initShapes();

    // Check if dark mode is active
    const isDark = () => {
      return document.documentElement.classList.contains("dark");
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const darkMode = isDark();
      const shapeColor = darkMode
        ? "rgba(255, 255, 255, 0.15)"
        : "rgba(0, 98, 255, 0.12)";

      shapesRef.current.forEach((shape) => {
        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);

        ctx.fillStyle = shapeColor;
        ctx.strokeStyle = shapeColor;
        ctx.lineWidth = 2;

        switch (shape.type) {
          case "circle":
            ctx.beginPath();
            ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "rect":
            ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
            break;
          case "dot":
            ctx.beginPath();
            ctx.arc(0, 0, shape.size / 4, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "line":
            ctx.beginPath();
            ctx.moveTo(-shape.size, 0);
            ctx.lineTo(shape.size, 0);
            ctx.stroke();
            break;
        }

        ctx.restore();

        // Update position
        shape.x += shape.speedX;
        shape.y += shape.speedY;
        shape.rotation += shape.rotationSpeed;

        // Wrap around edges
        if (shape.x < -shape.size) shape.x = canvas.width + shape.size;
        if (shape.x > canvas.width + shape.size) shape.x = -shape.size;
        if (shape.y < -shape.size) shape.y = canvas.height + shape.size;
        if (shape.y > canvas.height + shape.size) shape.y = -shape.size;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleAbout = () => {
    router.push(`/${locale}/about`);
  };

  const handleServices = () => {
    router.push(`/${locale}/services`);
  };

  return (
    <header className="relative w-full max-h-screen  h-[67vh] md:h-[76vh] lg:h-screen overflow-hidden bg-white dark:bg-[#001236]">
      {/* Animated Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 py-20">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold text-center mb-2 md:mb-6 text-gray-900 dark:text-white">
          {dict.hero.title}
        </h1>

        {/* Slogan */}
        <p className="text-xl md:text-2xl lg:text-3xl text-center mb-10 md:mb-12 text-gray-700 dark:text-gray-300 max-w-3xl">
          {dict.hero.subtitle}
        </p>

        {/* Buttons Container */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center">
          {/* About Company Button */}
          <button onClick={handleAbout} className="group cursor-pointer relative px-4 py-2 md:px-8 md:py-4 text-white font-semibold text-lg rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 transition-all duration-300 group-hover:scale-110"></div>
            
            {/* Animated Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
            
            <span className="relative z-10">{dict.hero.aboutCompany}</span>
          </button>

          {/* Services Button */}
          <button onClick={handleServices} className="group cursor-pointer relative px-4 py-2 md:px-8 md:py-4 text-white font-semibold text-lg rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-500 transition-all duration-300 group-hover:scale-110"></div>
            
            {/* Animated Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-500 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
            
            <span className="relative z-10">{dict.hero.ourServices}</span>
          </button>
        </div>
      </div>

      {/* Bottom Fade Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 dark:h-20 bg-gradient-to-t from-white dark:from-indigo-950 to-transparent pointer-events-none"></div>
    </header>
  );
}