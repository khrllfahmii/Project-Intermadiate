import homePage from '../pages/home/home-page.js';
import regisPage from '../pages/auth/regis/regis-page.js';
import loginPage from '../pages/auth/login/login-page.js';
import detailPage from '../pages/detail/detail-page.js';
import addPage from '../pages/add/add-page.js';
import bookmarkPage from '../pages/bookmark/bookmark-page.js';
import { checkAuthenticatedRoute, checkUnauthenticatedRoute } from '../utils/auth-utils.js';

const routes = {
  '/login' : () => checkUnauthenticatedRoute(new loginPage()),
  '/regis' : () => checkUnauthenticatedRoute(new regisPage()),
  
  '/' : () => checkAuthenticatedRoute(new homePage()),
  '/bookmark': () => checkAuthenticatedRoute(new bookmarkPage()),
  '/add': () => checkAuthenticatedRoute(new addPage()),
  '/story/:id': () => checkAuthenticatedRoute(new detailPage()),
};

export default routes;
