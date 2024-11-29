import { App, VNode } from 'vue';
import './index.less';
import Toast from './index.vue';
const ToastLayoutID = 'tequila-toast-layout';

export interface TequilaToastProps {
  id: string;
  title?: string;
  content?: string;
  closeIcon?: boolean;
  action?: string | VNode;
  actionClose?: boolean;
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

let TequilaAppInstance: App | null = null;
let toastsState = reactive<{ toasts: TequilaToastProps[] }>({ toasts: [] });

const mergeWithDefaults = (props: Omit<TequilaToastProps, 'id'>) => {
  return {
    ...props,
    type: props.type || 'default',
    closeIcon: props.closeIcon ?? true,
    duration: props.duration ?? 3000,
  };
};

const initializeToast = () => {
  let layout = document.querySelector(`#${ToastLayoutID}`);
  if (!layout) {
    const mountNode: HTMLElement = document.createElement('div');
    mountNode.id = ToastLayoutID;
    document.body.appendChild(mountNode);
    layout = mountNode;

    TequilaAppInstance = createApp(Toast, {
      ...toastsState,
    });
    TequilaAppInstance.mount(layout);
  }
};

export const toast = (props: Omit<TequilaToastProps, 'id'>) => {
  initializeToast();

  const newToast: TequilaToastProps = {
    id: 'toast-' + Date.now(),
    ...mergeWithDefaults(props),
  };

  toastsState.toasts.push(newToast);

  return newToast.id;
};

export const removeToast = (id: string) => {
  const index = toastsState.toasts.findIndex((item) => item.id === id);
  if (index > -1) toastsState.toasts.splice(index, 1);
};

