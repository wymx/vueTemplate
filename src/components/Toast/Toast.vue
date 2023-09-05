<!-- 封装消息提示插件 -->
<template>
  <!-- <Transition
    enter-active-class="animate__animated animate__bounceInRight"
    leave-active-class="animate__animated animate__bounceOutRight"
  > -->
  <Transition enter-active-class="animate__animated" leave-active-class="animate__animated">
    <div v-if="isShow" class="message">{{ tipText }}</div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
let isShow = ref<boolean>(false);
let tipText = ref<string | number>('默认提示内容');
const show = (str: string | number, time = 3000) => {
  tipText.value = str;
  isShow.value = true;
  // 2 秒后自动关闭
  setTimeout(() => {
    isShow.value = false;
  }, time);
};
const hide = () => (isShow.value = false);
// 将组件内部的方法导出，方便外部访问
defineExpose({
  show,
  hide,
});
</script>

<style lang="scss" scoped>
.message {
  width: 124px;
  height: 36px;
  background: #000000;
  opacity: 0.7;
  border-radius: 2px;
  opacity: 0.7;
  font-size: 14px;
  font-family:
    PingFangSC-Regular,
    PingFang SC;
  font-weight: 400;
  color: #ffffff;
  text-align: center;
  line-height: 36px;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  margin: auto;
  z-index: 99999;
}
</style>
