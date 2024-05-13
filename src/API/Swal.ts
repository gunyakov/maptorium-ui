import Lang from '@/lang/index'

function inputModal(title: String) {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: title,
      input: 'text',
      showCancelButton: !0,
      confirmButtonText: Lang.value.BTN_SUBMIT,
      cancelButtonText: Lang.value.BTN_CANCEL,
      showLoaderOnConfirm: !0,
      confirmButtonClass: 'btn btn-sm btn-primary',
      cancelButtonClass: 'btn btn-sm btn-danger',
      buttonsStyling: !1,
      showCloseButton: !0,
      closeButtonHtml: "<i class='fa-light fa-xmark'></i>",
      customClass: {
        closeButton: 'btn btn-sm btn-icon btn-danger',
        input: 'form-control form-control-sm'
      },
      // preConfirm: function (n) {
      //   return new Promise(function (t, e) {
      //     setTimeout(function () {
      //       'taken@example.com' === n ? e('This email is already taken.') : t()
      //     }, 2e3)
      //   })
      // },
      allowOutsideClick: !1
    }).then(function (t) {
      if (t.value) {
        resolve(t.value)
      } else {
        resolve(false)
      }
    })
  })
}

export default inputModal

export function inputConfirm() {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: Lang.value.TXT_CONFIRM_TITLE,
      text: Lang.value.TXT_CONFIRM_TEXT,
      icon: 'warning',
      showCancelButton: !0,
      confirmButtonColor: '#2ab57d',
      cancelButtonColor: '#fd625e',
      confirmButtonText: Lang.value.BTN_CONFIRM_DELETE,
      cancelButtonText: Lang.value.BTN_CANCEL
    }).then(function (e) {
      if (e.value) resolve(true)
      else resolve(false)
    })
  })
}
