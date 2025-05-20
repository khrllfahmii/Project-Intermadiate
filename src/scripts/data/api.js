import CONFIG from '../config';
import { getAccessToken } from '../utils/auth-utils';

const ENDPOINTS = {
  REGIS: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  GETSTORY: `${CONFIG.BASE_URL}/stories`,
  ADDSTORY: `${CONFIG.BASE_URL}/stories`,
  DETAIL: (id) =>`${CONFIG.BASE_URL}/stories/${id}`,
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

export async function getRegis({ name, email, password}) {
  const data = JSON.stringify({ name, email, password});

  const fetchResponse = await fetch(ENDPOINTS.REGIS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });

  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  }
}


export async function getLogin({ email, password }) {
  const response = JSON.stringify({ email, password });

  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: response,
  });

  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  }
}


export async function getAllStory() {
  const access = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.GETSTORY, {
    headers: { Authorization: `Bearer ${access}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  }
}


export async function getDetailStory(id) {
  const access = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.DETAIL(id), {
    method: 'GET',
    headers: { Authorization: `Bearer ${access}` },    
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse,
  }
}


export async function addNewStory({
  desc, 
  img, 
  lat, 
  lon
}) {
  const access = getAccessToken();

  const dataBody = new FormData();
  dataBody.set('description', desc);
  dataBody.append('photo', img);
  dataBody.set('lat', lat);
  dataBody.set('lon', lon);

  const fetchResponse = await fetch(ENDPOINTS.ADDSTORY, {
    method: 'POST',
    headers: { Authorization: `Bearer ${access}` },
    body: dataBody,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  }
}

export async function subscribePushNotification({endpoint, keys: {p256dh, auth}}) {
  const access = getAccessToken();
  const data = JSON.stringify({ endpoint, keys: { p256dh, auth } });

  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function unSubscribePushNotification({endpoint}) {
  const access = getAccessToken();
  const data = JSON.stringify({ endpoint });

  const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}