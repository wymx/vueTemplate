import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes';
const router = createRouter({
  history: createWebHashHistory(), //可传参数，配置base路径，例如'/app'
  routes,
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  console.log(to, from, next);
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  // 可以增加更多的判读来处理路由跳转
  if (requiresAuth) {
    next('/login');
  } else {
    next();
  }
});

export default router;
