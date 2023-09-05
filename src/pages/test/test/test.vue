<template>
  <div style="width: 100%">
    test页面123123
    <div @click="toastClick">点击</div>
  </div>
</template>
<script setup lang="ts">
import { getCurrentInstance } from 'vue';

const instance = getCurrentInstance();

function toastClick() {
  // instance?.proxy?.$toast.show('提示信息');
  instance?.proxy?.$toast.show('111');
}
</script>
<style lang="scss" scoped></style>
