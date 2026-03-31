import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import type { CarScreenPosition } from '../types';

// ─── Car dimensions (Three.js units) ─────────────────────────────────────────
const CAR = {
  bodyW: 2.2,
  bodyH: 0.55,
  bodyD: 1.0,
  roofW: 1.3,
  roofH: 0.45,
  roofD: 0.85,
  hoodLength: 0.55,
  wheelR: 0.28,
  wheelT: 0.22,
  axleY: -0.28,
  frontAxleX: 0.72,
  rearAxleX: -0.72,
  wheelTrack: 0.58, // half-track (left/right offset)
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeWheel(
  wheelColor: number,
  hubColor: number
): THREE.Group {
  const group = new THREE.Group();

  // Tire
  const tireGeo = new THREE.CylinderGeometry(
    CAR.wheelR, CAR.wheelR, CAR.wheelT, 18
  );
  const tireMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
  const tire = new THREE.Mesh(tireGeo, tireMat);
  tire.rotation.z = Math.PI / 2;
  group.add(tire);

  // Rim
  const rimGeo = new THREE.CylinderGeometry(
    CAR.wheelR * 0.62,
    CAR.wheelR * 0.62,
    CAR.wheelT + 0.01,
    18
  );
  const rimMat = new THREE.MeshLambertMaterial({ color: hubColor });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.rotation.z = Math.PI / 2;
  group.add(rim);

  // Hub cap
  const hubGeo = new THREE.CylinderGeometry(
    CAR.wheelR * 0.28,
    CAR.wheelR * 0.28,
    CAR.wheelT + 0.02,
    12
  );
  const hubMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const hub = new THREE.Mesh(hubGeo, hubMat);
  hub.rotation.z = Math.PI / 2;
  group.add(hub);

  // Lug bolts (3 small spheres)
  const boltMat = new THREE.MeshLambertMaterial({ color: 0x94a3b8 });
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const boltGeo = new THREE.SphereGeometry(0.045, 6, 6);
    const bolt = new THREE.Mesh(boltGeo, boltMat);
    bolt.position.set(
      CAR.wheelT * 0.5 + 0.01,
      Math.sin(angle) * CAR.wheelR * 0.45,
      Math.cos(angle) * CAR.wheelR * 0.45
    );
    group.add(bolt);
  }

  return group;
}

function buildCar(bodyColor: number, roofColor: number, wheelColor: number): THREE.Group {
  const car = new THREE.Group();

  const bodyMat  = new THREE.MeshLambertMaterial({ color: bodyColor });
  const roofMat  = new THREE.MeshLambertMaterial({ color: roofColor });
  const glassMat = new THREE.MeshLambertMaterial({
    color: 0x93c5fd,
    transparent: true,
    opacity: 0.75,
  });
  const lightMat  = new THREE.MeshLambertMaterial({ color: 0xfef08a });
  const taillightMat = new THREE.MeshLambertMaterial({ color: 0xef4444 });
  const bumperMat = new THREE.MeshLambertMaterial({ color: 0xdbeafe });

  // ── Main body ──────────────────────────────────────────────────────────────
  const bodyGeo = new THREE.BoxGeometry(CAR.bodyW, CAR.bodyH, CAR.bodyD);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.08;
  car.add(body);

  // ── Hood (lower front extension) ───────────────────────────────────────────
  const hoodGeo = new THREE.BoxGeometry(CAR.hoodLength, CAR.bodyH * 0.7, CAR.bodyD * 0.9);
  const hood = new THREE.Mesh(hoodGeo, bodyMat);
  hood.position.set(
    CAR.bodyW * 0.5 + CAR.hoodLength * 0.5 - 0.02,
    0.04,
    0
  );
  car.add(hood);

  // ── Cabin / roof ────────────────────────────────────────────────────────────
  const roofGeo = new THREE.BoxGeometry(CAR.roofW, CAR.roofH, CAR.roofD);
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(-0.12, CAR.bodyH * 0.5 + CAR.roofH * 0.5 + 0.02, 0);
  car.add(roof);

  // ── Windshield (front glass) ────────────────────────────────────────────────
  const wsGeo = new THREE.BoxGeometry(0.06, CAR.roofH * 0.85, CAR.roofD * 0.88);
  const ws = new THREE.Mesh(wsGeo, glassMat);
  ws.position.set(
    roof.position.x + CAR.roofW * 0.5,
    roof.position.y - 0.02,
    0
  );
  // Slight lean
  ws.rotation.z = -0.32;
  car.add(ws);

  // ── Rear glass ─────────────────────────────────────────────────────────────
  const rgGeo = new THREE.BoxGeometry(0.06, CAR.roofH * 0.75, CAR.roofD * 0.88);
  const rg = new THREE.Mesh(rgGeo, glassMat);
  rg.position.set(roof.position.x - CAR.roofW * 0.5, roof.position.y - 0.02, 0);
  rg.rotation.z = 0.28;
  car.add(rg);

  // ── Side windows (left & right) ────────────────────────────────────────────
  const swGeo = new THREE.BoxGeometry(CAR.roofW * 0.78, CAR.roofH * 0.72, 0.04);
  [-CAR.bodyD * 0.52, CAR.bodyD * 0.52].forEach((z) => {
    const sw = new THREE.Mesh(swGeo, glassMat);
    sw.position.set(roof.position.x, roof.position.y, z);
    car.add(sw);
  });

  // ── Headlights ─────────────────────────────────────────────────────────────
  const hlGeo = new THREE.BoxGeometry(0.08, 0.12, 0.25);
  [-CAR.bodyD * 0.3, CAR.bodyD * 0.3].forEach((z) => {
    const hl = new THREE.Mesh(hlGeo, lightMat);
    hl.position.set(CAR.bodyW * 0.5 + CAR.hoodLength - 0.02, 0.1, z);
    car.add(hl);
  });

  // ── Taillights ─────────────────────────────────────────────────────────────
  const tlGeo = new THREE.BoxGeometry(0.08, 0.12, 0.28);
  [-CAR.bodyD * 0.3, CAR.bodyD * 0.3].forEach((z) => {
    const tl = new THREE.Mesh(tlGeo, taillightMat);
    tl.position.set(-CAR.bodyW * 0.5, 0.1, z);
    car.add(tl);
  });

  // ── Bumpers ────────────────────────────────────────────────────────────────
  const fbGeo = new THREE.BoxGeometry(0.12, 0.15, CAR.bodyD * 0.9);
  const fb = new THREE.Mesh(fbGeo, bumperMat);
  fb.position.set(CAR.bodyW * 0.5 + CAR.hoodLength + 0.04, -0.1, 0);
  car.add(fb);

  const rbGeo = new THREE.BoxGeometry(0.12, 0.15, CAR.bodyD * 0.9);
  const rb = new THREE.Mesh(rbGeo, bumperMat);
  rb.position.set(-CAR.bodyW * 0.5 - 0.06, -0.1, 0);
  car.add(rb);

  // ── Undercarriage ──────────────────────────────────────────────────────────
  const underGeo = new THREE.BoxGeometry(CAR.bodyW + CAR.hoodLength - 0.1, 0.1, CAR.bodyD * 0.8);
  const underMat = new THREE.MeshLambertMaterial({ color: 0x1e3a8a });
  const under = new THREE.Mesh(underGeo, underMat);
  under.position.set(CAR.hoodLength * 0.3, -0.23, 0);
  car.add(under);

  // ── Wheels ─────────────────────────────────────────────────────────────────
  const hubColor = 0xe2e8f0;
  const wheelPositions: Array<{ x: number; z: number; name: string }> = [
    { x:  CAR.frontAxleX, z: -CAR.wheelTrack, name: 'wFL' },
    { x:  CAR.frontAxleX, z:  CAR.wheelTrack, name: 'wFR' },
    { x: -CAR.rearAxleX,  z: -CAR.wheelTrack, name: 'wRL' },
    { x: -CAR.rearAxleX,  z:  CAR.wheelTrack, name: 'wRR' },
  ];

  wheelPositions.forEach(({ x, z, name }) => {
    const wheel = makeWheel(wheelColor, hubColor);
    wheel.position.set(x, CAR.axleY, z);
    wheel.name = name;
    car.add(wheel);
  });

  return car;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

interface UseThreeCarOptions {
  bodyColor?: number;
  roofColor?: number;
  wheelColor?: number;
  /** Size of the Three.js canvas (matches SVG container) */
  width: number;
  height: number;
}

interface UseThreeCarReturn {
  /** Attach this ref to the <canvas> element */
  canvasRef: React.RefObject<HTMLCanvasElement>;
  /** Call this to move the car to a new screen position */
  moveCar: (pos: CarScreenPosition) => void;
  /** Call on unmount (handled automatically, but exposed for flexibility) */
  dispose: () => void;
}

export function useThreeCar({
  bodyColor  = 0x3b82f6,
  roofColor  = 0x2563eb,
  wheelColor = 0x1e293b,
  width,
  height,
}: UseThreeCarOptions): UseThreeCarReturn {
  const canvasRef  = useRef<HTMLCanvasElement>(null!);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef    = useRef<THREE.Scene | null>(null);
  const cameraRef   = useRef<THREE.OrthographicCamera | null>(null);
  const carRef      = useRef<THREE.Group | null>(null);
  const frameRef    = useRef<number>(0);
  const targetPos   = useRef<CarScreenPosition>({ x: 0, y: 0, angle: 0 });
  const currentPos  = useRef<{ x: number; y: number; yaw: number }>({
    x: 0, y: 0, yaw: 0,
  });

  // Lerp helpers
  const lerpVal = (a: number, b: number, t: number) => a + (b - a) * t;
  const lerpAngle = (a: number, b: number, t: number) => {
    let diff = b - a;
    while (diff >  Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    return a + diff * t;
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // ── Scene ──────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // ── Renderer (transparent background — SVG road shows through) ─────────
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // ── Orthographic camera (isometric feel — no perspective distortion) ───
    // Camera looks down at a ~35° angle from slightly to the right
    const aspect = width / height;
    const frustumSize = 5;
    const camera = new THREE.OrthographicCamera(
      -frustumSize * aspect,
       frustumSize * aspect,
       frustumSize,
      -frustumSize,
      0.1,
      100
    );
    // Isometric angle: position camera above-right-front
    camera.position.set(4, 4, 6);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // ── Lights ─────────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 0.9);
    sun.position.set(6, 10, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.width  = 512;
    sun.shadow.mapSize.height = 512;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0xb3d4ff, 0.3);
    fill.position.set(-4, 2, -2);
    scene.add(fill);

    // ── Car mesh ───────────────────────────────────────────────────────────
    const car = buildCar(bodyColor, roofColor, wheelColor);
    car.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow    = true;
        obj.receiveShadow = true;
      }
    });
    sceneRef.current.add(car);
    carRef.current = car;

    // ── Ground shadow plane (invisible receiver) ───────────────────────────
    const groundGeo = new THREE.PlaneGeometry(20, 20);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.18 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = CAR.axleY - CAR.wheelR;
    ground.receiveShadow = true;
    scene.add(ground);

    // ── Animation loop ─────────────────────────────────────────────────────
    let t = 0;
    const LERP_SPEED = 0.07; // smooth follow speed

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      t += 0.04;

      if (!carRef.current || !rendererRef.current || !cameraRef.current) return;

      const car = carRef.current;
      const target = targetPos.current;

      // Smooth position interpolation (screen space → scene space)
      currentPos.current.x   = lerpVal(currentPos.current.x,   target.x,   LERP_SPEED);
      currentPos.current.y   = lerpVal(currentPos.current.y,   target.y,   LERP_SPEED);
      currentPos.current.yaw = lerpAngle(currentPos.current.yaw, target.angle, LERP_SPEED);

      // Convert screen pixels → Three.js world units
      // The car is positioned in world space; we offset from scene origin
      const sceneX = ((currentPos.current.x / width)  - 0.5) * frustumSize * aspect * 2;
      const sceneZ = ((currentPos.current.y / height)  - 0.5) * frustumSize * 2;

      car.position.x = sceneX;
      car.position.z = sceneZ;

      // Bob animation
      car.position.y = Math.sin(t * 1.8) * 0.04;

      // Yaw to face direction of travel
      // SVG x-right maps to Three.js negative-z forward
      car.rotation.y = -currentPos.current.yaw + Math.PI * 0.5;

      // Wheel spin
      const spinSpeed = t * 2.5;
      ['wFL', 'wFR', 'wRL', 'wRR'].forEach((name) => {
        const wheel = car.getObjectByName(name);
        if (wheel) wheel.rotation.x = spinSpeed;
      });

      rendererRef.current.render(scene, cameraRef.current);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  // Resize renderer when container size changes
  useEffect(() => {
    if (!rendererRef.current || !cameraRef.current) return;
    const aspect = width / height;
    const frustumSize = 5;
    const cam = cameraRef.current as THREE.OrthographicCamera;
    cam.left   = -frustumSize * aspect;
    cam.right  =  frustumSize * aspect;
    cam.top    =  frustumSize;
    cam.bottom = -frustumSize;
    cam.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  }, [width, height]);

  const moveCar = useCallback((pos: CarScreenPosition) => {
    targetPos.current = pos;
  }, []);

  const dispose = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    rendererRef.current?.dispose();
  }, []);

  return { canvasRef, moveCar, dispose };
}