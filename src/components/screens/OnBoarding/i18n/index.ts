import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

import { en } from './en';
import { ru } from './ru';

type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

export type NestedKeys<T> = {
  [K in keyof T & string]: T[K] extends object ? `${K}${DotPrefix<NestedKeys<T[K]>>}` : K;
}[keyof T & string];

type TranslationKey = NestedKeys<typeof en>;

const i18n = new I18n({
  ru,
  en,
});

i18n.enableFallback = true;
i18n.locale = Localization.getLocales()[0]?.languageCode ?? 'en';

export const t = (key: TranslationKey, options?: Parameters<I18n['t']>[1]) => i18n.t(key, options);
