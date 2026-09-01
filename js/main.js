// TALOX — comportements partagés (nav mobile, formulaire, calculateur ROI, icônes)

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  initMobileNav();
  initContactForm();
  initRoiCalculator();

  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// Site 100% statique : pas de backend disponible pour recevoir le formulaire.
// Fallback fonctionnel : ouverture d'un mailto pré-rempli + confirmation visuelle.
// A remplacer en prod par un vrai endpoint (Formspree, Web3Forms, fonction serverless...).
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const successMsg = form.querySelector('.form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    const subject = encodeURIComponent(`Nouveau contact TALOX — ${data.prenom || ''} ${data.nom || ''}`);
    const body = encodeURIComponent(
      `Prénom: ${data.prenom || ''}\n` +
      `Nom: ${data.nom || ''}\n` +
      `Email pro: ${data.email || ''}\n` +
      `Entreprise: ${data.entreprise || ''}\n\n` +
      `Projet:\n${data.projet || ''}`
    );

    window.location.href = `mailto:contact@talox.be?subject=${subject}&body=${body}`;

    if (successMsg) {
      successMsg.classList.add('is-visible');
      successMsg.focus?.();
    }
    form.reset();
  });
}

// Calculateur "combien vous coûtent vos contacts manqués"
function initRoiCalculator() {
  const calc = document.querySelector('[data-calculator]');
  if (!calc) return;

  const missedInput = calc.querySelector('[data-missed]');
  const valueInput = calc.querySelector('[data-value]');
  const missedOutput = calc.querySelector('[data-missed-output]');
  const valueOutput = calc.querySelector('[data-value-output]');
  const resultValue = calc.querySelector('[data-result-value]');
  const resultCompare = calc.querySelector('[data-result-compare]');

  function format(n) {
    return new Intl.NumberFormat('fr-BE', { maximumFractionDigits: 0 }).format(n);
  }

  function update() {
    const missed = Number(missedInput.value);
    const value = Number(valueInput.value);
    const monthlyLoss = missed * value * 4.33; // semaines -> mois

    missedOutput.textContent = missed;
    valueOutput.textContent = `${format(value)} €`;
    resultValue.textContent = `${format(monthlyLoss)} €`;

    const taloxCost = 149;
    const net = monthlyLoss - taloxCost;
    resultCompare.textContent = net > 0
      ? `Soit une perte estimée d'environ ${format(net)} € net après un abonnement Essentiel à partir de 149 €/mois.`
      : `Un abonnement Essentiel démarre à 149 €/mois, à comparer à cette estimation de perte.`;
  }

  [missedInput, valueInput].forEach((input) => input.addEventListener('input', update));
  update();
}
