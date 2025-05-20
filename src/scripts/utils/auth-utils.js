import { getActiveRoute } from "../routes/url-parser";
import CONFIG from "../config";

export function getAccessToken(){
    try{
        const keyToken = localStorage.getItem(CONFIG.ACCESS_TOKEN);
        if(keyToken === 'null' || keyToken === 'undefined'){
            return null;
        }
        return keyToken;
    }catch(e){
        console.error('getAccessToken: error:', error);
        return null;
    }
}

export function putAccessToken(keyToken){
    try{
        localStorage.setItem(CONFIG.ACCESS_TOKEN, keyToken);
        return true;
    }catch(e){
        console.error('putAccessToken: error:', error);
        return false;
    }
}

export function removeAccessToken() {
    try {
        localStorage.removeItem(CONFIG.ACCESS_TOKEN);
        return true;
    } catch (error) {
        console.error('getLogout: error:', error);
        return false;
    }
}

const unAuthenticatedRoute = ['/login', '/register'];

export function checkUnauthenticatedRoute(page) {
  const url = getActiveRoute();
  const isLogin = !!getAccessToken();
  if (['/login', '/register'].includes(url) && isLogin) {
    location.hash = '/';
    // Kembalikan halaman placeholder
    return {
      render: () => '<p>Sudah login, mengalihkan ke beranda...</p>',
      afterRender: () => {}
    };
  }
  return page;
}


export function checkAuthenticatedRoute(page) {
    const isLogin = !!getAccessToken();
    if (!isLogin) {
        location.hash = '/login';
    // Kembalikan halaman placeholder agar tidak return null
        return {
        render: () => '<p>Mengalihkan ke login...</p>',
        afterRender: () => {}
        };
    }
    return page;
}

export function getLogout(){
    removeAccessToken();
}
