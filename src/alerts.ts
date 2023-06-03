//---------------------------------------------
//Wrapper for any alerts/popup windows
//---------------------------------------------
//@ts-ignore

export default class Alerts {

    constructor() {
        //@ts-ignore
        this.options = {
            timeOut: 5000,
            progressBar: true,
            showMethod: "slideDown",
            hideMethod: "slideUp",
            showDuration: 200,
            hideDuration: 200,
            positionClass: "toast-top-center"
        };
    }

    static success(message:string) {
        //@ts-ignore
        alertify.success(message);
    }

    static info(message:string) {
        //@ts-ignore
        alertify.info(message);
    }

    static warning(message:string) {
        //@ts-ignore
        alertify.warning(message);
    }

    static error(message:string) {
        //@ts-ignore
        alertify.error(message);
    }
}