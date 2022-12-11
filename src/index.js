import "./index.css";
import initDisplay from "./js/controllers/start-menu-controller";

(() => {
  function calculateVh() {
    const vh = window.innerHeight * 0.01;
    document.body.style.setProperty('--vh', `${vh}px`);
  }
  window.addEventListener('resize', calculateVh);
  window.addEventListener('orientationchange', calculateVh);

  calculateVh();
  initDisplay();
})();
