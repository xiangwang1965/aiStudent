<!-- 地区选择 -->
<template>
  <div id='areaComponent'>
    <el-select v-model="address.provice" filterable placeholder="请选择省" @change="selectCity">
      <el-option v-for="item in proviceOptions" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
    <el-select v-model="address.city" filterable placeholder="请选择市" @change="selectArea">
      <el-option v-for="item in cityOptions" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
    <el-select v-model="address.area" filterable placeholder="请选择区" @change="getAreaId">
      <el-option v-for="item in areaOptions" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import Area from '../../../static/area.json'
export default {
  data () {
    return {
      proviceOptions: [],
      cityOptions: [],
      areaOptions: []
    }
  },
  props: {
    address: Object
  },
  created () {
    this.getArea()
  },
  methods: {
    getArea () {
      this.proviceOptions = Area
    },
    // 获取城市
    selectCity (value) {
      this.cityOptions = {}
      this.areaOptions = {}
      this.$set(this.address, 'city', '')
      this.$set(this.address, 'area', '')
      this.proviceOptions.forEach(item => {
        if (item.id === value) {
          this.cityOptions = item.children
        }
      })
    },
    //  获取区
    selectArea (value) {
      this.areaOptions = {}
      this.$set(this.address, 'area', '')
      this.cityOptions.forEach(item => {
        if (item.id === value) {
          this.areaOptions = item.children
        }
      })
    },
    // hidden 校验
    getAreaId (value) {
      this.$emit('select', value)
    }
  }
}
</script>
<style scoped>

</style>
