//---------------------------------------------
//Wrapper for any alerts/popup windows
//---------------------------------------------
//@ts-ignore

export default class Alerts {
  constructor() {
    //@ts-ignore
    this.options = {
      position: 'top-end',
      icon: 'success',
      showConfirmButton: !1,
      timer: 1500
    }
  }

  static success(message: string) {
    //@ts-ignore
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: !1,
      timer: 1500
    })
  }

  static info(message: string) {
    //@ts-ignore
    Swal.fire({
      position: 'top-end',
      icon: 'info',
      title: message,
      showConfirmButton: !1,
      timer: 1500
    })
  }

  static warning(message: string) {
    //@ts-ignore
    Swal.fire({
      position: 'top-end',
      icon: 'warning',
      title: message,
      showConfirmButton: !1,
      timer: 1500
    })
  }

  static error(message: string) {
    //@ts-ignore
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: message,
      showConfirmButton: !1,
      timer: 1500
    })
  }
}
