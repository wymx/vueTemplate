// import { log } from 'console';
// import { PageInfo } from '../domain/page-info';

/**
 * 公共头page模板有头部
 */
export const indexTemplate = (): string => {
  return `<template>
  <div>
  <router-view v-slot="{ Component, route }">
  <common-header v-show="!route.meta.hiddenHeader"></common-header>
  <Transition name="fade" mode="out-in">
    <component :is="Component" />
  </Transition>
  <common-footer v-show="!route.meta.hiddenFooter"></common-footer>
</router-view>
  </div>
</template>
<script setup lang="ts">
import CommonHeader from '@/components/CommonHeader.vue';
import CommonFooter from '@/components/CommonFooter.vue';
</script>
`;
};

/**
 * 公共头page模板无头部
 */
export const indexNHTemplate = (): string => {
  return `<template>
  <div>
    <router-view v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
</template>
<script setup lang="ts"></script>
`;
};

/**
 * vue页面
 */
export const pageTemplate = (lowCamelName: string): string => {
  return `<template>
  <div>${lowCamelName}页面</div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped></style>
`;
};

/**
 * api页面
 */
export const apiTemplate = (lowCamelName: string, upCamelName: string): string => {
  return `import request from '@/utils/request';
  import type { ${lowCamelName}Model } from './${lowCamelName}Model';
// get请求示例
export const get${upCamelName} = () => {
  return request.get<${lowCamelName}Model>('/xxx');
};
// post请求示例
export const post${upCamelName} = () => {
  return request.post<${lowCamelName}Model>('/xxx');
};`;
};

/**
 * model页面
 */
export const modelTemplate = (lowCamelName: string): string => {
  return `//定义参数或model
  export interface ${lowCamelName}Model {
    code: number;
    data: object;
  }`;
};

/**
 * 路由页面
 */
export const routerTemplate = (lowCamelName: string, subArray: Array<string>): string => {
  let childrens = `{
    path: '/${lowCamelName}',
    component: () => import('@/pages/${lowCamelName}/${lowCamelName}.vue'),
  },`;

  for (let i = 0; i < subArray.length; i++) {
    const item = subArray[i];
    const itemStr = `{
      path: '/${lowCamelName}/${item}',
      component: defineAsyncComponent(() => import('@/pages/${lowCamelName}/${item}/${item}.vue')),
      meta: {
        requiresAuth: true,
      },
    },`;
    childrens = childrens + itemStr;
  }

  return `import { defineAsyncComponent } from 'vue'; //异步组挂载器
  const ${lowCamelName}Routes = {
    path: '/${lowCamelName}',
    component: defineAsyncComponent(() => import('@/pages/${lowCamelName}/index.vue')),
    children: [${childrens}],
  };
  
  export default ${lowCamelName}Routes;
`;
};
