import { getResults } from '../services/supabase.js';
import gsap from 'gsap';

export async function initResults() {
  const container = document.getElementById('results-container');
  
  container.innerHTML = `
    <div class="glass-panel" style="padding: 40px;">
      <h2 class="form-header heading-accent glow-text-yellow">Live Results</h2>
      <p style="margin-bottom: 30px; opacity: 0.8; text-align: center; font-size: 1.1rem;">Decrypting blockchain tally...</p>
      
      <div id="results-chart" style="display: flex; flex-direction: column; gap: 20px;">
        <div style="text-align: center; padding: 40px 0;">
          <div class="ai-orb" style="margin: 0 auto; width: 24px; height: 24px; background: var(--cyber-yellow); box-shadow: 0 0 20px var(--cyber-yellow);"></div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 40px;">
        <button id="restart-btn" class="neon-button">Restart Simulation</button>
      </div>
    </div>
  `;

  document.getElementById('restart-btn').addEventListener('click', () => {
    gsap.to('body', { opacity: 0, duration: 1, onComplete: () => window.location.reload() });
  });
}

export function showResults() {
  const container = document.getElementById('results-container');
  container.style.display = 'block';
  gsap.fromTo(container, 
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1, duration: 1.2, ease: 'power4.out', delay: 0.3 }
  );
}

export async function loadResultsData() {
  const chartContainer = document.getElementById('results-chart');
  
  // Fake loading delay to let camera move and UI settle
  await new Promise(r => setTimeout(r, 1500));
  
  const results = await getResults();
  const total = Object.values(results).reduce((a, b) => a + b, 0) || 1;
  
  chartContainer.innerHTML = '';
  
  const candidateNames = {
    'candidate-1': 'Candidate A (Tech)',
    'candidate-2': 'Candidate B (Progress)',
    'candidate-3': 'Candidate C (Future)'
  };
  
  for (const [id, count] of Object.entries(results)) {
    const percent = Math.round((count / total) * 100);
    const barHtml = `
      <div class="result-bar-wrapper">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: 600;">
          <span>${candidateNames[id]}</span>
          <span class="glow-text-yellow">${percent}%</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: 0%;" data-target="${percent}%"></div>
        </div>
      </div>
    `;
    chartContainer.innerHTML += barHtml;
  }

  // Animate bars
  setTimeout(() => {
    const fills = chartContainer.querySelectorAll('.progress-bar-fill');
    fills.forEach(fill => {
      fill.style.width = fill.getAttribute('data-target');
    });
    
    gsap.fromTo('.result-bar-wrapper', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
    );
  }, 100);
}
