import * as THREE from 'three';

export let scene, renderer, composer;
export const booths = {};

let particles;

export function initScene(container) {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030308, 0.015);

  renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ReinhardToneMapping;
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);

  const neonBlueLight = new THREE.PointLight(0x00f3ff, 2, 150);
  neonBlueLight.position.set(0, 15, 0);
  scene.add(neonBlueLight);

  const electricPurpleLight = new THREE.PointLight(0xbc13fe, 2, 150);
  electricPurpleLight.position.set(20, 10, -20);
  scene.add(electricPurpleLight);

  // Cyber Floor Grid
  const gridHelper = new THREE.GridHelper(300, 100, 0x00f3ff, 0x0a0a1a);
  gridHelper.position.y = -3;
  gridHelper.material.opacity = 0.4;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // Create Complex Booths
  createRegistrationBooth();
  createVotingBooth();
  createResultCenter();

  // Create Particles
  createParticles();

  window.addEventListener('resize', onWindowResize);
}

function createRegistrationBooth() {
  const group = new THREE.Group();
  group.position.set(0, 0, -10);

  // Core
  const coreGeo = new THREE.IcosahedronGeometry(2, 1);
  const coreMat = new THREE.MeshStandardMaterial({ color: 0x0a0a1a, emissive: 0x00f3ff, emissiveIntensity: 1.5, wireframe: true });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Outer Ring
  const ringGeo = new THREE.TorusGeometry(3.5, 0.1, 16, 100);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x00f3ff, emissiveIntensity: 2 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  scene.add(group);
  booths.registration = { group, core, ring, color: 0x00f3ff };
}

function createVotingBooth() {
  const group = new THREE.Group();
  group.position.set(20, 1, -20);

  // Core
  const coreGeo = new THREE.CylinderGeometry(1.5, 1.5, 6, 32);
  const coreMat = new THREE.MeshStandardMaterial({ color: 0x0a0a1a, emissive: 0xbc13fe, emissiveIntensity: 1.5, wireframe: true });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Floating Data Rings
  for (let i = 0; i < 3; i++) {
    const ringGeo = new THREE.TorusGeometry(3 + i*0.5, 0.05, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xbc13fe, emissiveIntensity: 2 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = (i - 1) * 2;
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
  }

  scene.add(group);
  booths.voting = { group, core, color: 0xbc13fe };
}

function createResultCenter() {
  const group = new THREE.Group();
  group.position.set(-20, 2, -30);

  // Core
  const coreGeo = new THREE.OctahedronGeometry(3, 0);
  const coreMat = new THREE.MeshStandardMaterial({ color: 0x0a0a1a, emissive: 0xfce205, emissiveIntensity: 1.5, wireframe: true });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  scene.add(group);
  booths.results = { group, core, color: 0xfce205 };
}

function createParticles() {
  const particleCount = 2000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 150;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0x00f3ff,
    size: 0.2,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

export function animateSceneObjects(time) {
  // Rotate Registration
  if (booths.registration) {
    booths.registration.core.rotation.y += 0.005;
    booths.registration.core.rotation.x += 0.002;
    booths.registration.ring.rotation.z -= 0.01;
    booths.registration.group.position.y = Math.sin(time * 0.001) * 0.5;
  }

  // Rotate Voting
  if (booths.voting) {
    booths.voting.core.rotation.y -= 0.005;
    booths.voting.group.children.forEach((c, i) => {
      if (i > 0) { // Rings
        c.rotation.z += 0.01 * (i % 2 === 0 ? 1 : -1);
      }
    });
    booths.voting.group.position.y = 1 + Math.sin(time * 0.0015) * 0.5;
  }

  // Rotate Results
  if (booths.results) {
    booths.results.core.rotation.y += 0.01;
    booths.results.core.rotation.z += 0.005;
    booths.results.group.position.y = 2 + Math.sin(time * 0.002) * 1;
  }

  // Drift Particles
  if (particles) {
    particles.rotation.y += 0.0005;
  }
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
}
