import { nextTick, ref, type Ref } from 'vue'
import Lang from '@/lang'

export enum ModalsList {
  POIConfig = 'POIConfig',
  CategoryConfig = 'CategoryConfig',
  CachedMap = 'CachedMap',
  DistanceToGO = 'DistanceToGo',
  GPSConfig = 'GPSConfig'
}
class MAPTORIUMMODALS {
  private _callback: CallableFunction | null = null
  private _modalTitle: Ref<string> = ref('')
  private _modalKey: Ref<ModalsList | null> = ref(null)
  private _defaults: Ref<object | null> = ref({})
  private _modal = null

  public async show(modalName: ModalsList, defaults?: any) {
    if (!this._modal) {
      //@ts-ignore
      this._modal = new bootstrap.Modal('#mapModal', {
        keyboard: false
      })
    }
    this._modalKey.value = modalName
    this._defaults.value = null
    if (modalName == ModalsList.CategoryConfig)
      this._modalTitle.value = Lang.value.TXT_CATEGORY_EDIT
    if (modalName == ModalsList.POIConfig) this._modalTitle.value = Lang.value.TXT_PROPERTIES_POI
    if (modalName == ModalsList.CachedMap) this._modalTitle.value = Lang.value.TXT_CACHED_MAP
    if (modalName == ModalsList.DistanceToGO)
      this._modalTitle.value = Lang.value.TXT_GPS_DISTANCE_GO
    if (modalName == ModalsList.GPSConfig) this._modalTitle.value = Lang.value.TXT_GPS_MODAL_TITLE
    await nextTick()
    if (defaults) this._defaults.value = defaults
    await nextTick()
    //@ts-ignore
    this._modal.show()
  }
  public hide(data: false | object) {
    //@ts-ignore
    this._modal.hide()
    if (this._callback) this._callback(data)
  }
  public onClose(callback: CallableFunction) {
    if (callback) this._callback = callback
  }

  public get modalTitle() {
    return this._modalTitle
  }

  public get modalKey() {
    return this._modalKey
  }

  public get defaults() {
    return this._defaults
  }
}

export const Modals = new MAPTORIUMMODALS()

export default function inputModal(modalName: ModalsList, defaults?: any) {
  return new Promise((resolve) => {
    Modals.show(modalName, defaults)
    Modals.onClose((data: false | object) => {
      resolve(data)
    })
  })
}
