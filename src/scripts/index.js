// CSS imports
import '../styles/styles.css';
import 'leaflet/dist/leaflet.css'

import Camera from './utils/camera';
import App from './pages/app';
import { registerServiceWorker } from './utils';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerNavigation: document.getElementById('navigation-drawer'),
    drawerButton: document.getElementById('drawer-button'),
    skipLinkButton: document.getElementById('skip-link')
  });
  await app.renderPage();
  await registerServiceWorker();

  console.log('berhasil mendaftarkan service worker');

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
    
    Camera.stopAllStream();
  });
});
