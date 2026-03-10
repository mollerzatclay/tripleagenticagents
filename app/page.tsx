'use client';

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from './styles/home.module.css';
import { instrumentSans } from './fonts';

type ToolMode = "brush" | "eraser";

function DrawingPad() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [brushColor, setBrushColor] = useState<string>("#111111");
  const [brushSize, setBrushSize] = useState<number>(6);
  const [mode, setMode] = useState<ToolMode>("brush");

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      const width = rect.width;
      const height = 260;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const getCanvasCoordinates = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(event);
    isDrawingRef.current = true;
    lastPointRef.current = { x, y };

    ctx.beginPath();
    ctx.moveTo(x, y);

    canvas.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(event);

    if (mode === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = brushColor;
    }

    ctx.lineWidth = brushSize;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastPointRef.current = { x, y };
  };

  const stopDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {
        // ignore if not captured
      }
    }
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = rect.width * ratio;
    canvas.height = 260 * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, 260);
  };

  const colors = ["#111111", "#ff4081", "#00e5ff", "#ffeb3b", "#9c27b0"];

  return (
    <section className={styles.drawingSection}>
      <div className={styles.drawingHeader}>
        <h2 className={styles.drawingTitle}>Doodle corner</h2>
        <p className={styles.drawingSubtitle}>
          Try out ideas with a few pixel-perfect brushes. It&apos;s okay to scribble.
        </p>
      </div>

      <div className={styles.drawingToolbar}>
        <div className={styles.toolGroup}>
          <button
            type="button"
            className={`${styles.toolButton} ${mode === "brush" ? styles.toolButtonActive : ""}`}
            onClick={() => setMode("brush")}
          >
            Brush
          </button>
          <button
            type="button"
            className={`${styles.toolButton} ${mode === "eraser" ? styles.toolButtonActive : ""}`}
            onClick={() => setMode("eraser")}
          >
            Eraser
          </button>
        </div>

        <div className={styles.toolGroup}>
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              className={`${styles.colorSwatch} ${
                brushColor === color && mode === "brush" ? styles.colorSwatchActive : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => {
                setBrushColor(color);
                setMode("brush");
              }}
              aria-label={`Brush color ${color}`}
            />
          ))}
        </div>

        <div className={styles.toolGroup}>
          <label className={styles.sliderLabel}>
            Size
            <input
              type="range"
              min={2}
              max={18}
              value={brushSize}
              onChange={(event) => setBrushSize(Number(event.target.value))}
            />
          </label>
        </div>

        <button type="button" className={styles.clearButton} onClick={handleClear}>
          Clear canvas
        </button>
      </div>

      <div ref={containerRef} className={styles.canvasFrame}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
        />
      </div>
    </section>
  );
}

export default function Home() {
  // Add your prototypes to this array
  const prototypes = [
    {
      title: 'Getting started',
      description: 'How to create a prototype',
      path: '/prototypes/example'
    },
    {
      title: 'Confetti button',
      description: 'An interactive button that creates a colorful confetti explosion',
      path: '/prototypes/confetti-button'
    },
    {
      title: 'Show tickets',
      description: 'Buy tickets to a show: browse events, pick quantity, and complete a mock checkout',
      path: '/prototypes/show-tickets'
    },
    // Add your new prototypes here like this:
    // {
    //   title: 'Your new prototype',
    //   description: 'A short description of what this prototype does',
    //   path: '/prototypes/my-new-prototype'
    // },
  ];

  return (
    <div className={`${styles.container} ${instrumentSans.className}`}>
      <header className={styles.header}>
        <div className={styles.topBar}>
          <span className={styles.topBarTitle}>MOLLY&#39;S NEON LAB // v0.1</span>
          <span className={styles.topBarStatus}>STATUS: ONLINE</span>
        </div>

        <h1 className={styles.title}>Molly&#39;s prototypes</h1>
        <p className={styles.tagline}>
          Hand-coded experiments beamed in from the edge of cyberspace.
        </p>

        <div className={styles.marqueeWrapper} aria-live="polite">
          <div className={styles.marquee}>
            <span className={styles.marqueeContent}>
              ✨ WELCOME TO MOLLY&#39;S CORNER OF THE NET. BEST EXPERIENCED ON A CRT MONITOR. PLEASE SIGN THE GUESTBOOK IN YOUR HEART. ✨
            </span>
            <span className={styles.marqueeContent} aria-hidden="true">
              ✨ WELCOME TO MOLLY&#39;S CORNER OF THE NET. BEST EXPERIENCED ON A CRT MONITOR. PLEASE SIGN THE GUESTBOOK IN YOUR HEART. ✨
            </span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarPanel}>
              <h2 className={styles.sidebarHeading}>Studio palette</h2>
              <ul className={styles.navList}>
                <li>&gt; <span>Neon confetti</span></li>
                <li>&gt; <span>Checkerboard buttons</span></li>
                <li>&gt; <span>Zigzag hover states</span></li>
              </ul>
            </div>

            <div className={styles.sidebarPanel}>
              <h2 className={styles.sidebarHeading}>Sticker wall</h2>
              <p className={styles.sidebarText}>
                Drag these ideas all over your canvas: weird shapes, bold borders, and colors that shouldn&#39;t work
                together (but somehow do).
              </p>
              <img
                src="/playground/blob-hearts.gif"
                alt="Glowing pixel heart blob"
                className={styles.sidebarGif}
              />
            </div>

            <div className={styles.sidebarPanel}>
              <h2 className={styles.sidebarHeading}>Today&#39;s vibe check</h2>
              <ul className={styles.statsList}>
                <li>🎨 Color clash: HIGH</li>
                <li>⬛ Checkerboard density: MED</li>
                <li>〰 Squiggle frequency: OFF THE CHARTS</li>
              </ul>
            </div>
          </aside>

          <section className={styles.gridSection}>
            <h2 className={styles.sectionTitle}>Prototype playground</h2>
            <p className={styles.sectionSubtitle}>
              Each tile is a little interface toy. They don&#39;t have to match, they just have to make you smile.
            </p>

            <DrawingPad />

            <section className={styles.grid}>
              {/* Goes through the prototypes list (array) to create cards */}
              {prototypes.map((prototype, index) => (
                <Link 
                  key={index}
                  href={prototype.path} 
                  className={styles.card}
                >
                  <div className={styles.cardHeader}>
                    <span className={styles.cardBadge}>Tile {index + 1}</span>
                    <h3 className={styles.cardTitle}>{prototype.title}</h3>
                  </div>
                  <p className={styles.cardDescription}>{prototype.description}</p>
                  <span className={styles.cardLinkHint}>[ enter simulation &gt;&gt; ]</span>
                </Link>
              ))}
            </section>
          </section>
        </div>
      </main>
    </div>
  );
}
