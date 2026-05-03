import * as THREE from 'three';
import { booths, scene } from './scene.js';
import { camera } from './camera.js';

let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();

export function initInteractions() {
  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });
}

export function updateInteractions() {
  if (!camera || !scene) return;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  
  // Reset emissive on all booth cores
  Object.values(booths).forEach(b => {
    if (b.core && b.core.material) {
      b.core.material.emissiveIntensity = 1.5;
    }
  });

  if (intersects.length > 0) {
    // Find if intersected object belongs to a booth group
    let intersectedBooth = null;
    let obj = intersects[0].object;
    
    // Traverse up to see if it's part of a booth group
    Object.values(booths).forEach(b => {
      let current = obj;
      while(current) {
        if (current === b.group || current === b.core) {
          intersectedBooth = b;
          break;
        }
        current = current.parent;
      }
    });

    if (intersectedBooth) {
      intersectedBooth.core.material.emissiveIntensity = 4.0; // Glow brighter
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'default';
    }
  } else {
    document.body.style.cursor = 'default';
  }
}
