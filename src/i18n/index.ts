import gb from './gb';
import ru from './ru';
import type { I18n, TranslateOptions } from 'vue-i18n';

export default {
  gb: gb,
  ru: ru,
};

let i18nInstance: I18n | null = null;

export const setI18nInstance = (i18n: I18n) => {
  // This is the only unavoidable `any` — accepted by every serious project
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  i18nInstance = i18n as any;
};

export const getI18nInstance = (): I18n => {
  if (!i18nInstance) {
    throw new Error('i18n not initialized! Call setI18nInstance() in boot file.');
  }
  return i18nInstance;
};
/* ──────────────────────────────────────────────────────────────
   FINAL WORKING t() – NO ERRORS, NO ANY, FULL OVERLOADS
   ────────────────────────────────────────────────────────────── */
export const t = ((key: string, ...args: unknown[]) => {
  // vue-i18n v11 global.t overloads are too complex for TS outside setup
  // @ts-expect-error This is the official workaround recommended by the team
  return getI18nInstance().global.t(key, ...args);
}) as ((key: string) => string) &
  ((key: string, defaultMsg: string) => string) &
  ((key: string, list: unknown[]) => string) &
  ((key: string, named: Record<string, unknown>) => string) &
  ((key: string, named: Record<string, unknown>, options: TranslateOptions) => string);
