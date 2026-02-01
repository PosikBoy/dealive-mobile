import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

import { en } from './en';
import { ru } from './ru';

const i18n = new I18n({
  ru,
  en,
});

i18n.enableFallback = true;
i18n.locale = Localization.getLocales()[0]?.languageCode ?? 'en';

export const t = i18n.t.bind(i18n);
