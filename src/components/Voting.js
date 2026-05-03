import { setStep, setVoted, STATE } from '../utils/state.js';
import { castVote } from '../services/supabase.js';
import gsap from 'gsap';
import { showResults } from './Results.js';

export function initVoting() {
  const container = document.getElementById('voting-container');
  
  container.innerHTML = `
    <div class="glass-panel" style="padding: 40px;">
      <h2 class="form-header heading-accent glow-text-purple">EVM Interface</h2>
      <p style="margin-bottom: 30px; opacity: 0.8; text-align: center; font-size: 1.1rem;">Select a candidate and cast your vote.</p>
      
      <div class="candidate-grid" id="candidates">
        <div class="candidate-btn" data-id="candidate-1">
          <span>Candidate A (Technology Party)</span>
          <div class="indicator"></div>
        </div>
        <div class="candidate-btn" data-id="candidate-2">
          <span>Candidate B (Progress Party)</span>
          <div class="indicator"></div>
        </div>
        <div class="candidate-btn" data-id="candidate-3">
          <span>Candidate C (Future Party)</span>
          <div class="indicator"></div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <button id="cast-vote-btn" class="neon-button purple" disabled style="opacity: 0.3; cursor: not-allowed;">Cast Vote</button>
      </div>
    </div>
  `;

  let selectedCandidate = null;
  const buttons = container.querySelectorAll('.candidate-btn');
  const castBtn = document.getElementById('cast-vote-btn');

  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedCandidate = btn.getAttribute('data-id');
      
      gsap.to(castBtn, { opacity: 1, duration: 0.3 });
      castBtn.disabled = false;
      castBtn.style.cursor = 'pointer';
    });
  });

  castBtn.addEventListener('click', async () => {
    if (!selectedCandidate || STATE.hasVoted) return;
    
    castBtn.innerText = "Encrypting Vote...";
    castBtn.disabled = true;
    gsap.to(castBtn, { scale: 0.95, duration: 0.2, yoyo: true, repeat: -1 });

    // Simulate network delay for UX
    await new Promise(r => setTimeout(r, 1200));
    
    await castVote(selectedCandidate);
    setVoted(true);
    
    gsap.killTweensOf(castBtn);
    
    gsap.to(container, {
      opacity: 0,
      y: -50,
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        container.style.display = 'none';
        setStep('results');
        showResults();
      }
    });
  });
}

export function showVoting() {
  const container = document.getElementById('voting-container');
  container.style.display = 'block';
  gsap.fromTo(container, 
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', delay: 0.3 }
  );

  // Stagger candidate buttons
  gsap.fromTo('.candidate-btn', 
    { opacity: 0, x: -30 }, 
    { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.8 }
  );
}

