<template>
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
