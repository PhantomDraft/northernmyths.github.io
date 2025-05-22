// hugr.js ➔ ES6 OOP, Vanilla JS
class ContentSplitter {
  constructor() {
    this.point = 0;
    this.btn = document.querySelector('.manager__js-btn');
    this.hammer = new Hammer(this.btn);
    this.leftLogoContainer  = document.querySelector('.logo__images__left');
    this.rightLogoContainer = document.querySelector('.logo__images__right');
    this.leftMenuContainer  = document.querySelector('.logo_menu__images__left');
    this.rightMenuContainer = document.querySelector('.logo_menu__images__right');
    this.menuButtons = Array.from(document.querySelectorAll('.logo_menu, .main__menu--close')); // English comment: cache menu buttons
    this.menu = document.querySelector('.main__menu');                                         // English comment: cache menu element
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

    // on slider drag: move and save percent
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
    // Get both columns
    const leftCol  = document.querySelector('.content__left');
    const rightCol = document.querySelector('.content__right');

    if (!leftCol || !rightCol) return;

    // Find the first <h2> containing an <a> in each column
    const leftH2  = Array.from(leftCol.querySelectorAll('h2'))
                         .find(h2 => h2.querySelector('a'));
    const rightH2 = Array.from(rightCol.querySelectorAll('h2'))
                         .find(h2 => h2.querySelector('a'));

    if (leftH2 && rightH2) {
      // Reset inline height before measuring
      leftH2.style.height  = 'auto';
      rightH2.style.height = 'auto';

      // Calculate the maximum height
      const maxH = Math.max(leftH2.offsetHeight, rightH2.offsetHeight);

      // Apply the maximum height to both
      leftH2.style.height  = `${maxH}px`;
      rightH2.style.height = `${maxH}px`;
    }

    // Existing logic to reset slider position on desktop
    if (!this.isMobile()) {
      this.move(0);
    }
  }

  move(point) {
    // calculate bounds and percent
    const vw = window.innerWidth / 100;
    const max = (100 * vw - 29.4 * vw - 85) / 2;
    if (window.innerWidth >= 750) {
      point = Math.max(-max, Math.min(point, max));
    }
    const total = -point * 2;
    const percent = Math.round((100 * point) / window.innerWidth);

    // update UI elements
    document.querySelector('.hints__right span').textContent = 50 - percent;
    document.querySelector('.hints__left span').textContent = 50 + percent;
    document.querySelector('.fixer__gray-image').style.width = `calc(200% + ${total}px)`;
    document.querySelector('.fixer__gray').style.width = `calc(50% + ${point}px)`;
    this.btn.style.left = `calc(50% - 20px + ${point}px)`;
    document.querySelector('.manager__active').style.width = `calc(50% + ${point}px)`;
    document.querySelector('.manager__divider').style.left = `calc(50% + ${point}px)`;
    document.querySelectorAll('.content__left').forEach(el => {
      el.style.width = `calc(50% + ${point}px)`;
    });
    document.querySelectorAll('.content__right').forEach(el => {
      el.style.width = `calc(50% - ${point}px)`;
    });
    this.leftLogoContainer.style.width = `${percent}%`;
    this.rightLogoContainer.style.width = `${100 - percent}%`;
    if (this.leftMenuContainer && this.rightMenuContainer) {
      this.leftMenuContainer.style.width  = `${percent}%`;
      this.rightMenuContainer.style.width = `${100 - percent}%`;
    }
    // English comment: update saved percent for future restores
    this._savedPercent = percent;
  }

  // English comment: persist the last slider position
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

// 1) On DOM load, display only the loader
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loading'); // заблокировать прокрутку и клики через CSS
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

// 2) After the page fully loads, wait 5 seconds, then:
//    – smoothly hide the loader,
//    – unlock the page,
//    – show the info-overlay (if it hasn’t been closed yet),
//    – initialize ContentSplitter
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loaderOverlay');
    loader.classList.add('hidden'); // CSS-анимация opacity + visibility

    loader.addEventListener('transitionend', () => {
      document.body.classList.remove('loading');

      // Info-overlay
      const infoOverlay = document.getElementById('infoOverlay');
      if (!localStorage.getItem('infoDismissed')) {
        infoOverlay.classList.remove('hidden');
        document.getElementById('infoOk').addEventListener('click', () => {
          localStorage.setItem('infoDismissed', 'true');
          infoOverlay.classList.add('hidden');
        });
      }

      // Initialize the slider and immediately apply the saved state
      const splitter = new ContentSplitter();
      splitter.animateToSavedPercent();
    }, { once: true });
  }, 5000);
});