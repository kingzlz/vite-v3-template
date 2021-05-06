<template>
  <section class="center" id="section">
    <div class="content">
      <div class="editor" id="editor">
        <div class="text">正在移动:{{ boxName }}, 向 {{ second }}移动, {{ msg }}</div>
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
          :data-id="box.otherId"
          @click="selectCurComponent"
          @mousedown="handleMouseDownOnShape"
        >
          {{ box.text }}
        </div>
        <button class="btn" @click="dialogVisible = true">两个图形相交参考</button>
      </div>
    </div>
    <el-dialog title="提示" v-model="dialogVisible" width="800">
      <div>参考https://github.com/francecil/leetcode/issues/1</div>
      <pre>
        const isOverlap = (rect1, rect2) => {
          const l1 = { x: rect1.x, y: rect1.y }
          const r1 = { x: rect1.x + rect1.width, y: rect1.y + rect1.height }
          const l2 = { x: rect2.x, y: rect2.y }
          const r2 = { x: rect2.x + rect2.width, y: rect2.y + rect2.height }
          if (
            l1.x > r2.x ||
            l2.x > r1.x ||
            l1.y > r2.y ||
            l2.y > r1.y
          ) return false
          return true
        }

  </pre
      >
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, toRefs, ref } from 'vue'
import { useStore } from 'vuex'

export interface React {
  [key: string]: any
  x: number
  y: number
  width: number
  height: number
}

export default defineComponent({
  name: 'Drag',
  setup() {
    const boxName = ref<string>('')
    const second = ref<string>('')
    const msg = ref<string>('')
    const dialogVisible = ref<boolean>(false)
    const section = () => {
      return document.querySelector('#section')?.getBoundingClientRect() as DOMRect
    }
    const dataList = reactive([
      {
        text: '第一个盒子',
        className: 'box',
        id: 'box',
        otherId: 'box-two'
      },
      {
        text: '第二个盒子',
        className: 'box box-two',
        id: 'box-two',
        otherId: 'box'
      }
    ])
    const store = useStore()
    const reactiveData = reactive({
      curComponent: computed(() => store.state.curComponent),
      rect: computed(() => store.state.rect)
    })
    const isOverlap = (rect1: React, rect2: React) => {
      const l1 = { x: rect1.x, y: rect1.y }
      const r1 = { x: rect1.x + rect1.width, y: rect1.y + rect1.height }
      const l2 = { x: rect2.x, y: rect2.y }
      const r2 = { x: rect2.x + rect2.width, y: rect2.y + rect2.height }
      if (l1.x > r2.x || l2.x > r1.x || l1.y > r2.y || l2.y > r1.y) return false
      return true
    }
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
      const elementClass = el.classList
      // eslint-disable-next-line no-unused-expressions
      el.innerText === '第一个盒子' ? (second.value = '第二个盒子') : (second.value = '第一个盒子')
      elementClass.add('active')
      const clientRect = el.getBoundingClientRect()
      store.commit('setCurComponentId', el.id)
      const otherId = el.getAttribute('data-id')
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
        const currentBoxRect = el.getBoundingClientRect()
        const otherBoxRect = (document.querySelector(
          `#${otherId}`
        ) as HTMLElement).getBoundingClientRect()

        msg.value = isOverlap(currentBoxRect, otherBoxRect) ? '相交了' : ''

        const curX = moveEvent.clientX
        const curY = moveEvent.clientY
        pos.top = curY - startY + startTop - wrapperTop
        pos.left = curX - startX + startLeft - wrapperLeft
        store.commit('setShapeStyle', pos)
      }

      const up = () => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
        elementClass.remove('active')
        msg.value = ''
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    }

    return {
      ...toRefs(reactiveData),
      dataList,
      isOverlap,
      handleMouseDownOnShape,
      boxName,
      msg,
      second,
      section,
      dialogVisible,
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

.btn {
  position: absolute;
  right: 0;
  z-index: 100;
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
  width: 240px;
  height: 240px;
  position: absolute;
  border: 4px solid #ddd;
  text-align: center;
  line-height: 130px;
  left: 100px;
  top: 200px;
  user-select: none;
}

.active {
  border: 4px solid #f30;
}

.box:hover {
  cursor: move;
}
</style>
