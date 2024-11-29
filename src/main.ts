import '@unocss/reset/tailwind.css';
import 'uno.css';

import '@/style.less';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router).mount('#app');

