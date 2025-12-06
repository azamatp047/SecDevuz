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

  return (
  <header className="relative w-full h-[76vh] overflow-hidden bg-white dark:bg-[#001236]">
    {/* Animated Background Canvas */}
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />

    {/* Content Container */}
    <div className="
      relative z-10 flex flex-col items-center justify-center 
      h-full px-4 text-center
    ">
      {/* Main Heading */}
      <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-4">
        {dict.hero.title}
      </h1>

      {/* Slogan */}
      <p className="text-lg md:text-2xl lg:text-3xl text-gray-700 dark:text-gray-300 max-w-2xl">
        {dict.hero.subtitle}
      </p>
    </div>

    {/* Bottom Fade Effect */}
    <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white dark:from-indigo-950 to-transparent pointer-events-none"></div>
  </header>
);

}
