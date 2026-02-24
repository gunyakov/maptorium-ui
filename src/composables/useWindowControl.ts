import Alerts from 'src/alerts';
export const useWindowControls = () => {
  function isElectronApp(): boolean {
    return !!window.appControls || navigator.userAgent.includes('Electron');
  }

  function minimize() {
    if (isElectronApp()) window.appControls?.minimize();
  }

  function toggleMaximize() {
    if (isElectronApp()) window.appControls?.toggleMaximize();
  }

  function closeApp() {
    Alerts.showLoading('txt.wait_exiting_app');
    if (isElectronApp()) window.appControls?.close();
  }
  return {
    minimize,
    toggleMaximize,
    closeApp,
  };
};

//-------------------------------------------------------------------------
// Export the type of the store instance
//-------------------------------------------------------------------------
export type WindowControls = ReturnType<typeof useWindowControls>;
