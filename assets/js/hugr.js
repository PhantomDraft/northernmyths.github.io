// hugr.js ➔ ES6 OOP, Vanilla JS

class ContentSplitter {
  constructor() {
    this.point = 0;
    this.btn = document.querySelector('.manager__js-btn');
    this.hammer = new Hammer(this.btn);

    // cache menu buttons and menu element
    this.menuButtons = Array.from(document.querySelectorAll('.logo_menu, .main__menu--close'));
    this.menu = document.querySelector('.main__menu');

// define selectors of all left/right halves for slider
this.sliderPairs = [
  { leftSelector: '.logo__images__left',            rightSelector: '.logo__images__right' },
  { leftSelector: '.content__left-text .line-wrap', rightSelector: '.content__right-text .line-wrap' },
  { leftSelector: '.logo_menu__left',               rightSelector: '.logo_menu__right' }
];

    this.init();
  }

  init() {
    // on page load: adjust heights and animate to last saved position
    window.addEventListener('load', () => {
      this.updateHeight();
      this.animateToSavedPercent();
    });

    // on resize: recalc heights and animate to last saved position
    window.addEventListener('resize', () => {
      this.updateHeight();
      this.animateToSavedPercent();
    });

    // on slider drag: calculate point, move splitter, save percent
    this.hammer.on('pan', ev => {
      this.point = ev.center.x - window.innerWidth / 2 + 9;
      this.move(this.point);
      this.saveCurrentPercent();
    });

    // menu toggle functionality
    this.menuButtons.forEach(button => {
      button.addEventListener('click', ev => {
        ev.preventDefault();
        this.menu.classList.toggle('menu__no__active');
        document.body.classList.toggle('menu__active');
      });
    });

    // immediately apply saved percent (in case neither load nor resize fires)
    this.updateHeight();
    this.animateToSavedPercent();
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      .test(navigator.userAgent);
  }

  updateHeight() {
    // Get both content columns
    const leftCol  = document.querySelector('.content__left');
    const rightCol = document.querySelector('.content__right');
    if (!leftCol || !rightCol) return;

    // Find first <h2> with <a> in each column, adjust to same height
    const leftH2  = Array.from(leftCol.querySelectorAll('h2')).find(h2 => h2.querySelector('a'));
    const rightH2 = Array.from(rightCol.querySelectorAll('h2')).find(h2 => h2.querySelector('a'));
    if (leftH2 && rightH2) {
      leftH2.style.height  = 'auto';
      rightH2.style.height = 'auto';
      const maxH = Math.max(leftH2.offsetHeight, rightH2.offsetHeight);
      leftH2.style.height  = `${maxH}px`;
      rightH2.style.height = `${maxH}px`;
    }

    // reset slider position on desktop
    if (!this.isMobile()) {
      this.move(0);
    }
  }

move(point) {
  const vw  = window.innerWidth / 100;
  const max = (100 * vw - 29.4 * vw - 85) / 2;
  if (window.innerWidth >= 750) {
    point = Math.max(-max, Math.min(point, max));
  }
  const total   = -point * 2;
  const percent = Math.round((100 * point) / window.innerWidth);

  // update hints and fixer exactly как было
  document.querySelector('.hints__right span').textContent = 50 - percent;
  document.querySelector('.hints__left span').textContent  = 50 + percent;
  document.querySelector('.fixer__gray-image').style.width = `calc(200% + ${total}px)`;
  document.querySelector('.fixer__gray').style.width       = `calc(50% + ${point}px)`;
  this.btn.style.left                                    = `calc(50% - 20px + ${point}px)`;
  document.querySelector('.manager__active').style.width = `calc(50% + ${point}px)`;
  document.querySelector('.manager__divider').style.left = `calc(50% + ${point}px)`;

  // unified width update for logo, content and menu icons
  this.sliderPairs.forEach(({ leftSelector, rightSelector }) => {
    document.querySelectorAll(leftSelector).forEach(el => {
      el.style.width = `${percent}%`;
    });
    document.querySelectorAll(rightSelector).forEach(el => {
      el.style.width = `${100 - percent}%`;
    });
  });

  // English comment: update saved percent for future restores
  this._savedPercent = percent;
}

  // persist the last slider position
  saveCurrentPercent() {
    localStorage.setItem('vikingMythsSlider', this._savedPercent);
  }

  // English comment: read saved position and animate back to it
  animateToSavedPercent() {
    const saved = parseFloat(localStorage.getItem('vikingMythsSlider'));
    if (isNaN(saved)) return;
    const point = (saved * window.innerWidth) / 100;
    this.move(point);
  }
}

// 1) On DOMContentLoaded: display only the loader
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loading');
  fetch('/assets/data/loader.json')
    .then(res => res.json())
    .then(data => {
      const idx = Math.floor(Math.random() * data.length);
      const { image, text } = data[idx];
      const loader = document.getElementById('loaderOverlay');
      loader.querySelector('.loader-image').style.backgroundImage = `url(${image})`;
      loader.querySelector('.loader-text').textContent = text;
      loader.classList.remove('hidden');
    })
    .catch(() => {
      document.getElementById('loaderOverlay').classList.remove('hidden');
    });
});

// 2) After full page load: hide loader, show info, then init ContentSplitter
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loaderOverlay');
    loader.classList.add('hidden'); // opacity + visibility
    loader.addEventListener('transitionend', () => {
      document.body.classList.remove('loading');
      // show info-overlay if not dismissed
      const infoOverlay = document.getElementById('infoOverlay');
      if (!localStorage.getItem('infoDismissed')) {
        infoOverlay.classList.remove('hidden');
        document.getElementById('infoOk').addEventListener('click', () => {
          localStorage.setItem('infoDismissed', 'true');
          infoOverlay.classList.add('hidden');
        });
      }
      // initialize splitter and apply saved position
      const splitter = new ContentSplitter();
      splitter.animateToSavedPercent();
    }, { once: true });
  }, 5000);
});