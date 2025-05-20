import routes from '../routes/routes.js';
import { getActiveRoute } from '../routes/url-parser.js';
import { generateAuthenticatedNavigationListTemplate, generateUnAuthenticatedNavigationListTemplate, generateSubscribeButtonTemplate, generateUnSubscribeButtonTemplate, generateNavigationListTemplate} from '../template';
import { isServiceWorkerAvailable, setupSkipToContent, transitionHelper } from '../utils';
import { getAccessToken, getLogout } from '../utils/auth-utils.js';
import { isCurrentPushSubscriptionAvailable,subscribe,unsubscribe} from '../utils/notification-utils.js';


class App {
  #content;
  #drawerButton;
  #drawerNavigation;
  #skipLinkButton;

  constructor({ content, drawerNavigation, drawerButton, skipLinkButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#drawerNavigation = drawerNavigation;
    this.#skipLinkButton = skipLinkButton;

    this.#init();
  }

  #init() {
    setupSkipToContent(this.#skipLinkButton, this.#content);
    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#drawerNavigation.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      const isTargetInsideDrawer = this.#drawerNavigation.contains(event.target);
      const isTargetInsideButton = this.#drawerButton.contains(event.target);

      if (!(isTargetInsideDrawer || isTargetInsideButton)) {
        this.#drawerNavigation.classList.remove('open');
      }

      this.#drawerNavigation.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#drawerNavigation.classList.remove('open');
        }
      });
    });
  }

#setupNavigationList() {
  const isLogin = !!getAccessToken();
  const navList = this.#drawerNavigation.querySelector('#navlist');
  const navListMain = this.#drawerNavigation.querySelector('#navlist-main');

  if (!navList || !navListMain) {
    console.warn('Navigation elements not found!');
    return;
  }

  if (!isLogin) {
    navList.innerHTML = generateUnAuthenticatedNavigationListTemplate();
    navListMain.innerHTML = ''; 
    return;
  }

  navListMain.innerHTML = generateNavigationListTemplate();
  navList.innerHTML = generateAuthenticatedNavigationListTemplate();

  const logoutButton = document.getElementById('logout-button');
  logoutButton.addEventListener('click', (event) => {
    event.preventDefault();

    if (confirm('Apakah Anda yakin ingin keluar?')) {
      getLogout();
      location.hash = '/login';
    }
  });
}


async #setupPushNotification() {

  const pushNotification = document.getElementById('push-notification-tools');
  if (!pushNotification) {
    console.warn('push-notification-tools element not found.');
    return;
  }

  const isSubscribe = await isCurrentPushSubscriptionAvailable();
  if (isSubscribe) {
    pushNotification.innerHTML = generateUnSubscribeButtonTemplate();
    document.getElementById('unsubscribe-button').addEventListener('click', () => {
      unsubscribe().finally(() => {
        this.#setupPushNotification();
      });
    });
    return;
  } else {
    pushNotification.innerHTML = generateSubscribeButtonTemplate();
    document.getElementById('subscribe-button').addEventListener('click', () => {
      subscribe().finally(() => {
        this.#setupPushNotification();
      });
    });
  }
}



async renderPage() {
  const url = getActiveRoute();
  let matchedRoute = null;
  let routeKey = null;

  // Cari route yang cocok
  for (const path in routes) {
    if (path.includes(':')) {
      // Konversi ke regex
      const regexPath = new RegExp('^' + path.replace(/:\w+/g, '[^/]+') + '$');
      if (regexPath.test(url)) {
        matchedRoute = routes[path];
        routeKey = path;
        break;
      }
    } else if (path === url) {
      matchedRoute = routes[path];
      routeKey = path;
      break;
    }
  }

  if (!matchedRoute || typeof matchedRoute !== 'function') {
    this.#content.innerHTML = '<p>Halaman tidak ditemukan.</p>';
    console.error(`Route tidak valid atau tidak ditemukan untuk: ${url}`);
    return;
  }

  let page = null;

  try {
    page = matchedRoute();
  } catch (err) {
    console.error(`Gagal memanggil route handler untuk: ${routeKey}`, err);
  }

  if (!page || typeof page.render !== 'function') {
    this.#content.innerHTML = '<p>Terjadi kesalahan saat memuat halaman.</p>';
    console.error(`Invalid page object for route: ${routeKey}`, page);
    return;
  }

  const transition = transitionHelper({
    updateDOM: async () => {
      try {
        const html = await page.render();
        this.#content.innerHTML = html;

        if (typeof page.afterRender === 'function') {
          await page.afterRender();
        }
      } catch (e) {
        console.error('Error during rendering page:', e);
        this.#content.innerHTML = '<p>Gagal menampilkan halaman.</p>';
      }
    }
  });

  transition.ready.catch((err) => {
    console.error('Transition failed:', err);
  });

  transition.updateCallbackDone.then(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    this.#setupNavigationList();
    if (isServiceWorkerAvailable()) {
      this.#setupPushNotification();
    }
  });
}
}

export default App;