//---------------------------------------------
//Wrapper for any alerts/popup windows
//---------------------------------------------
import { Notify, Loading, Dialog, QSpinnerClock, QSpinnerTail } from 'quasar';
import { t } from 'src/i18n';

export default class Alerts {
  static _toast(
    message: string,
    type: 'positive' | 'negative' | 'warning' | 'info' | 'ongoing' = 'info',
  ) {
    Notify.create({
      message,
      type, // uses Quasar built-in colors (green, red, orange, blue, gray)
      timeout: 2500, // 2.5 seconds → auto-close
      actions: [], // no buttons at all
      position: 'bottom-right', // classic toast position (you can change to 'top', 'bottom', etc.)
      html: true, // if you need HTML inside the message
    });
  }
  constructor() {}

  static success(message: string) {
    this._toast(t(message), 'positive');
  }

  static info(message: string) {
    this._toast(t(message), 'info');
  }

  static warning(message: string) {
    this._toast(t(message), 'warning');
  }

  static error(message: string) {
    this._toast(t(message), 'negative');
  }

  static showLoading(message: string, spinnerClock: boolean = false) {
    Loading.show({
      message: t(message),
      boxClass: 'bg-grey-2 text-grey-9 text-bold',
      spinnerColor: 'teal-8',
      spinner: spinnerClock ? QSpinnerClock : QSpinnerTail,
    });
  }

  static hideLoading() {
    Loading.hide();
  }

  static showDialog(title: string, message: string) {
    Dialog.create({
      title: t(title),
      message: t(message),
      ok: {
        label: t('TXT_CLOSE'),
        color: 'primary',
      },
    });
  }
}
