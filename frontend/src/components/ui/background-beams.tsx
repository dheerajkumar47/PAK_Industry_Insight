"use client";
import { cn } from "../../lib/utils";
import React, { useEffect, useRef } from "react";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const beamsRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = beamsRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let beams: Beam[] = [];

    class Beam {
      x: number;
      y: number;
      speed: number;
      opacity: number;
      width: number;
      color: string;

      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.speed = Math.random() * 0.5 + 0.2;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.width = Math.random() * 2 + 1;
        this.color = `hsla(${Math.random() * 60 + 200}, 100%, 70%, ${this.opacity})`;
      }

      update() {
        this.y -= this.speed;
        if (this.y < -100) {
          this.y = h + 100;
          this.x = Math.random() * w;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y - 100); 
        ctx.stroke();
      }
    }

    const init = () => {
      beams = [];
      for (let i = 0; i < 50; i++) {
        beams.push(new Beam());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      beams.forEach((beam) => {
        beam.update();
        beam.draw();
      });
      requestAnimationFrame(animate);
    };

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener("resize", resize);
    init();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={beamsRef}
      className={cn(
        "fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen",
        className
      )}
    />
  );
};
