import { defineAsyncComponent } from 'vue'; //异步组挂载器
const testRoutes = {
  path: '/',
  component: defineAsyncComponent(() => import('@/pages/test/index.vue')),
  children: [
    {
      path: '/',
      component: () => import('@/pages/test/test/test.vue'),
    },
  ],
};

export default testRoutes;
