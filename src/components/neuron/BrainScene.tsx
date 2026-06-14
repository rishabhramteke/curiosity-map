import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { REGIONS, REGION_BY_ID, type RegionId, type Side } from '../../data/brain';
import {
  buildCloud,
  buildHubs,
  buildTracts,
  tractsToSegments,
  type HubNode,
  type Tract,
} from '../../utils/connectome';

const IDLE_COLOR = '#33406b';

// soft round glow sprite, drawn once
function makeGlowTexture(): THREE.Texture {
  const s = 64;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.3, 'rgba(255,255,255,0.65)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

interface Props {
  levelOf: Record<RegionId, number>;
  colorOf: Record<RegionId, string>;
  onHoverRegion: (id: RegionId | null) => void;
}

export default function BrainScene({ levelOf, colorOf, onHoverRegion }: Props) {
  const cloud = useMemo(() => buildCloud(), []);
  const hubs = useMemo(() => buildHubs(), []);
  const tracts = useMemo(() => buildTracts(hubs), [hubs]);
  const idleSegments = useMemo(() => tractsToSegments(tracts), [tracts]);
  const glow = useMemo(makeGlowTexture, []);

  // one representative hub per region for labels (prefer right, then centre, then left)
  const labelHubs = useMemo(() => {
    const rank = (s: Side) => (s === 'R' ? 0 : s === 'C' ? 1 : 2);
    const byRegion = new Map<RegionId, HubNode>();
    for (const h of hubs) {
      const cur = byRegion.get(h.regionId);
      if (!cur || rank(h.side) < rank(cur.side)) byRegion.set(h.regionId, h);
    }
    return [...byRegion.values()];
  }, [hubs]);

  const activeKey = useMemo(
    () => REGIONS.map((r) => `${(levelOf[r.id] ?? 0).toFixed(2)}:${colorOf[r.id]}`).join(','),
    [levelOf, colorOf]
  );

  // Lit tracts (per-vertex coloured) plus the subset that carries travelling pulses.
  const { litPositions, litColors, pulseTracts } = useMemo(() => {
    const pos: number[] = [];
    const col: number[] = [];
    const pulse: Tract[] = [];
    const tmp = new THREE.Color();
    for (const t of tracts) {
      const la = levelOf[t.a] ?? 0;
      const lb = levelOf[t.b] ?? 0;
      const lvl = Math.max(la, lb);
      if (lvl < 0.5) continue;
      const hex = la >= lb ? colorOf[t.a] : colorOf[t.b];
      tmp.set(hex);
      const k = Math.min(1.2, lvl * 1.15);
      const pts = t.samples;
      const segs = pts.length / 3 - 1;
      for (let i = 0; i < segs; i++) {
        for (const idx of [i, i + 1]) {
          pos.push(pts[idx * 3], pts[idx * 3 + 1], pts[idx * 3 + 2]);
          col.push(tmp.r * k, tmp.g * k, tmp.b * k);
        }
      }
      if (lvl >= 0.9) pulse.push(t);
    }
    return {
      litPositions: new Float32Array(pos),
      litColors: new Float32Array(col),
      pulseTracts: pulse.slice(0, 200),
    };
  }, [tracts, levelOf, colorOf, activeKey]);

  // Travelling "signal" pulses along the active tracts.
  const pulseRef = useRef<THREE.BufferAttribute>(null);
  const pulsePositions = useMemo(() => new Float32Array(Math.max(1, pulseTracts.length) * 3), [pulseTracts]);
  const phases = useMemo(() => pulseTracts.map((_, i) => (i * 0.1873) % 1), [pulseTracts]);

  useFrame(({ clock }) => {
    const attr = pulseRef.current;
    if (!attr || pulseTracts.length === 0) return;
    const time = clock.getElapsedTime();
    const arr = pulsePositions;
    for (let i = 0; i < pulseTracts.length; i++) {
      const pts = pulseTracts[i].samples;
      const n = pts.length / 3;
      const t = (time * 0.42 + phases[i]) % 1;
      const f = t * (n - 1);
      const i0 = Math.floor(f);
      const i1 = Math.min(n - 1, i0 + 1);
      const m = f - i0;
      arr[i * 3] = pts[i0 * 3] + (pts[i1 * 3] - pts[i0 * 3]) * m;
      arr[i * 3 + 1] = pts[i0 * 3 + 1] + (pts[i1 * 3 + 1] - pts[i0 * 3 + 1]) * m;
      arr[i * 3 + 2] = pts[i0 * 3 + 2] + (pts[i1 * 3 + 2] - pts[i0 * 3 + 2]) * m;
    }
    attr.needsUpdate = true;
  });

  return (
    <group>
      <OrbitControls enablePan enableDamping dampingFactor={0.08} autoRotate autoRotateSpeed={0.45} minDistance={2.2} maxDistance={9} />
      <ambientLight intensity={0.6} />

      {/* neuron dust — gives the brain its shape */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[cloud, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.022}
          sizeAttenuation
          map={glow}
          color="#8aa0e0"
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* idle white-matter tracts */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[idleSegments, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#2a3566" transparent opacity={0.32} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>

      {/* lit tracts (coloured per active region) */}
      {litPositions.length > 0 && (
        <lineSegments key={activeKey}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[litPositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[litColors, 3]} />
          </bufferGeometry>
          <lineBasicMaterial vertexColors transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
        </lineSegments>
      )}

      {/* travelling signal pulses */}
      {pulseTracts.length > 0 && (
        <points key={`pulse-${activeKey}`}>
          <bufferGeometry>
            <bufferAttribute ref={pulseRef} attach="attributes-position" args={[pulsePositions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.075}
            sizeAttenuation
            map={glow}
            color="#ffffff"
            transparent
            opacity={0.95}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* region hubs */}
      {hubs.map((h) => {
        const lvl = levelOf[h.regionId] ?? 0;
        const hex = lvl > 0.05 ? colorOf[h.regionId] : IDLE_COLOR;
        const base = new THREE.Color(hex);
        const meshCol = base.clone().multiplyScalar(0.3 + lvl * 0.9);
        const radius = 0.05 + lvl * 0.05;
        const haloScale = 0.18 + lvl * 0.7;
        return (
          <group
            key={h.key}
            position={h.pos}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHoverRegion(h.regionId);
            }}
            onPointerOut={() => onHoverRegion(null)}
          >
            <mesh>
              <sphereGeometry args={[radius, 16, 16]} />
              <meshBasicMaterial color={meshCol} toneMapped={false} />
            </mesh>
            <sprite scale={[haloScale, haloScale, haloScale]}>
              <spriteMaterial
                map={glow}
                color={hex}
                transparent
                opacity={0.25 + lvl * 0.6}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </sprite>
          </group>
        );
      })}

      {/* labels: major parts always (dim), every region when it's firing */}
      {labelHubs.map((h) => {
        const region = REGION_BY_ID[h.regionId];
        const lvl = levelOf[h.regionId] ?? 0;
        const active = lvl >= 0.9;
        if (!region.major && !active) return null;
        return (
          <Html
            key={`lbl-${h.regionId}`}
            position={[h.pos[0], h.pos[1] + 0.2, h.pos[2]]}
            center
            distanceFactor={7}
            zIndexRange={[10, 0]}
          >
            <div
              style={{
                whiteSpace: 'nowrap',
                fontSize: active ? 12 : 11,
                fontWeight: 600,
                color: active ? colorOf[h.regionId] : '#8a99bd',
                opacity: active ? 1 : 0.55,
                textShadow: '0 1px 6px rgba(0,0,0,0.95)',
                pointerEvents: 'none',
                transition: 'opacity .2s, color .2s',
              }}
            >
              {region.name}
            </div>
          </Html>
        );
      })}
    </group>
  );
}
