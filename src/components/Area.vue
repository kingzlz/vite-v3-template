<template>
  <div
    :style="{
      left: start.x + 'px',
      top: start.y + 'px',
      width: width + 'px',
      height: height + 'px'
    }"
    class="area"
  ></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Area',
  props: {
    start: {
      type: Object
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  }
})
</script>

<style scoped>
.area {
  border: 1px solid #70c0ff;
  position: absolute;
}
</style>
