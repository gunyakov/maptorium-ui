import { ref } from 'vue'
import { eLanguageList } from '@/enum'

import ru from './ru.json'
import en from './en.json'

const Lang = {
  ru,
  en
}

const Strings = ref(en)

export default Strings

export function setLang(lang: eLanguageList | string) {
  let langKey = eLanguageList.en
  if (lang == eLanguageList.ru) {
    langKey = eLanguageList.ru
  }

  Strings.value = Lang[langKey]
}
