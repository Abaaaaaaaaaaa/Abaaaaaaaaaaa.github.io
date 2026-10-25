const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('[data-service]').forEach((link) => link.addEventListener('click', () => {
  const subject = document.querySelector('[name="subject"]');
  subject.value = link.dataset.service;
}));

document.querySelector('#ticket-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const ticket = {
    name: data.get('name').trim(),
    branch: data.get('branch'),
    subject: data.get('subject').trim(),
    details: data.get('details').trim(),
    createdAt: new Date().toLocaleDateString('fr-BE')
  };
  const reference = `IMS-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const ticketText = `TICKET ${reference}\nBranche : ${ticket.branch}\nNom : ${ticket.name}\nQuoi : ${ticket.subject}\nDescription : ${ticket.details}\nDate : ${ticket.createdAt}`;
  const result = document.querySelector('#form-result');
  result.replaceChildren();
  const title = document.createElement('strong');
  title.textContent = `Ton ticket ${reference} est prêt !`;
  const summary = document.createElement('pre');
  summary.textContent = ticketText;
  const note = document.createElement('p');
  note.textContent = 'Copie-le, puis envoie-le à la team sur Instagram.';
  const copyButton = document.createElement('button');
  copyButton.type = 'button';
  copyButton.className = 'button button-dark submit-button';
  copyButton.textContent = 'Copier le ticket';
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(ticketText);
      copyButton.textContent = 'Copié !';
    } catch {
      summary.focus();
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(summary);
      selection.removeAllRanges();
      selection.addRange(range);
      copyButton.textContent = 'Sélectionne puis copie le ticket';
    }
  });
  const instagramLink = document.createElement('a');
  instagramLink.href = 'https://www.instagram.com/intendance_multi.service/';
  instagramLink.target = '_blank';
  instagramLink.rel = 'noreferrer';
  instagramLink.textContent = 'Ouvrir Instagram ↗';
  result.append(title, summary, note, copyButton, instagramLink);
  result.hidden = false;
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
