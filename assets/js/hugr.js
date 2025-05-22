// style.js ➔ ES6 OOP, Vanilla JS
class ContentSplitter {
  constructor() {
    this.point = 0;
    this.btn = document.querySelector('.manager__js-btn');
    this.restoreSavedPercent();                     // Load saved slider position
    this.hammer = new Hammer(this.btn);
    this.leftLogo  = document.querySelector('.logo__images__left .logo__image');
    this.rightLogo = document.querySelector('.logo__images__right .logo__image');
    // English comment: cache logo containers for width control
    this.leftLogoContainer  = document.querySelector('.logo__images__left');
    this.rightLogoContainer = document.querySelector('.logo__images__right');

    this.init();
  }

  init() {
    window.addEventListener('load', () => {
      this.updateHeight();
      this.animateToSavedPercent();                // Animate to saved on page load
    });
    window.addEventListener('resize', () => {
      this.updateHeight();
      this.animateToSavedPercent();                // Animate to saved on resize
    });
    this.hammer.on('pan', ev => {
      this.point = ev.center.x - window.innerWidth / 2 + 9;
      this.move(this.point);
      this.saveCurrentPercent();                   // Save position on drag
    });
    window.addEventListener('resize', () => {
      if (!this.isMobile()) this.move(0);
    });
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      .test(navigator.userAgent);
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
      if (point > max)   point = max;
    }

    const reversable = -point;
    const total     = reversable * 2;
    const percent   = Math.round((100 * point) / window.innerWidth);

    document.querySelector('.hints__right span').textContent = 50 - percent;
    document.querySelector('.hints__left span').textContent  = 50 + percent;
    document.querySelector('.fixer__gray-image').style.width = `calc(200% + ${total}px)`;
    document.querySelector('.fixer__gray').style.width       = `calc(50% + ${point}px)`;
    this.btn.style.left                                    = `calc(50% - 20px + ${point}px)`;
    document.querySelector('.manager__active').style.width  = `calc(50% + ${point}px)`;
    document.querySelector('.manager__divider').style.left   = `calc(50% + ${point}px)`;
    document.querySelector('.content__left').style.width     = `calc(50% + ${point}px)`;
    document.querySelector('.content__right').style.width    = `calc(50% - ${point}px)`;
    this.leftLogoContainer.style.width                      = percent + '%';
    this.rightLogoContainer.style.width                     = (100 - percent) + '%';
  }

  // Save current slider percent in localStorage
  saveCurrentPercent() {
    const percent = Math.round((100 * this.point) / window.innerWidth);
    localStorage.setItem('vikingMythsSlider', percent);
  }

  // Restore saved percent from localStorage
  restoreSavedPercent() {
    const saved = parseFloat(localStorage.getItem('vikingMythsSlider'));
    this._savedPercent = isNaN(saved) ? null : saved;
  }

  // Animate slider back to saved percent (if any)
  animateToSavedPercent() {
    if (this._savedPercent === null) return;
    // Allow default reset to complete
    setTimeout(() => this.animateTo(this._savedPercent), 100);
  }

  // Convert percent to point and reuse move()
  animateTo(percent) {
    const point = (percent * window.innerWidth) / 100;
    this.move(point);
  }
}

document.addEventListener('DOMContentLoaded', () => new ContentSplitter());