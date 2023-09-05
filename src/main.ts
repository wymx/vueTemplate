import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index';
// 全局提示
import Toast from '@/components/Toast';

const app = createApp(App);

app.use(router); //注册路由

type Toast = {
  show: (str: string | number, time?: number) => void;
};
// 编写自定义插件的声明文件，防止报错，声明后也会有智能提示
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $toast: Toast;
  }
}
app.use(Toast);

app.mount('#app');
