<template>
  <div class="dialogsContainer">
    <el-dialog :title="dialog.title" v-for="(dialog,key) in dialogs" :key="dialog.key" :visible.sync="dialog.visible" :top="dialog.top" @close="closeDialog(key)">
      <component :name="key" :type="dialog.type" :is="dialog.component" :title="dialog.title" :params="currentParams"></component>
    </el-dialog>
  </div>
</template>

<script>
// 处理程序中所有的 dialog, 在本文件夹中新建vue文件并 import 放入components并配置相应数据即可
import classTypeChooseDialog from './classTypeChooseDialog'
export default {
  data () {
    return {
      dialogKey: Date.now(),
      currentParams: {},
      dialogs: {
        classTypeChooseDialog: { component: 'classTypeChooseDialog', title: '选择班级类型', visible: false, type: 'default', key: 'now' }
      }
    }
  },
  components: {
    classTypeChooseDialog
  },
  methods: {
    openDialog (name, params) {
      this.dialogs[`${name}Dialog`].visible = true
      this.currentParams = params || {}
    },
    closeDialog (name) {
      if (name.indexOf('Dialog') !== -1) {
        this.dialogs[name].visible = false
        this.dialogs[name].key = Date.now()
      } else {
        this.dialogs[`${name}Dialog`].visible = false
        this.dialogs[`${name}Dialog`].key = Date.now()
      }
    }
  },
  created () {
    this.$eventHub.$on('openDialog', (name, params) => {
      this.openDialog(name, params)
    })
    this.$eventHub.$on('closeDialog', name => {
      this.closeDialog(name)
    })
  }
}
</script>
