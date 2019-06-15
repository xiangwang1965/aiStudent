import eventHub from '@/utils/eventHub'

export function open (name, params) {
  eventHub.$emit('openDialog', name, params)
}

export function close (name) {
  eventHub.$emit('closeDialog', name)
}

// 弹框公共api，放在 vue 实例上
export default {
  open,
  close
}
