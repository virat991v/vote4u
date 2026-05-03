import { getAIExplanation } from '../services/ai.js';
import { STATE, subscribe } from '../utils/state.js';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

export function initAIAssistant() {
  const container = document.getElementById('ai-assistant-container');
  
  container.innerHTML = `
    <div class="glass-panel" style="padding: 20px; border-radius: 16px; background: rgba(10, 10, 20, 0.8);">
      <div class="ai-header">
        <div class="ai-orb"></div>
        <span style="font-size: 0.9rem;">AI System Link</span>
      </div>
      <div class="ai-text" id="ai-text-content" style="margin-top: 15px; min-height: 50px;">
        Establishing secure connection...
      </div>
    </div>
  `;

  // Update AI whenever step changes
  subscribe(async (state) => {
    if (state.currentStep !== 'landing') {
      if (container.style.display === 'none') {
        container.style.display = 'block';
        gsap.fromTo(container, 
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 1 }
        );
      }
    } else {
      container.style.display = 'none';
      container.style.opacity = 0;
    }
    
    if (state.currentStep !== 'landing') {
      await updateAIText(state.currentStep);
    }
  });
}

async function updateAIText(step) {
  const textEl = document.getElementById('ai-text-content');
  
  // Typing animation for loading
  gsap.to(textEl, { duration: 0.5, text: "Analyzing context parameters...", ease: "none" });
  
  const explanation = await getAIExplanation(step);
  
  // Typing animation for result
  gsap.to(textEl, { duration: Math.min(explanation.length * 0.03, 3), text: explanation, ease: "none", delay: 0.6 });
}
