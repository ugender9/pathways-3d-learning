"use client"

import React, { useRef, useState } from "react"

interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  maxTilt?: number
  glare?: boolean
  className?: string
  depth?: number
}

export function Card3D({
  children,
  maxTilt = 10,
  glare = true,
  className = "",
  depth = 25,
  ...props
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotX = ((y - centerY) / centerY) * -maxTilt
    const rotY = ((x - centerX) / centerX) * maxTilt

    setRotateX(rotX)
    setRotateY(rotY)

    if (glare) {
      const glareX = (x / rect.width) * 100
      const glareY = (y / rect.height) * 100
      setGlarePosition({ x: glareX, y: glareY, opacity: 0.2 })
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotateX(0)
    setRotateY(0)
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }))
  }

  return (
    <div
      style={{ perspective: 1200 }}
      className={`relative ${className}`}
      {...props}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${isHovered ? depth : 0}px)`,
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
          transformStyle: "preserve-3d",
        }}
        className="relative h-full w-full rounded-2xl will-change-transform"
      >
        {children}

        {/* 3D Dynamic Glare Specular Sheen */}
        {glare && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 overflow-hidden"
            style={{
              opacity: glarePosition.opacity,
              background: `radial-gradient(circle 350px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.35), transparent 80%)`,
              mixBlendMode: "overlay",
              transform: "translateZ(1px)",
            }}
          />
        )}
      </div>
    </div>
  )
}
