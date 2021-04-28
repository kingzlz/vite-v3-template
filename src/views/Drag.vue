<template>
  <section class="center" id="section">
    <div class="content">
      <div class="editor" id="editor">
        <div class="text">正在移动:{{ boxName }}, 向 {{ second }}移动</div>
        <!-- 网格线 -->
        <svg class="grid" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="smallGrid"
              width="7.236328125"
              height="7.236328125"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 7.236328125 0 L 0 0 0 7.236328125"
                fill="none"
                stroke="rgba(207, 207, 207, 0.3)"
                stroke-width="1"
              ></path>
            </pattern>
            <pattern
              id="grid"
              width="36.181640625"
              height="36.181640625"
              patternUnits="userSpaceOnUse"
            >
              <rect width="36.181640625" height="36.181640625" fill="url(#smallGrid)"></rect>
              <path
                d="M 36.181640625 0 L 0 0 0 36.181640625"
                fill="none"
                stroke="rgba(186, 186, 186, 0.5)"
                stroke-width="1"
              ></path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"></rect>
        </svg>
        <div
          v-for="box in dataList"
          :key="box.id"
          :class="box.className"
          :id="box.id"
          @click="selectCurComponent"
          @mousedown="handleMouseDownOnShape"
        >
          {{ box.text }}
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, toRefs, ref } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Drag',
  setup() {
    const boxName = ref<string>('')
    const second = ref<string>('')
    const section = () => {
      return document.querySelector('#section')?.getBoundingClientRect() as DOMRect
    }
    const dataList = reactive([
      {
        text: '第一个盒子',
        className: 'box',
        id: 'box'
      },
      {
        text: '第二个盒子',
        className: 'box box-two',
        id: 'box-two'
      }
    ])
    const store = useStore()
    const reactiveData = reactive({
      curComponent: computed(() => store.state.curComponent),
      rect: computed(() => store.state.rect)
    })

    const selectCurComponent = (e: MouseEvent) => {
      // 阻止向父组件冒泡
      e.stopPropagation()
      e.preventDefault()
    }
    const handleMouseDownOnShape = (e: MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      const el = e.target as HTMLElement
      boxName.value = el.innerText
      // eslint-disable-next-line no-unused-expressions
      el.innerText === '第一个盒子' ? (second.value = '第二个盒子') : (second.value = '第一个盒子')
      const clientRect = el.getBoundingClientRect()
      store.commit('setCurComponentId', el.id)
      // store.commit('setRect', clientRect)
      const { left, top } = clientRect
      const pos: any = { left, top }
      const startY = e.clientY
      const startX = e.clientX
      // 如果直接修改属性，值的类型会变为字符串，所以要转为数值型
      const startTop = pos.top
      const startLeft = pos.left
      const { left: wrapperLeft, top: wrapperTop } = section()
      const move = (moveEvent: MouseEvent) => {
        const curX = moveEvent.clientX
        const curY = moveEvent.clientY
        pos.top = curY - startY + startTop - wrapperTop
        pos.left = curX - startX + startLeft - wrapperLeft
        store.commit('setShapeStyle', pos)
      }

      const up = () => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    }

    return {
      ...toRefs(reactiveData),
      dataList,
      handleMouseDownOnShape,
      boxName,
      second,
      section,
      selectCurComponent
    }
  }
})
</script>

<style scoped lang="stylus">
.editor {
  position: relative;
  background: #fff;
  margin: auto;
  width: 100%;
  height: 100%;
}

.center {
  margin-left: 100px;
  margin-right: 100px;
  background: #f5f5f5;
  height: 100%;
  overflow: auto;
  padding: 20px;
  box-sizing: border-box;

  .content {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}

.grid {
  position: absolute;
  top: 0;
  left: 0;
}

.box {
  width: 100px;
  height: 100px;
  position: absolute;
  border: 4px solid #ddd;
  text-align: center;
  line-height: 100px;
  left: 10px;
  top: 20px;
  user-select: none;
}

.box-two {
  width: 120px;
  height: 130px;
  position: absolute;
  border: 4px solid #ff3300;
  text-align: center;
  line-height: 130px;
  left: 100px;
  top: 200px;
  user-select: none;
}

.box:hover {
  cursor: move;
}
</style>
