import { convertBase64ToUint8Array } from "./index";
import CONFIG from '../config';
import { subscribePushNotification, unSubscribePushNotification } from "../data/api";


const VAPID_PUBLIC_KEY = CONFIG.VAPID_PUBLIC_KEY;
export function generateSubscribeOptions(){
    return {
        userVisibleOnly: true,
        applicationServerKey: convertBase64ToUint8Array(VAPID_PUBLIC_KEY),
    }
}


export function isNotificationAvailable(){
    return 'Notification' in window;
}

export function isNotificationGranted(){
    return Notification.permission === 'granted';
}

export async function requestNotificationPermission(){
    if(!isNotificationAvailable()){
        console.log('Notification API not available');
        return false;
    }

    if(isNotificationGranted()) {
        return true;
    }

    const status = await Notification.requestPermission();
    if(status === 'denied'){
        alert('Notification di tolak');
        return false;
    }

    return true;
}

export async function getPushSubscription(){
    const registration = await navigator.serviceWorker.getRegistration();
    return await  registration.pushManager.getSubscription();
}

export async function isCurrentPushSubscriptionAvailable(){
    return !! (await getPushSubscription());
}

export async function subscribe(){
    if (!(await requestNotificationPermission())) {
        return;
    }

    if (await isCurrentPushSubscriptionAvailable()) {
        alert('Kamu sudah berlangganan notifikasi');
        return;
    }

    console.log('mulai subscribe');

    const failureSubscribeMessage = 'Langganan notifikasi gagal';
    const successSubscribeMessage = 'Langganan notifikasi berhasil';

    let pushSubscribtion;

    try{
        const registration = await navigator.serviceWorker.getRegistration();
        pushSubscribtion = await registration.pushManager.subscribe(generateSubscribeOptions());
        const {endpoint, keys} = pushSubscribtion.toJSON();
        const response = await subscribePushNotification({endpoint, keys});
        if(!response.ok){
            console.log('subscribe error', response);
            alert(failureSubscribeMessage);
            await pushSubscribtion.unsubscribe();
            return;
        }
        alert(successSubscribeMessage)
    }catch(e){
        console.log('subscribe error',e);
        alert(failureSubscribeMessage);
        await pushSubscribtion.unsubscribe();
    }
}

export async function unsubscribe() {
  const failureUnsubscribeMessage = 'Langganan push notification gagal dinonaktifkan.';
  const successUnsubscribeMessage = 'Langganan push notification berhasil dinonaktifkan.';
  try {
    const pushSubscription = await getPushSubscription();
    if (!pushSubscription) {
      alert('Tidak bisa memutus langganan push notification karena belum berlangganan sebelumnya.');
      return;
    }
    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await unSubscribePushNotification({ endpoint });
    if (!response.ok) {
      alert(failureUnsubscribeMessage);
      console.error('unsubscribe: response:', response);
      return;
    }
    const unsubscribed = await pushSubscription.unsubscribe();
    if (!unsubscribed) {
      alert(failureUnsubscribeMessage);
      await subscribePushNotification({ endpoint, keys });
      return;
    }
    alert(successUnsubscribeMessage);
  } catch (error) {
    alert(failureUnsubscribeMessage);
    console.error('unsubscribe: error:', error);
  }
}