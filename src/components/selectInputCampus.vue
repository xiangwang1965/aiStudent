<template>
  <div class="selectInputCampus">
    <el-select v-model="campus_id" @change="selectCampus" placeholder="请选择校区">
      <el-option v-for="campus in campusList" :key="campus.id" :value="campus.id" :label="campus.name"></el-option>
    </el-select>
  </div>
</template>
<script>
  import staffApi from '@/services/internal/staff'
  export default {
    data () {
      return {
        campusList: [],
        campus_id: ''
      }
    },
    created () {
      this.getCampusList()
      console.log(this.config)
    },
    methods: {
      getCampusList () {
        staffApi.getCampusList({status: 1}).then(res => {
          this.campusList = res
        })
      },
      selectCampus (val) {
        this.$emit('change', val)
      }
    }
  }
</script>
<style lang="less">
.selectInputCampus {
  display: inline-block;
}
</style>
