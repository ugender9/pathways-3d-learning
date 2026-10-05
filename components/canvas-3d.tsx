"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function Canvas3D() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 25

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Groups
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x6366f1, 3, 50)
    pointLight1.position.set(15, 15, 10)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xec4899, 2.5, 50)
    pointLight2.position.set(-15, -15, 10)
    scene.add(pointLight2)

    const pointLight3 = new THREE.PointLight(0x06b6d4, 2, 50)
    pointLight3.position.set(0, -10, 5)
    scene.add(pointLight3)

    // 1. Central Floating Torus Knot (Wireframe + Iridescent)
    const torusGeometry = new THREE.TorusKnotGeometry(4.5, 1.2, 120, 24)
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x312e81,
      emissiveIntensity: 0.3,
    })
    const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial)
    torusKnot.position.set(12, 2, -5)
    mainGroup.add(torusKnot)

    // 2. Floating Icosahedrons
    const icoGeometry = new THREE.IcosahedronGeometry(2.5, 0)
    const icoMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      roughness: 0.1,
      metalness: 0.8,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.4,
    })
    const ico1 = new THREE.Mesh(icoGeometry, icoMaterial)
    ico1.position.set(-14, 5, -8)
    mainGroup.add(ico1)

    // 3. Floating Octahedron on bottom
    const octGeometry = new THREE.OctahedronGeometry(2, 0)
    const octMaterial = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      wireframe: true,
      roughness: 0.3,
      metalness: 0.9,
      emissive: 0x831843,
      emissiveIntensity: 0.5,
    })
    const oct1 = new THREE.Mesh(octGeometry, octMaterial)
    oct1.position.set(-10, -8, -4)
    mainGroup.add(oct1)

    // 4. Floating Ring / Cyber Halo
    const ringGeometry = new THREE.RingGeometry(5, 5.2, 64)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.position.set(12, 2, -5)
    ring.rotation.x = Math.PI / 3
    mainGroup.add(ring)

    // 5. Particle Constellation Field
    const particlesCount = 350
    const positions = new Float32Array(particlesCount * 3)
    const colors = new Float32Array(particlesCount * 3)

    const colorChoices = [
      new THREE.Color(0x6366f1), // Indigo
      new THREE.Color(0x8b5cf6), // Violet
      new THREE.Color(0xec4899), // Pink
      new THREE.Color(0x38bdf8), // Cyan
    ]

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 60
      positions[i3 + 1] = (Math.random() - 0.5) * 45
      positions[i3 + 2] = (Math.random() - 0.5) * 35

      const c = colorChoices[Math.floor(Math.random() * colorChoices.length)]
      colors[i3] = c.r
      colors[i3 + 1] = c.g
      colors[i3 + 2] = c.b
    }

    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    mainGroup.add(particles)

    // Mouse Interaction
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const onMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2
      const windowHalfY = window.innerHeight / 2
      mouseX = (e.clientX - windowHalfX) / 100
      mouseY = (e.clientY - windowHalfY) / 100
    }

    window.addEventListener("mousemove", onMouseMove)

    // Resize Handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    window.addEventListener("resize", onResize)

    // Animation Loop
    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      // Smooth mouse tracking interpolation
      targetX += (mouseX - targetX) * 0.05
      targetY += (mouseY - targetY) * 0.05

      mainGroup.rotation.y = targetX * 0.4
      mainGroup.rotation.x = -targetY * 0.3

      // Rotate 3D objects with organic sine waves
      torusKnot.rotation.x = elapsedTime * 0.3
      torusKnot.rotation.y = elapsedTime * 0.4
      torusKnot.position.y = 2 + Math.sin(elapsedTime * 0.8) * 0.7

      ring.rotation.z = -elapsedTime * 0.2
      ring.position.y = 2 + Math.sin(elapsedTime * 0.8) * 0.7

      ico1.rotation.x = elapsedTime * 0.4
      ico1.rotation.z = elapsedTime * 0.2
      ico1.position.y = 5 + Math.cos(elapsedTime * 0.9) * 0.8

      oct1.rotation.y = -elapsedTime * 0.5
      oct1.rotation.z = elapsedTime * 0.3
      oct1.position.y = -8 + Math.sin(elapsedTime * 1.1) * 0.6

      // Slowly rotate particle field
      particles.rotation.y = elapsedTime * 0.03
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("resize", onResize)
      cancelAnimationFrame(animationFrameId)

      torusGeometry.dispose()
      torusMaterial.dispose()
      icoGeometry.dispose()
      icoMaterial.dispose()
      octGeometry.dispose()
      octMaterial.dispose()
      ringGeometry.dispose()
      ringMaterial.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-85 transition-opacity duration-1000"
      aria-hidden="true"
    />
  )
}
