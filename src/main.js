import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';

window.addEventListener('error', (e) => {
  const errDiv = document.createElement('div');
  errDiv.style.cssText = 'position:fixed; top:0; left:0; z-index:9999; background:red; color:white; padding:20px; font-size:20px;';
  errDiv.innerText = 'JS ERROR: ' + e.message + ' at ' + e.filename + ':' + e.lineno;
  document.body.appendChild(errDiv);
});
window.addEventListener('unhandledrejection', (e) => {
  const errDiv = document.createElement('div');
  errDiv.style.cssText = 'position:fixed; top:40px; left:0; z-index:9999; background:orange; color:white; padding:20px; font-size:20px;';
  errDiv.innerText = 'PROMISE ERROR: ' + (e.reason ? e.reason.message : 'Unknown');
  document.body.appendChild(errDiv);
});
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { initScene, renderer, scene, animateSceneObjects } from './three/scene.js';
import { initCamera, updateCamera, camera } from './three/camera.js';
import { initInteractions, updateInteractions } from './three/interactions.js';

import { initLanding, showLanding } from './components/Landing.js';
import { initRegistration } from './components/Registration.js';
import { initVoting } from './components/Voting.js';
import { initResults, loadResultsData } from './components/Results.js';
import { initAIAssistant } from './components/AIAssistant.js';

import { STATE, subscribe } from './utils/state.js';

let composer;

// Initialize Three.js
const canvasContainer = document.getElementById('canvas-container');
initScene(canvasContainer);
initCamera();
initInteractions();

// Setup Post-Processing (Bloom)
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5, // strength
  0.4, // radius
  0.85 // threshold
);
composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

window.addEventListener('resize', () => {
  composer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize UI Components
initLanding();
initRegistration();
initVoting();
initResults();
initAIAssistant();

// Start
showLanding();

// Listen for state changes to load data when reaching specific steps
subscribe(async (state) => {
  if (state.currentStep === 'results') {
    await loadResultsData();
  }
});

// Main Animation Loop
function animate(time) {
  requestAnimationFrame(animate);
  
  updateInteractions();
  updateCamera();
  animateSceneObjects(time);

  if (composer) {
    composer.render();
  }
}

animate(0);
