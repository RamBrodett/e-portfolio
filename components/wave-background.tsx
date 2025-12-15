"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    // if (!isFinePointer) return; // Removed to allow rendering on all devices

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouse = { x: -1000, y: -1000 }; 
    let scrollY = 0;


    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };


    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };


    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      density: number;
      opacity: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
    
        this.size = Math.random() < 0.8
          ? Math.random() * 2 + 2 
          : Math.random() * 4 + 3;
        this.density = (Math.random() * 80) + 1;
        this.opacity = 0;
      }

      update(time: number) {
        if (isFinePointer) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          
          const forceRadius = 100; 
          const visibilityRadius = 500; 

        
          if (distance < forceRadius) {
            const force = (forceRadius - distance) / forceRadius;
            const directionX = forceDirectionX * force * this.density;
            const directionY = forceDirectionY * force * this.density;
            this.x -= directionX;
            this.y -= directionY;
          } else {
            if (this.x !== this.baseX) {
              const dx = this.x - this.baseX;
              this.x -= dx / 50;
            }
            if (this.y !== this.baseY) {
              const dy = this.y - this.baseY;
              this.y -= dy / 50;
            }
          }

          if (distance < visibilityRadius) {
              this.opacity = 1 - (distance / visibilityRadius);
          } else {
              this.opacity = 0;
          }
        } else {
          // Non-fine pointer behavior: static and lower opacity
          this.x = this.baseX;
          this.y = this.baseY;
          this.opacity = 0.3; 
        }
      }

      draw(ctx: CanvasRenderingContext2D, color: string) {
        if (this.opacity <= 0) return;
        ctx.fillStyle = color.replace("opacity", this.opacity.toString());
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size); 
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = (width * height) / 4000; 
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        particles.push(new Particle(x, y));
      }
    };

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);
       
      const color = "rgba(249, 115, 22, opacity)";

      particles.forEach((p) => {
        p.update(time);
        p.draw(ctx, color);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    resize();
    render(0);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: 1 }} 
    />
  );
}
