//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM enums
//----------------------------------------------------------------------------------------------------------------------
import { ManagerItemType, POIEvents, POIType } from '@/enum'
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM interfaces
//----------------------------------------------------------------------------------------------------------------------
import type { POIInfo, GPSCoords, ManagerList, SelectItem, CategoryItem } from '@/interface'
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM CLASS to get data from Server
//----------------------------------------------------------------------------------------------------------------------
import request from './ajax'
//----------------------------------------------------------------------------------------------------------------------
//VUE imports
//----------------------------------------------------------------------------------------------------------------------
import type { Ref } from 'vue'
import { ref } from 'vue'
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM help functions
//----------------------------------------------------------------------------------------------------------------------
import { pushParrent } from '@/helpers/common'
import inputModal, { inputConfirm } from '@/API/Swal'
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM LANGUAGE CLASS
//----------------------------------------------------------------------------------------------------------------------
import Lang from '@/lang/index'
import inputModalNew, { ModalsList } from '@/API/Modals'
import Alerts from '@/alerts'
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM CLASS to get/add/edit/delete POI from server
//----------------------------------------------------------------------------------------------------------------------
class MAPTORIUMPOI {
  private _callbacks: { [id: string]: CallableFunction } = {}
  private _categoryList: Ref<Array<SelectItem>> = ref([])

  private _poiID: Ref<number> = ref(0)
  private _poiCoords: GPSCoords = { lat: 0, lng: 0 }
  private _poiType: Ref<POIType> = ref(POIType.point)
  private _managerList: Ref<Array<ManagerList>> = ref([])
  private _poiList: Array<POIInfo> | null = null
  public show: Ref<boolean> = ref(false)

  /**
   * Update POI list from Server
   */
  public async List(force: boolean = false) {
    if (this._poiList == null || force) {
      this._poiList = []
      const poiList = (await request('/poi', {}, 'get')) as Array<POIInfo> | false
      if (poiList) {
        this._poiList = poiList
        for (let i = 0; i < poiList.length; i++) {
          const poiInfo = poiList[i]
          this._drawPoi(poiInfo.ID, poiInfo)
        }
      } else {
        this._poiList = null
      }
    }
    return
  }
  /**
   * Update Category list from Server
   */
  public async Category(force: boolean = false) {
    const categoryList = (await request('/poi/category', {}, 'get')) as Array<ManagerList> | false
    if (categoryList) {
      this._managerList.value = []
      this._categoryList.value = []
      categoryList.forEach((item) => {
        this._insertCategoryToList(item)
        this._categoryList.value.push({ title: item.name, value: item.ID })
      })
    }
    await this.List(force)
    this._poiList?.forEach((item) => {
      this._insertPOIToList(item)
    })
  }
  public get categoryList() {
    return this._categoryList
  }
  /**
   * Add category
   */
  public async CategoryAdd(parentID: number = 0) {
    const name = (await inputModal(Lang.value.TXT_CATEGORY_ADD)) as false | string
    if (name) {
      const result = (await request(`/poi/category/add`, { name, parentID }, 'post', true)) as
        | { ID: number }
        | false
      if (result && result?.ID > 0) {
        const catInfo: ManagerList = {
          ID: result.ID,
          name: name,
          parentID: parentID,
          type: ManagerItemType.folder,
          order: 0
        }
        this._insertCategoryToList(catInfo)
        this._categoryList.value.push({ title: name, value: result.ID })
      }
    }
  }

  public async CategoryDelete(ID: number) {
    if (await inputConfirm()) {
      if (await await request(`/poi/category/delete`, { ID }, 'post', true)) {
        this.Category()
        let delIndex: null | number = null
        this._categoryList.value.forEach((item, index) => {
          if (item.value == ID) delIndex = index
        })
        if (delIndex != null) this._categoryList.value.splice(delIndex, 1)
      }
    }
  }

  public async CategoryEdit(ID: number) {
    const result = (await request(`/poi/category/${ID}`, {}, 'get')) as false | CategoryItem
    if (result) {
      const categoryInfo = (await inputModalNew(ModalsList.CategoryConfig, result)) as
        | CategoryItem
        | false
      if (categoryInfo) {
        if (categoryInfo.parentID == ID) {
          Alerts.error(Lang.value.ERR_CATEGORY_WRONG_PARRENT)
          return false
        }
        if (
          (await request(
            '/poi/category/update',
            { ...categoryInfo, ID: ID },
            'post',
            true
          )) as boolean
        ) {
          this.Category()
        }
      }
    }
  }

  /**
   * Delete POI from server
   */
  public async Delete(ID: number = 0) {
    if (await inputConfirm()) {
      const poiID = ID || this._poiID.value
      if (poiID > 0) {
        if (await request('/poi/delete', { ID: poiID }, 'post', true)) {
          this._fire(POIEvents.delete, poiID)
          this.Category(true)
        }
        this._poiID.value = 0
      }
    }
  }

  public async Add(poiInfo: POIInfo | null, drawOnMap: boolean = true) {
    if (poiInfo) {
      let result: { ID: number } | false = false
      //If point, get current coords from mouse event
      if (poiInfo.type == POIType.point) {
        poiInfo.points = [this._poiCoords]
        //Draw on map new POI with new ID
        result = (await request('/poi/addMark', poiInfo, 'post', true)) as { ID: number } | false
      } else {
        //Send POI info to server
        result = (await request('/poi/add', poiInfo, 'post', true)) as { ID: number } | false
      }
      //If inserted in DB
      if (result && drawOnMap && result?.ID > 0) {
        //Draw on map new POI with new ID
        this._drawPoi(result.ID, poiInfo)
        this.Category(true)
        return result.ID
      }
      return 0
    }
  }

  public async Update(ID: number = 0): Promise<void> {
    if (ID) this._poiID.value = ID
    if (this._poiID.value > 0) {
      const result = (await request(`/poi/info/${this._poiID.value}`, {}, 'get')) as POIInfo | false
      if (result) {
        //await this.Info()
        const poiInfo = (await inputModalNew(ModalsList.POIConfig, result)) as false | POIInfo
        console.log('Update POI')
        if (poiInfo) {
          poiInfo.ID = this._poiID.value
          const result: Array<POIInfo> = await request('/poi/update', poiInfo, 'post', true)
          if (result) {
            this._fire(POIEvents.update, poiInfo)
            this.Category(true)
          }
        }
        this._poiID.value = 0
      }
    }
  }

  public async CachedMap(ID?: number) {
    if (ID) this._poiID.value = ID
    if (this._poiID.value > 0) {
      console.log('Cached map')
      const result = (await inputModalNew(ModalsList.CachedMap)) as
        | false
        | { mapID: string; zoom: number }
      if (result) {
        await request(
          '/map/cached/poi',
          { poiID: this._poiID.value, zoom: result.zoom, map: result.mapID },
          'post',
          false
        )
      }
    }
  }

  private _drawPoi(ID: number, poiInfo: POIInfo) {
    switch (poiInfo.type) {
      case POIType.polygon:
        this._fire(POIEvents.polygon, ID, poiInfo.points, {
          name: poiInfo.name,
          color: poiInfo.color,
          fillColor: poiInfo.fillColor,
          fillOpacity: poiInfo.fillOpacity,
          width: poiInfo.width
        })
        break
      case POIType.polyline:
        this._fire(POIEvents.polyline, ID, poiInfo.points, {
          name: poiInfo.name,
          color: poiInfo.color,
          width: poiInfo.width
        })
        break
      case POIType.point:
        this._fire(POIEvents.point, ID, poiInfo.points, {
          name: poiInfo.name
        })
        break
      default:
        console.log('Unknown POI type: ', poiInfo.type)
        break
    }
  }
  private _insertCategoryToList(item: ManagerList) {
    item.type = ManagerItemType.folder
    if (item.parentID == 0) {
      this._managerList.value.push(item)
    } else {
      pushParrent(this._managerList.value, item)
    }
  }
  private _insertPOIToList(item: POIInfo) {
    const poiInfo = {
      parentID: item.categoryID,
      name: item.name,
      type: ManagerItemType.item,
      ID: item.ID,
      order: 0
    }
    if (item.categoryID == 0) this._managerList.value.push(poiInfo)
    else pushParrent(this._managerList.value, poiInfo)
  }
  public on(event: POIEvents, callback: CallableFunction) {
    if (callback) {
      this._callbacks[event] = callback
    }
  }

  private _fire(event: POIEvents, data1?: any, data2?: any, data3?: any, data4?: any) {
    if (this._callbacks[event]) {
      this._callbacks[event](data1, data2, data3, data4)
    }
  }

  public get poiID() {
    return this._poiID.value
  }
  public set poiID(value: number) {
    this._poiID.value = value
  }
  public get poiCoords() {
    return this._poiCoords
  }
  public set poiCoords(value: GPSCoords) {
    this._poiCoords = value
  }
  public get poiType() {
    return this._poiType.value
  }
  public set poiType(value: POIType) {
    this._poiType.value = value
  }

  public get managerList() {
    return this._managerList
  }
}
//----------------------------------------------------------------------------------------------------------------------
//INIT new MAPTORIUM POI class
//----------------------------------------------------------------------------------------------------------------------
const POI = new MAPTORIUMPOI()
//----------------------------------------------------------------------------------------------------------------------
//EXPORT new MAPTORIUM POI class
//----------------------------------------------------------------------------------------------------------------------
export default POI
