import { ref } from 'vue'
import type { Ref } from 'vue'
import Drawer from '@/map/Drawer'
import { POIType } from '@/enum'
import API from '@/API/index'

class MAPTORIUMDRAWERPANEL {
  private _polygon = ref(false)
  private _polyline = ref(false)
  private _square = ref(false)
  private _visible = ref(false)
  private _distance: Ref<Array<number>> = ref([])

  constructor() {}
  public get distance() {
    return this._distance
  }

  public get polygon() {
    return this._polygon
  }
  public get polyline() {
    return this._polyline
  }
  public get square() {
    return this._square
  }

  public get visible() {
    return this._visible
  }
  public show(type: POIType) {
    this._visible.value = true
    switch (type) {
      case POIType.polygon:
        this._polygon.value = true
        break
      case POIType.polyline:
        this._polyline.value = true
        break
      case POIType.square:
        this._square.value = true
        break
    }
    Drawer.start(type)
    this._distance.value = Drawer.distance.value
  }

  public hide() {
    this._square.value = this._polygon.value = this._polyline.value = this._visible.value = false
    Drawer.stop()
  }

  public async save() {
    const POI = Drawer.save()
    if (await API.POI.Add(POI)) this.hide()
  }
}

const DrawerPanel = new MAPTORIUMDRAWERPANEL()
export default DrawerPanel
