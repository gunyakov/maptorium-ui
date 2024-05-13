import { ref, type Ref } from 'vue'

class MAPTORIUMMENUCONTEXT {
  private _showContext: Ref<boolean> = ref(false)
  private _x: Ref<number> = ref(0)
  private _y: Ref<number> = ref(0)

  public show(x: number, y: number) {
    this._showContext.value = true
    this._x.value = x
    this._y.value = y
  }
  public hide() {
    this._showContext.value = false
  }

  public get x() {
    return this._x.value
  }
  public get y() {
    return this._y.value
  }

  public get showContext() {
    return this._showContext.value
  }
}

const MenuContext = new MAPTORIUMMENUCONTEXT()

export default MenuContext
