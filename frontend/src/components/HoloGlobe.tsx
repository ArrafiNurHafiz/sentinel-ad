"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface KodamNode {
  name: string;
  region: string;
  lat: number;
  lng: number;
}

const KODAM_NODES: KodamNode[] = [
  { name: "KODAM JAYA", region: "Jakarta", lat: -6.2, lng: 106.8 },
  { name: "KODAM I / BB", region: "Medan", lat: 3.59, lng: 98.67 },
  { name: "KODAM II / SWJ", region: "Palembang", lat: -2.99, lng: 104.75 },
  { name: "KODAM III / SLW", region: "Bandung", lat: -6.91, lng: 107.6 },
  { name: "KODAM IV / DIP", region: "Semarang", lat: -6.96, lng: 110.4 },
  { name: "KODAM V / BRW", region: "Surabaya", lat: -7.25, lng: 112.75 },
  { name: "KODAM VI / MLW", region: "Balikpapan", lat: -1.26, lng: 116.83 },
  { name: "KODAM IX / UDY", region: "Denpasar", lat: -8.65, lng: 115.21 },
  { name: "KODAM XIV / HSN", region: "Makassar", lat: -5.14, lng: 119.43 },
  { name: "KODAM XVII / CEN", region: "Jayapura", lat: -2.53, lng: 140.71 },
];

interface HoloGlobeProps {
  targetRegion?: string;
  hasActiveAlert?: boolean;
}

export function HoloGlobe({ targetRegion = "KODAM_JAYA", hasActiveAlert = false }: HoloGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<string>("PUSSIBERAD HQ (JAKARTA)");

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 210;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Base Globe Sphere (Tactical Dark Wireframe)
    const globeRadius = 75;
    const sphereGeometry = new THREE.SphereGeometry(globeRadius, 36, 36);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const globeMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(globeMesh);

    // 3. Atmosphere Glow Ring
    const atmosphereGeo = new THREE.RingGeometry(globeRadius * 0.98, globeRadius * 1.04, 64);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(ringMesh);

    // Helper: Lat/Lng to 3D Cartesian coordinates
    const latLngToVector3 = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // 4. Plot Kodam Command Nodes
    const nodesGroup = new THREE.Group();
    KODAM_NODES.forEach((node) => {
      const pos = latLngToVector3(node.lat, node.lng, globeRadius + 1.2);
      const isTarget = node.name.replace(/\s+/g, "_") === targetRegion.replace(/\s+/g, "_");

      const nodeGeo = new THREE.SphereGeometry(isTarget && hasActiveAlert ? 2.5 : 1.4, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: isTarget && hasActiveAlert ? 0xef4444 : 0x10b981,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      nodesGroup.add(nodeMesh);

      // Add Beacon Ring on target node
      if (isTarget && hasActiveAlert) {
        const beaconGeo = new THREE.RingGeometry(2.8, 4.2, 32);
        const beaconMat = new THREE.MeshBasicMaterial({
          color: 0xef4444,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide,
        });
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        beacon.position.copy(pos);
        beacon.lookAt(pos.clone().multiplyScalar(2));
        nodesGroup.add(beacon);
      }
    });
    scene.add(nodesGroup);

    // 5. Threat Arc Animation (HQ Jakarta to Target Kodam)
    let arcCurveMesh: THREE.Line | null = null;
    if (hasActiveAlert) {
      const hqPos = latLngToVector3(-6.2, 106.8, globeRadius + 1.2);
      const targetData = KODAM_NODES.find(
        (k) => k.name.replace(/\s+/g, "_") === targetRegion.replace(/\s+/g, "_")
      ) || KODAM_NODES[0];
      const targetPos = latLngToVector3(targetData.lat, targetData.lng, globeRadius + 1.2);

      // Compute mid-arc elevated point
      const midPoint = new THREE.Vector3()
        .addVectors(hqPos, targetPos)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(globeRadius * 1.35);

      const curve = new THREE.QuadraticBezierCurve3(hqPos, midPoint, targetPos);
      const points = curve.getPoints(50);
      const arcGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const arcMaterial = new THREE.LineBasicMaterial({
        color: 0xef4444,
        linewidth: 3,
        transparent: true,
        opacity: 0.85,
      });
      arcCurveMesh = new THREE.Line(arcGeometry, arcMaterial);
      scene.add(arcCurveMesh);
    }

    // Orient initial view towards Indonesia (longitude ~118° E)
    globeMesh.rotation.y = -1.8;
    nodesGroup.rotation.y = -1.8;
    if (arcCurveMesh) arcCurveMesh.rotation.y = -1.8;

    // 6. Animation Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Gentle auto-rotation
      globeMesh.rotation.y += delta * 0.08;
      nodesGroup.rotation.y += delta * 0.08;
      if (arcCurveMesh) arcCurveMesh.rotation.y += delta * 0.08;

      ringMesh.rotation.z += delta * 0.15;
      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize handling
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight || 420;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [targetRegion, hasActiveAlert]);

  return (
    <div className="relative w-full h-[400px] lg:h-[480px] bg-slate-950/80 rounded-xl tactical-border overflow-hidden flex items-center justify-center">
      {/* Tactical Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Tactical HUD Overlays */}
      <div className="absolute top-3 left-4 pointer-events-none font-mono">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>GEOSPATIAL SITUATIONAL RADAR (COP)</span>
        </div>
        <p className="text-[11px] text-slate-500">
          PUSSIBERAD GRID // 0° 47&apos; S, 118° 55&apos; E
        </p>
      </div>

      {/* Active Threat Alert Tag */}
      {hasActiveAlert && (
        <div className="absolute top-3 right-4 font-mono text-xs px-3 py-1.5 rounded bg-red-950/80 border border-red-500/60 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>ACTIVE C2 ALERT: {targetRegion}</span>
        </div>
      )}

      {/* Bottom Command Node Info */}
      <div className="absolute bottom-3 inset-x-4 flex justify-between items-center text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 bg-slate-950/60 backdrop-blur-sm px-2">
        <div>
          <span className="text-slate-500">MONITORED REGION:</span>{" "}
          <span className="text-emerald-400 font-bold">{targetRegion}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 10 KODAM NODES
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> 1 THREAT VECTOR
          </span>
        </div>
      </div>
    </div>
  );
}
