import { Dialog } from 'quasar';
import type { PromptInputType } from 'quasar';
import { t } from 'src/i18n';

interface PromptOptions {
  type?: PromptInputType;
  model?: string;
  confirmOnly?: boolean;
  titleParams?: Record<string, unknown>;
  messageParams?: Record<string, unknown>;
}

export const usePrompt = () => {
  const run = async (titleKey: string, messageKey: string, options: PromptOptions = {}) => {
    return new Promise((resolve) => {
      const promptType: PromptInputType = options.type ?? 'text';
      const dialogConfig = {
        title: t(titleKey, options.titleParams ?? {}),
        message: t(messageKey, options.messageParams ?? {}),
        cancel: true,
        persistent: true,
      };

      const promptConfig = options.confirmOnly
        ? dialogConfig
        : {
            ...dialogConfig,
            prompt: {
              model: options.model ?? '',
              type: promptType,
            },
          };

      Dialog.create(promptConfig)
        .onOk((data) => {
          resolve(options.confirmOnly ? true : data);
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
