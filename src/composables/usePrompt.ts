import { Dialog } from 'quasar';
import { t } from 'src/i18n';

export const usePrompt = () => {
  const run = async (titleKey: string, messageKey: string) => {
    return new Promise((resolve) => {
      Dialog.create({
        title: t(titleKey),
        message: t(messageKey),
        prompt: {
          model: '',
          type: 'text',
        },
        cancel: true,
        persistent: true,
      })
        .onOk((data) => {
          resolve(data);
        })
        .onCancel(() => {
          resolve(false);
        })
        .onDismiss(() => {
          resolve(false);
        });
    });
  };

  return run;
};

//-------------------------------------------------------------------------
// Export the type of the store instance
//-------------------------------------------------------------------------
export type Prompt = ReturnType<typeof usePrompt>;
