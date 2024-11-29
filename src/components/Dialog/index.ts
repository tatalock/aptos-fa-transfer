import { createApp, h } from 'vue';
import Dialog from './index.vue';

let Instance: any = null;

export const dialog = (options: any = {}) => {
  let box = document.querySelector('#dialog-box');
  if (box) {
    Instance?.unmount();
    box?.remove();
  }

  const mountNode: HTMLElement = document.createElement('div');
  mountNode.id = 'dialog-box';
  document.body.appendChild(mountNode);
  box = mountNode;

  Instance = createApp({
    render: () =>
      h(Dialog, {
        show: true,
        ...options,
        onClose: () => {
          Instance.unmount();
          box?.remove();
        },
      }),
  });
  Instance.mount(box);
};

