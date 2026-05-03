import { setStep, setUser } from '../utils/state.js';
import gsap from 'gsap';
import { showVoting } from './Voting.js';

export function initRegistration() {
  const container = document.getElementById('registration-container');
  
  container.innerHTML = `
    <div class="glass-panel" style="padding: 40px;">
      <h2 class="form-header heading-accent glow-text-blue">Voter Registration</h2>
      <p style="margin-bottom: 30px; opacity: 0.8; text-align: center; font-size: 1.1rem;">Enter your details to register.</p>
      
      <input type="text" id="voter-name" placeholder="Full Name" autocomplete="off" />
      <input type="number" id="voter-age" placeholder="Age" min="18" max="120" />
      
      <div style="text-align: center; margin-top: 30px;">
        <button id="register-btn" class="neon-button">Authenticate</button>
      </div>
      <p id="reg-error" style="color: #ff4444; text-align: center; margin-top: 15px; display: none; font-weight: 600;">ACCESS DENIED: Must be 18+</p>
    </div>
  `;

  document.getElementById('register-btn').addEventListener('click', () => {
    const name = document.getElementById('voter-name').value;
    const age = parseInt(document.getElementById('voter-age').value);
    
    if (age >= 18 && name) {
      setUser({ name, age, id: 'voter-' + Date.now() });
      document.getElementById('reg-error').style.display = 'none';
      
      gsap.to(container, {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          container.style.display = 'none';
          setStep('voting');
          showVoting();
        }
      });
    } else {
      const err = document.getElementById('reg-error');
      err.style.display = 'block';
      gsap.fromTo(err, { x: -10 }, { x: 10, duration: 0.1, yoyo: true, repeat: 5 }); // shake effect
    }
  });
}

export function showRegistration() {
  const container = document.getElementById('registration-container');
  container.style.display = 'block';
  gsap.fromTo(container, 
    { opacity: 0, scale: 1.1 },
    { opacity: 1, scale: 1, duration: 1.2, ease: 'power4.out', delay: 0.2 }
  );
}

