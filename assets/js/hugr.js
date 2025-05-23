// hugr.js ➔ ES6 OOP, Vanilla JS

class ContentSplitter {
  constructor() {
    this.point = 0;
    this.btn   = document.querySelector('.manager__js-btn');
    this.hammer = new Hammer(this.btn);

    // menu toggle buttons
    this.menuButtons = Array.from(
      document.querySelectorAll('.logo_menu, .main__menu--close')
    );
    this.menu = document.querySelector('.main__menu');

    // ←— теперь именно эти три пары будут менять ширину
    this.sliderPairs = [
      { leftSelector: '.logo__images__left',   rightSelector: '.logo__images__right'   },
      { leftSelector: '.content__left',        rightSelector: '.content__right'        },
      { leftSelector: '.logo_menu__left',      rightSelector: '.logo_menu__right'      }
    ];

    this.init();
  }

  init() {
    // load/resize: привести всё к сохранённому положению
    window.addEventListener('load',  () => { this.updateHeight(); this.animateToSavedPercent(); });
    window.addEventListener('resize',() => { this.updateHeight(); this.animateToSavedPercent(); });

    // перетаскивание ползунка
    this.hammer.on('pan', ev => {
      this.point = ev.center.x - window.innerWidth/2 + 9;
      this.move(this.point);
      this.saveCurrentPercent();
    });

    // кнопки меню
    this.menuButtons.forEach(btn => {
      btn.addEventListener('click', ev => {
        ev.preventDefault();
        this.menu.classList.toggle('menu__no__active');
        document.body.classList.toggle('menu__active');
      });
    });

    // сразу применить
    this.updateHeight();
    this.animateToSavedPercent();
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      .test(navigator.userAgent);
  }

  updateHeight() {
    // одинаковая высота заголовков
    const leftCol  = document.querySelector('.content__left');
    const rightCol = document.querySelector('.content__right');
    if (!leftCol||!rightCol) return;

    const leftH2  = Array.from(leftCol.querySelectorAll('h2')).find(h2=>h2.querySelector('a'));
    const rightH2 = Array.from(rightCol.querySelectorAll('h2')).find(h2=>h2.querySelector('a'));
    if (leftH2 && rightH2) {
      leftH2.style.height = rightH2.style.height = 'auto';
      const maxH = Math.max(leftH2.offsetHeight, rightH2.offsetHeight);
      leftH2.style.height  = `${maxH}px`;
      rightH2.style.height = `${maxH}px`;
    }

    // reset для десктопа
    if (!this.isMobile()) this.move(0);
  }

  move(point) {
    // границы и проценты
    const vw  = window.innerWidth/100;
    const max = (100*vw - 29.4*vw - 85)/2;
    if (window.innerWidth>=750) {
      point = Math.max(-max, Math.min(point, max));
    }
    const total   = -point*2;
    const percent = Math.round((100*point)/window.innerWidth);

    // подсказки и сдвиг «фиксера»
    document.querySelector('.hints__right span').textContent = 50 - percent;
    document.querySelector('.hints__left span').textContent  = 50 + percent;
    document.querySelector('.fixer__gray-image').style.width = `calc(200% + ${total}px)`;
    document.querySelector('.fixer__gray').style.width       = `calc(50% + ${point}px)`;

    // сам ползунок и разделитель
    this.btn.style.left                              = `calc(50% - 20px + ${point}px)`;
    document.querySelector('.manager__active').style.width = `calc(50% + ${point}px)`;
    document.querySelector('.manager__divider').style.left = `calc(50% + ${point}px)`;

    // ←— единый цикл: обрезаем logo, content и menu-icon
    this.sliderPairs.forEach(({ leftSelector, rightSelector }) => {
      document.querySelectorAll(leftSelector).forEach(el => {
        el.style.width = `${percent}%`;
      });
      document.querySelectorAll(rightSelector).forEach(el => {
        el.style.width = `${100 - percent}%`;
      });
    });

    // сохранение
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

// loader, info-overlay инициализация — без изменений
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loading');
  fetch('/assets/data/loader.json')
    .then(res => res.json())
    .then(data => {
      const idx = Math.floor(Math.random()*data.length);
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

window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loaderOverlay');
    loader.classList.add('hidden');
    loader.addEventListener('transitionend', () => {
      document.body.classList.remove('loading');
      const info = document.getElementById('infoOverlay');
      if (!localStorage.getItem('infoDismissed')) {
        info.classList.remove('hidden');
        document.getElementById('infoOk').addEventListener('click', () => {
          localStorage.setItem('infoDismissed','true');
          info.classList.add('hidden');
        });
      }
      new ContentSplitter().animateToSavedPercent();
    },{ once:true });
  }, 5000);
});
