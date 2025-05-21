// style.js ➔ ES6 OOP, Vanilla JS
class ContentSplitter {
  constructor() {
    this.point = 0;
    this.btn = document.querySelector('.manager__js-btn');
    this.hammer = new Hammer(this.btn);
    this.leftLogo  = document.querySelector('.logo__images__left .logo__image');
    this.rightLogo = document.querySelector('.logo__images__right .logo__image');
    // English comment: cache logo containers for width control
    this.leftLogoContainer  = document.querySelector('.logo__images__left');
    this.rightLogoContainer = document.querySelector('.logo__images__right');

    this.init();
  }

  init() {
    window.addEventListener('load', () => this.updateHeight());
    window.addEventListener('resize', () => this.updateHeight());
    this.hammer.on('pan', ev => {
      this.point = ev.center.x - window.innerWidth / 2 + 9;
      this.move(this.point);
    });
    window.addEventListener('resize', () => {
      if (!this.isMobile()) this.move(0);
    });
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  updateHeight() {
    document.querySelectorAll('.content').forEach(content => {
      let totalHeight = 0;
      const headings = content.querySelectorAll('.line-wrap h3');
      headings.forEach(h3 => totalHeight += h3.offsetHeight);
      headings.forEach(h3 => h3.style.height = `${totalHeight}px`);
    });
    if (!this.isMobile()) this.move(0);
  }

  move(point) {
    const vw = window.innerWidth / 100;
    const max = (100 * vw - 29.4 * vw - 85) / 2;
    if (window.innerWidth >= 750) {
      if (point < -max) point = -max;
      if (point > max) point = max;
    }

    const reversable = -point;
    const total = reversable * 2;
    const percent = Math.round((100 * point) / window.innerWidth);

    document.querySelector('.hints__right span').textContent = 50 - percent;
    document.querySelector('.hints__left span').textContent = 50 + percent;
    document.querySelector('.fixer__gray-image').style.width = `calc(200% + ${total}px)`;
    document.querySelector('.fixer__gray').style.width = `calc(50% + ${point}px)`;
    this.btn.style.left = `calc(50% - 20px + ${point}px)`;
    document.querySelector('.manager__active').style.width = `calc(50% + ${point}px)`;
    document.querySelector('.manager__divider').style.left = `calc(50% + ${point}px)`;
    document.querySelector('.content__left').style.width = `calc(50% + ${point}px)`;
    document.querySelector('.content__right').style.width = `calc(50% - ${point}px)`;
    const ratio = point / (window.innerWidth / 2);
    const shift = (window.innerWidth / 2) * 0.1;
    // English comment: sync logo halves with content visibility
    this.leftLogoContainer.style.width  = percent + '%';
    this.rightLogoContainer.style.width = (100 - percent) + '%';
  }
}

document.addEventListener('DOMContentLoaded', () => new ContentSplitter());

// hat.js ➔ ES6 OOP, Vanilla JS
class LogoController {
  constructor() {
    this.minSize = 50;
    this.el = document.querySelector('.logo__images');
    this.page = document.documentElement;
    this.height = {
      el: this.el.offsetHeight - this.minSize,
      page: 500
    };
    this.init();
  }

  init() {
    document.addEventListener('scroll', () => this.onScroll());
    const toggles = document.querySelectorAll('.logo_menu, .main__menu--close');
    toggles.forEach(btn => {
      btn.addEventListener('click', event => {
        event.preventDefault();
        this.toggleMenu();
      });
    });
  }

  onScroll() {
    const scrollTop = this.page.scrollTop;
    if (scrollTop >= this.height.page) return;
    const percent = this.height.page / scrollTop;
    const value = this.height.el / percent;
    this.el.style.height = `${this.height.el - value + this.minSize}px`;
  }

  toggleMenu() {
    document.querySelector('.main__menu').classList.toggle('menu__no__active');
    document.body.classList.toggle('menu__active');
  }
}

document.addEventListener('DOMContentLoaded', () => new LogoController());