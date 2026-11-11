function motionEnabled() {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function revealContent(element) {
  if (!motionEnabled() || !element.animate) return;
  element.getAnimations().forEach(animation => animation.cancel());
  element.animate(
    [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
    { duration: 280, easing: 'cubic-bezier(.2,.8,.2,1)' }
  );
}

const themeToggle = document.querySelector('.theme-toggle');
const themeLabel = document.querySelector('.theme-label');
const themeIcon = document.querySelector('.theme-icon');
const themeColor = document.querySelector('meta[name="theme-color"]');

function updateThemeControl() {
  const isLight = document.documentElement.dataset.theme === 'light';
  themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
  themeLabel.textContent = isLight ? 'Dark' : 'Light';
  themeIcon.textContent = isLight ? '☾' : '☀';
  themeColor.setAttribute('content', isLight ? '#f6f7fb' : '#101116');
}

updateThemeControl();
themeToggle.hidden = false;
themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = nextTheme;
  try {
    localStorage.setItem('portfolio-theme', nextTheme);
  } catch {
    // The switch still works when browser storage is unavailable.
  }
  updateThemeControl();
});

const filterControls = document.querySelector('.project-filters');
const filterButtons = filterControls.querySelectorAll('button');
const projectCards = document.querySelectorAll('.project-grid > .project-card');
const filterResult = document.querySelector('.filter-result');

filterControls.hidden = false;
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    let visibleCount = 0;

    projectCards.forEach(card => {
      card.hidden = category !== 'all' && card.dataset.category !== category;
      if (!card.hidden) {
        visibleCount += 1;
        revealContent(card);
      }
    });
    filterButtons.forEach(control => {
      control.setAttribute('aria-pressed', String(control === button));
    });
    filterResult.textContent = `${visibleCount} ${visibleCount === 1 ? 'project' : 'projects'}`;
  });
});

const campaignControls = document.querySelector('.campaign-tabs');
const campaignButtons = campaignControls.querySelectorAll('button');
const campaignPanels = document.querySelectorAll('.campaign-panel');

function selectCampaign(button, animate = true) {
  campaignButtons.forEach(control => {
    control.setAttribute('aria-pressed', String(control === button));
  });
  campaignPanels.forEach(panel => {
    panel.hidden = panel.id !== `campaign-${button.dataset.campaign}`;
    if (panel.hidden) panel.querySelector('video')?.pause();
    if (!panel.hidden && animate) revealContent(panel);
  });
}

campaignControls.hidden = false;
selectCampaign(campaignButtons[0], false);
campaignButtons.forEach(button => {
  button.addEventListener('click', () => selectCampaign(button));
});

const navigationLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('main > section[id]');

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navigationLinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    });
  }, { rootMargin: '-10% 0px -55% 0px' });
  sections.forEach(section => sectionObserver.observe(section));
}

const toolDrawers = document.querySelectorAll('.tool-drawer');
const drawerAnimations = new Map();

function setDrawerOpen(drawer, open) {
  const startHeight = drawer.getBoundingClientRect().height;
  drawerAnimations.get(drawer)?.cancel();

  if (!motionEnabled() || !drawer.animate) {
    drawer.open = open;
    delete drawer.dataset.expanded;
    drawerAnimations.delete(drawer);
    return;
  }

  const summary = drawer.querySelector('summary');
  // Keep the content rendered until the closing animation has finished.
  drawer.open = true;
  const endHeight = open ? drawer.scrollHeight + 2 : summary.getBoundingClientRect().height + 2;
  const animation = drawer.animate(
    [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
    { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' }
  );
  drawer.dataset.expanded = String(open);
  drawerAnimations.set(drawer, animation);
  animation.onfinish = () => {
    drawer.open = open;
    delete drawer.dataset.expanded;
    drawerAnimations.delete(drawer);
  };
}

toolDrawers.forEach(drawer => {
  drawer.querySelector('summary').addEventListener('click', event => {
    event.preventDefault();
    const isExpanded = drawer.dataset.expanded === 'true' ||
      (drawer.dataset.expanded === undefined && drawer.open);
    const shouldOpen = !isExpanded;

    if (shouldOpen) {
      toolDrawers.forEach(otherDrawer => {
        if (otherDrawer !== drawer && otherDrawer.open) setDrawerOpen(otherDrawer, false);
      });
    }
    setDrawerOpen(drawer, shouldOpen);
  });
});
