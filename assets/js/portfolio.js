const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } });
}, { threshold: 0.12 });
reveals.forEach(el => revealObserver.observe(el));

const modal = document.querySelector('.video-modal');
const modalVideo = modal?.querySelector('video');
const closeModal = () => {
  if (!modal || !modalVideo) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  modalVideo.pause();
  modalVideo.removeAttribute('src');
  modalVideo.load();
  document.body.style.overflow = '';
};

document.querySelectorAll('.video-toggle').forEach(button => {
  button.addEventListener('click', () => {
    if (!modal || !modalVideo) return;
    modalVideo.src = button.dataset.video;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    modalVideo.play().catch(() => {});
  });
});
modal?.querySelector('.video-modal-close')?.addEventListener('click', closeModal);
modal?.querySelector('.video-modal-backdrop')?.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
