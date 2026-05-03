import * as THREE from 'three';
import { booths } from './scene.js';
import { subscribe } from '../utils/state.js';

export let camera;
let targetPosition = new THREE.Vector3(0, 5, 20);
let targetLookAt = new THREE.Vector3(0, 0, 0);

export function initCamera() {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.copy(targetPosition);
  camera.lookAt(targetLookAt);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  // Subscribe to state changes to move camera
  subscribe((state) => {
    moveToStep(state.currentStep);
  });
}

function moveToStep(step) {
  switch (step) {
    case 'landing':
      targetPosition.set(0, 10, 30);
      targetLookAt.set(0, 0, 0);
      break;
    case 'registration':
      targetPosition.set(0, 2, 0);
      if (booths.registration) targetLookAt.copy(booths.registration.group.position);
      break;
    case 'voting':
      targetPosition.set(15, 3, -10);
      if (booths.voting) targetLookAt.copy(booths.voting.group.position);
      break;
    case 'results':
      targetPosition.set(-10, 5, -15);
      if (booths.results) targetLookAt.copy(booths.results.group.position);
      break;
  }
}

export function updateCamera() {
  // Smoothly interpolate camera position and lookAt
  camera.position.lerp(targetPosition, 0.05);
  
  // To smoothly interpolate lookAt, we need a dummy object or just lerp a vector
  // Simplest is to manually track current lookAt
  if (!camera.userData.currentLookAt) {
    camera.userData.currentLookAt = new THREE.Vector3().copy(targetLookAt);
  }
  camera.userData.currentLookAt.lerp(targetLookAt, 0.05);
  camera.lookAt(camera.userData.currentLookAt);
}
