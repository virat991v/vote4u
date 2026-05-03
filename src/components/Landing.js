import { setStep } from '../utils/state.js';
import gsap from 'gsap';
import { showRegistration } from './Registration.js';

export function initLanding() {
  const container = document.getElementById('landing-container');
  
  container.innerHTML = `
    <div class="landing-scene">
      <h1 class="landing-title heading-accent glow-text-blue">Vote4U</h1>
      <p class="landing-subtitle">Do you really know how voting works?<br/>Step inside the system.</p>
      <button id="start-btn" class="neon-button">Start Experience</button>
    </div>
  `;

  document.getElementById('start-btn').addEventListener('click', () => {
    gsap.to(container, {
      opacity: 0,
      y: -50,
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        container.style.display = 'none';
        setStep('registration');
        showRegistration();
      }
    });
  });
}

export function showLanding() {
  const container = document.getElementById('landing-container');
  gsap.fromTo(container, 
    { opacity: 0, y: 50, display: 'flex' },
    { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' }
  );
}

