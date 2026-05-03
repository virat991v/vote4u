export const STATE = {
  currentStep: 'landing', // landing, registration, voting, results
  user: null, // { name: '', age: '', id: '' }
  hasVoted: false
};

const listeners = [];

export function subscribe(listener) {
  listeners.push(listener);
}

export function setStep(step) {
  STATE.currentStep = step;
  notify();
}

export function setUser(user) {
  STATE.user = user;
  notify();
}

export function setVoted(status) {
  STATE.hasVoted = status;
  notify();
}

function notify() {
  listeners.forEach(listener => listener(STATE));
}
