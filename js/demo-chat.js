// TALOX — démo de conversation simulée (hero)
// Conçu pour être remplacé facilement par un vrai widget/numéro d'appel :
// voir DEMO_CONFIG.mode ci-dessous.

const DEMO_CONFIG = {
  mode: 'scripted', // 'scripted' (par défaut, aucun backend) | 'phone' (à activer quand un numéro de démo existe)
  phone: {
    number: '', // ex: '+32 2 000 00 00'
    label: 'Appelez ce numéro pour tester notre agent vocal',
  },
  script: [
    { from: 'client', text: "Bonjour, vous faites encore des devis pour une installation ce mois-ci ?" },
    { from: 'agent', text: "Bonjour 👋 Oui, tout à fait. Je peux prendre vos coordonnées et vous proposer un créneau, ça vous va ?" },
    { from: 'client', text: "Oui parfait, plutôt en fin de semaine si possible." },
    { from: 'agent', text: "Je vous propose vendredi 14h ou samedi 10h. Un rappel vous sera envoyé la veille par SMS." },
    { from: 'client', text: "Va pour vendredi 14h, merci !" },
    { from: 'agent', text: "C'est noté ✅ Rendez-vous confirmé, l'équipe est prévenue. Bonne journée !" },
  ],
};

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-demo-chat]');
  if (!root) return;

  if (DEMO_CONFIG.mode === 'phone' && DEMO_CONFIG.phone.number) {
    renderPhoneDemo(root);
    return;
  }

  runScriptedDemo(root);

  const replayBtn = root.querySelector('[data-demo-replay]');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => runScriptedDemo(root));
  }
});

function renderPhoneDemo(root) {
  const body = root.querySelector('[data-demo-body]');
  if (!body) return;
  body.innerHTML = `
    <div style="text-align:center; padding: 2rem 0;">
      <p style="font-size:1.4rem; font-weight:800; margin-bottom:0.5rem;">${DEMO_CONFIG.phone.number}</p>
      <p style="color:#e4d9ff; font-size:0.92rem;">${DEMO_CONFIG.phone.label}</p>
    </div>`;
}

let demoTimers = [];

function runScriptedDemo(root) {
  const body = root.querySelector('[data-demo-body]');
  if (!body) return;

  demoTimers.forEach(clearTimeout);
  demoTimers = [];
  body.innerHTML = '';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let delay = 0;

  DEMO_CONFIG.script.forEach((line, i) => {
    const typingDelay = prefersReducedMotion ? 0 : 500;
    const showDelay = prefersReducedMotion ? 0 : 900;

    if (!prefersReducedMotion) {
      demoTimers.push(setTimeout(() => showTyping(body, line.from), delay));
    }
    delay += typingDelay;

    demoTimers.push(setTimeout(() => {
      removeTyping(body);
      appendMessage(body, line.from, line.text);
    }, delay));
    delay += showDelay;
  });
}

function showTyping(body, from) {
  removeTyping(body);
  const el = document.createElement('div');
  el.className = 'demo-typing';
  el.dataset.typingIndicator = 'true';
  el.innerHTML = '<span></span><span></span><span></span>';
  if (from === 'client') el.style.alignSelf = 'flex-end';
  body.appendChild(el);
  body.scrollTop = body.scrollHeight;
}

function removeTyping(body) {
  const el = body.querySelector('[data-typing-indicator]');
  if (el) el.remove();
}

function appendMessage(body, from, text) {
  const el = document.createElement('div');
  el.className = `demo-msg from-${from}`;
  el.textContent = text;
  body.appendChild(el);
  body.scrollTop = body.scrollHeight;
}
