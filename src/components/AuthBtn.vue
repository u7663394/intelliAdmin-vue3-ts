<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

/**
 * withDefaults 给 props 设置默认值
 */
const props = withDefaults(
  defineProps<{
    btnPerm?: string
  }>(),
  {
    btnPerm: '',
  },
)

/**
 * 通过判断权限来决定是否显示元素
 */
const isShow = computed(() => {
  const userStore = useUserStore()
  const perms = userStore.profile.permissions
  return perms.includes(props.btnPerm) || perms.includes('*:*:*')
})
</script>

<template>
  <slot v-if="isShow"></slot>
  <span v-else></span>
</template>
