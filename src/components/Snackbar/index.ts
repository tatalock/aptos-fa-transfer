import { createApp, h } from 'vue';
import Snackbar from './index.vue';

let Instance: any = null;

export const snackbar = (text: string, options: any = {}) => {
  let box = document.querySelector('#notification-box');
  if (box) {
    Instance?.unmount();
    box?.remove();
  }

  const mountNode: HTMLElement = document.createElement('div');
  mountNode.id = 'notification-box';
  document.body.appendChild(mountNode);
  box = mountNode;

  Instance = createApp({
    render: () =>
      h(Snackbar, {
        text,
        show: true,
        timeout: 3000,
        ...options,
        onClose: () => {
          Instance.unmount();
          box?.remove();
        },
      }),
  });
  Instance.mount(box);
};

export const snackbarSuccess = (text: string, options: any = {}) => {
  snackbar(text, { type: 'success', ...options });
};

export const snackbarError = (text: string, options: any = {}) => {
  snackbar(text, { type: 'error', ...options });
};

