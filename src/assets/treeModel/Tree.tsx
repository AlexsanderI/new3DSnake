import React, { useMemo } from 'react'
import * as THREE from 'three'

type TreeProps = {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  color?: number
  seed?: number
  variant?: 'pine' | 'deciduous' | 'bush' | 'auto'
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function getTreeColor(rnd: () => number, baseColor?: number): number {
  if (baseColor !== undefined) return baseColor

  const palettes = [
    [0x7cb518, 0x8bc34a, 0x6ea117, 0x9dc527],
    [0x2d6a2d, 0x3a7d3a, 0x4e9e4e, 0x336633],
    [0xe8a000, 0xcc5500, 0xd46a1f, 0xb85c38],
    [0x6b7c3a, 0x788a3d, 0x5c6e2a, 0x849040],
  ]

  const palette = palettes[Math.floor(rnd() * palettes.length)]
  return palette[Math.floor(rnd() * palette.length)]
}

function createTrunk(seed: number) {
  const rnd = mulberry32(seed + 100)

  const height = 0.18 + rnd() * 0.08
  const radiusBottom = 0.045 + rnd() * 0.01
  const radiusTop = radiusBottom * 0.7

  // Cylinder is Y-up by default, rotate once to Z-up and stop there.
  const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 6, 1)
  geo.rotateX(Math.PI / 2)

  // Move so trunk base sits exactly on ground plane z=0.
  geo.translate(0, 0, height / 2)

  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x5c3d1e),
    flatShading: true,
    roughness: 0.95,
  })

  return { geo, mat, height, radiusTop, radiusBottom }
}

function createPineLayers(seed: number, trunkHeight: number, color?: number) {
  const rnd = mulberry32(seed + 200)
  const baseColor = getTreeColor(mulberry32(seed + 300), color)

  const base = new THREE.Color(baseColor)
  const hsl = { h: 0, s: 0, l: 0 }
  base.getHSL(hsl)

  const count = 6
  const layers: {
    geo: THREE.BufferGeometry
    mat: THREE.MeshStandardMaterial
    z: number
  }[] = []

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1)

    const radius = 0.32 - t * 0.22 + rnd() * 0.008
    const height = 0.1 + (1 - t) * 0.04

    const geo = new THREE.ConeGeometry(radius, height, 8, 1)
    geo.rotateX(Math.PI / 2)

    // Put cone base at local origin so position.z is easy to reason about.
    geo.translate(0, 0, height / 2)

    // Minimal randomness only around vertical axis.
    geo.rotateZ((i % 2) * (Math.PI / 8) + rnd() * 0.15)

    const lightness = hsl.l + t * 0.06
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(hsl.h, hsl.s, lightness),
      flatShading: true,
      roughness: 0.85,
      emissive: new THREE.Color().setHSL(hsl.h, hsl.s * 0.3, 0.015),
      emissiveIntensity: 0.1,
    })

    // Start just below trunk top so the crown visually connects.
    const step = 0.13 - t * 0.03
    const z = trunkHeight - 0.04 + i * step

    layers.push({ geo, mat, z })
  }

  return layers
}

function createDeciduousLayers(seed: number, trunkHeight: number, color?: number) {
  const rnd = mulberry32(seed + 200)
  const treeColor = getTreeColor(mulberry32(seed + 300), color)

  const base = new THREE.Color(treeColor)
  const hsl = { h: 0, s: 0, l: 0 }
  base.getHSL(hsl)

  const count = 2
  const layers: {
    geo: THREE.BufferGeometry
    mat: THREE.MeshStandardMaterial
    z: number
  }[] = []

  for (let i = 0; i < count; i++) {
    const radius = 0.22 + rnd() * 0.05 - i * 0.015
    const useOcta = rnd() > 0.55

    const geo = useOcta
      ? new THREE.OctahedronGeometry(radius, 0)
      : new THREE.IcosahedronGeometry(radius, 0)

    // Soft shaping only, no aggressive tilt.
    geo.scale(1.0 + rnd() * 0.12, 1.0 + rnd() * 0.12, 0.95 + rnd() * 0.18)
    geo.rotateZ(rnd() * Math.PI * 2)

    const lightness = Math.min(
      0.8,
      Math.max(0.12, hsl.l + (rnd() - 0.5) * 0.04 + i * 0.02),
    )
    const layerColor = new THREE.Color().setHSL(
      hsl.h + (rnd() - 0.5) * 0.02,
      hsl.s,
      lightness,
    )

    const mat = new THREE.MeshStandardMaterial({
      color: layerColor,
      flatShading: true,
      roughness: 0.87,
      emissive: new THREE.Color().setHSL(hsl.h, hsl.s * 0.35, 0.02),
      emissiveIntensity: 0.14,
    })

    // Bottom blob overlaps slightly with top of trunk.
    const z = trunkHeight - 0.02 + i * 0.14

    layers.push({ geo, mat, z })
  }

  return layers
}

function createBushLayers(seed: number, trunkHeight: number, color?: number) {
  const rnd = mulberry32(seed + 200)
  const treeColor = getTreeColor(mulberry32(seed + 300), color)

  const base = new THREE.Color(treeColor)
  const hsl = { h: 0, s: 0, l: 0 }
  base.getHSL(hsl)

  const radius = 0.18 + rnd() * 0.05
  const useOcta = rnd() > 0.5

  const geo = useOcta
    ? new THREE.OctahedronGeometry(radius, 0)
    : new THREE.IcosahedronGeometry(radius, 0)

  geo.scale(1.08 + rnd() * 0.18, 1.08 + rnd() * 0.18, 0.78 + rnd() * 0.12)
  geo.rotateZ(rnd() * Math.PI * 2)

  const layerColor = new THREE.Color().setHSL(
    hsl.h + (rnd() - 0.5) * 0.02,
    hsl.s,
    Math.min(0.78, Math.max(0.12, hsl.l + (rnd() - 0.5) * 0.04)),
  )

  const mat = new THREE.MeshStandardMaterial({
    color: layerColor,
    flatShading: true,
    roughness: 0.88,
    emissive: new THREE.Color().setHSL(hsl.h, hsl.s * 0.35, 0.02),
    emissiveIntensity: 0.14,
  })

  return [{ geo, mat, z: trunkHeight - 0.01 }]
}

function Tree({
  position,
  rotation,
  scale,
  color,
  seed = 1,
  variant = 'auto',
}: TreeProps) {
  const resolvedVariant = useMemo(() => {
    if (variant !== 'auto') return variant
    const r = mulberry32(seed + 777)()
    if (r < 0.38) return 'pine'
    if (r < 0.76) return 'deciduous'
    return 'bush'
  }, [variant, seed])

  const trunk = useMemo(() => createTrunk(seed), [seed])

  const crownLayers = useMemo(() => {
    if (resolvedVariant === 'pine') return createPineLayers(seed, trunk.height, color)
    if (resolvedVariant === 'deciduous')
      return createDeciduousLayers(seed, trunk.height, color)
    return createBushLayers(seed, trunk.height, color)
  }, [seed, trunk.height, resolvedVariant, color])

  const finalTransform = useMemo(() => {
    const rnd = mulberry32(seed + 1000)

    // Much calmer global size range.
    const uniform = 0.95 + rnd() * 0.22

    const s: [number, number, number] = [
      uniform * (0.98 + rnd() * 0.04),
      uniform * (0.98 + rnd() * 0.04),
      uniform * (0.98 + rnd() * 0.05),
    ]

    // Lean only at the whole-tree level.
    const r: [number, number, number] = [
      (rnd() - 0.5) * 0.04,
      (rnd() - 0.5) * 0.04,
      rnd() * Math.PI * 2,
    ]

    return { s, r }
  }, [seed])

  return (
    <group
      position={position ?? [0, 0, 0]}
      rotation={rotation ?? finalTransform.r}
      scale={scale ?? finalTransform.s}
    >
      <mesh geometry={trunk.geo} material={trunk.mat} castShadow receiveShadow />

      {crownLayers.map((layer, i) => (
        <mesh
          key={i}
          geometry={layer.geo}
          material={layer.mat}
          castShadow
          receiveShadow
          position={[0, 0, layer.z]}
        />
      ))}
    </group>
  )
}

export default Tree
