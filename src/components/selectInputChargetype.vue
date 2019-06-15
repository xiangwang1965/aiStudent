<template>
  <div class="selectInputChargetype">
    <el-select v-model="type" @change="selectType" :disabled="disabled" placeholder="请选择收费模式">
      <el-option v-for="everyType in typeList" v-if="everyType.charge_method_id === 1" :key="everyType.charge_method_id" :value="everyType.charge_method_id" :label="everyType.charge_method_name"></el-option>
    </el-select>
  </div>
</template>
<script>
  import receptionApi from '@/services/reception'
  export default {
    props: ['disabled'],
    data () {
      return {
        typeList: [],
        type: 1
      }
    },
    created () {
      this.getTypeList()
      console.log(this.config)
    },
    methods: {
      getTypeList () {
        receptionApi.getOptionsList().then(res => {
          this.typeList = res.data.charge_method
        })
      },
      selectType (val) {
        this.$emit('change', val)
      }
    }
  }
</script>
<style lang="less">
  .selectInputChargetype {
    display: inline-block;
  }
</style>
