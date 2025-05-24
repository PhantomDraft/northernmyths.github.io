// hugr.js ➔ ES6 OOP, Vanilla JS
class ContentSplitter {
  constructor() {
    this.point = 0;
    this.btn   = document.querySelector('.manager__js-btn');
    this.hammer = new Hammer(this.btn);

    this.menuButtons = Array.from(
      document.querySelectorAll('.logo_menu, .main__menu--close')
    );
    this.menu = document.querySelector('.main__menu');

    this.sliderTargets = [
      {
        leftSelector:  '.content__left',
        rightSelector: '.content__right',
        mode:          'calc'
      },
      {
        leftSelector:  '.slider-half.slider-left',
        rightSelector: '.slider-half.slider-right',
        mode:          'percent'
      }
    ];

    this.init();
  }

  init() {
    window.addEventListener('load',   () => { this.updateHeight(); this.animateToSavedPercent(); });
    window.addEventListener('resize', () => { this.updateHeight(); this.animateToSavedPercent(); });

    this.hammer.on('pan', ev => {
      this.point = ev.center.x - window.innerWidth / 2 + 9;
      this.move(this.point);
      this.saveCurrentPercent();
    });

    this.menuButtons.forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        this.menu.classList.toggle('menu__no__active');
        document.body.classList.toggle('menu__active');
      });
    });

    this.updateHeight();
    this.animateToSavedPercent();
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      .test(navigator.userAgent);
  }

  updateHeight() {
    const leftCol  = document.querySelector('.content__left');
    const rightCol = document.querySelector('.content__right');
    if (!leftCol || !rightCol) return;

    const leftH2  = Array.from(leftCol.querySelectorAll('h2')).find(h2 => h2.querySelector('a'));
    const rightH2 = Array.from(rightCol.querySelectorAll('h2')).find(h2 => h2.querySelector('a'));
    if (leftH2 && rightH2) {
      leftH2.style.height = rightH2.style.height = 'auto';
      const maxH = Math.max(leftH2.offsetHeight, rightH2.offsetHeight);
      leftH2.style.height  = `${maxH}px`;
      rightH2.style.height = `${maxH}px`;
    }

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

    document.querySelector('.hints__right span').textContent = 50 - percent;
    document.querySelector('.hints__left span').textContent  = 50 + percent;

    document.querySelector('.fixer__gray-image').style.width = `calc(200% + ${total}px)`;
    document.querySelector('.fixer__gray').style.width       = `calc(50% + ${point}px)`;

    this.btn.style.left                                = `calc(50% - 20px + ${point}px)`;
    document.querySelector('.manager__active').style.width = `calc(50% + ${point}px)`;
    document.querySelector('.manager__divider').style.left = `calc(50% + ${point}px)`;

    this.sliderTargets.forEach(({ leftSelector, rightSelector, mode }) => {
      const leftWidth  = mode === 'calc'
        ? `calc(50% + ${point}px)`
        : `${percent}%`;
      const rightWidth = mode === 'calc'
        ? `calc(50% - ${point}px)`
        : `${100 - percent}%`;

      document.querySelectorAll(leftSelector).forEach(el => {
        el.style.width = leftWidth;
      });
      document.querySelectorAll(rightSelector).forEach(el => {
        el.style.width = rightWidth;
      });
    });

    this._savedPercent = percent;
  }

  saveCurrentPercent() {
    localStorage.setItem('vikingMythsSlider', this._savedPercent);
  }

  animateToSavedPercent() {
    const saved = parseFloat(localStorage.getItem('vikingMythsSlider'));
    if (isNaN(saved)) return;
    const point = (saved * window.innerWidth) / 100;
    this.move(point);
  }
}

window.addEventListener('load', () => {
  document.body.classList.add('loading');

  fetch('/assets/data/loader.json')
    .then(res => res.json())
    .then(data => {
      const idx = Math.floor(Math.random() * data.length);
      const { image, text } = data[idx];
      const loader = document.getElementById('loaderOverlay');

      loader.querySelector('.loader-image').style.backgroundImage = `url(${image})`;
      loader.querySelector('.loader-text').textContent = text;

      const spinner = loader.querySelector('.loader-spinner');
      if (spinner) {
        spinner.style.display = 'none';
      }

      loader.classList.remove('hidden');

      const continueBtn = document.createElement('button');
      continueBtn.id = 'loaderContinue';
      continueBtn.className = 'info-button';
      continueBtn.textContent = 'Continue';
      loader.appendChild(continueBtn);

      continueBtn.addEventListener('click', () => {
        loader.classList.add('hidden');
        loader.addEventListener('transitionend', () => {
          document.body.classList.remove('loading');

          const infoOverlay = document.getElementById('infoOverlay');
          if (!localStorage.getItem('infoDismissed')) {
            infoOverlay.classList.remove('hidden');
            document.getElementById('infoOk').addEventListener('click', () => {
              localStorage.setItem('infoDismissed', 'true');
              infoOverlay.classList.add('hidden');
            });
          }

          const splitter = new ContentSplitter();
          splitter.animateToSavedPercent();
        }, { once: true });
      });
    })
    .catch(() => {
      const loader = document.getElementById('loaderOverlay');
      const spinner = loader.querySelector('.loader-spinner');
      if (spinner) {
        spinner.style.display = 'none';
      }
      loader.classList.remove('hidden');
    });
});