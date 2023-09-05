import testRoutes from './test/test';
import { defineAsyncComponent } from 'vue'; //异步组挂载器
const routes = [
  {
    path: '/login',
    component: defineAsyncComponent(() => import('@/pages/login.vue')),
  },
  {
    path: '/:pathMatch(.*)*',
    component: defineAsyncComponent(() => import('@/pages/notFound.vue')),
  },
  testRoutes,
]; //end

export default routes;
