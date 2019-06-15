<!-- 选取商品信息 -->
<template>
  <div class='imgPage'>
    <div class="images">
      <div class="images__item__wrap img" v-for="(item,index) in imgUrls" :key="index" @mouseover="showMask(item)" @mouseout="hideMask(item)">
        <div class="images__item__edit" v-show="item.maskVisible">
          <i class="el-icon-zoom-in" @click="enlarge(item)"></i>
          <i class="el-icon-delete" @click="doDelete(item,index)"></i>
        </div>
        <img class="images__item" :src="item.url">
      </div>
      <div class="images__item__wrap upload" v-if="imgUrls.length<1&&visible">
        <div class="upload__wrap">
          <i class="el-icon-plus"></i>
          <span>{{placeholder || '选择图片'}}</span>
        </div>
        <input type="file" class="upload__input" @change="addImg">
      </div>
      <el-dialog title="图片详情" :visible.sync="dialogTableVisible" style="height:100%;">
        <LargeImg :enlargeImgUrl="enlargeImgUrl"></LargeImg>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getObjectURL, deleteArray, RndNumber } from '@/utils'
import { readFileAsBase64 } from '@/utils/file'
import LargeImg from '@/components/platform/largeImg'
import PermissionApi from '@/services/permission'
export default {
  data () {
    return {
      imgUrls: [],
      enlargeImgUrl: '',
      dialogTableVisible: false,
      visible: true,
      access: {}
    }
  },
  // props: ['images', 'type', 'store', 'placeholder', 'role'],
  props: {
    images: { required: false },
    type: { required: false },
    store: { required: false },
    placeholder: { required: false },
    role: { required: false },
    size: { type: Number, default: 2 }
  },
  components: {
    LargeImg
  },
  mounted () {
    this.imgUrls = this.images
  },
  watch: {
    images () {
      this.imgUrls = this.images
    }
  },
  methods: {
    // 上传图像的格式
    beforeImgUpload (file) {
      const isIMG = file.type === 'image/jpeg' || file.type === 'image/png'
      // const isLt2M = file.size / 1024 / 1024 < 2
      const isLt2M = file.size / 1024 / 1024 < this.size
      if (!isIMG) {
        this.$message({
          type: 'warning',
          message: '上传图片必须是 JPG/PNG 格式',
          center: true
        })
      }
      if (!isLt2M) {
        this.$message({
          type: 'warning',
          // message: '上传图片大小不能超过 2MB',
          message: `上传图片大小不能超过 ${this.size}MB`,
          center: true
        })
      }
      return isIMG && isLt2M
    },
    // 上传图片到服务器
    addImg (e) {
      this.file = e.target.files[0]
      if (this.beforeImgUpload(this.file)) {
        var OSS = require('ali-oss')
        let params = {
          type: this.store
        }
        this.visible = false
        let loadingInstance = this.$loading({
          text: '上传图片中...'
        })
        // 上传图片之前取本地url
        this.imgUrls.push({
          type: this.type,
          url: getObjectURL(this.file)
        })
        PermissionApi.queryOSS(params).then(res => {
          this.access = res.data
          var client = new OSS.Wrapper({
            accessKeyId: this.access.access_key_id,
            accessKeySecret: this.access.access_key_secret,
            stsToken: this.access.security_token,
            endpoint: this.access.endpoint,
            bucket: this.access.bucket
          })
          var vm = this
          var storeAs =
          this.access.prefix + new Date().getTime() + RndNumber(5) + '.png'
          this.imgUrls[this.imgUrls.length - 1].urls = storeAs

          readFileAsBase64(this.file).then(base64 => {
            client
              .put(storeAs, new OSS.Buffer(base64, 'base64'))
              .then(function (result) {
                // 阿里云解密
                let params = {
                  urls: [],
                  timeout: 3600,
                  type: vm.store
                }
                params.urls.push(result.res.requestUrls[0])
                PermissionApi.getOssAccessToken(params).then(res => {
                  if (res.ok) {
                    res.data.forEach(url => {
                      if (vm.role === 'teacher') {
                        vm.imgUrls[vm.imgUrls.length - 1].urls = url.access_token
                      } else {
                        vm.imgUrls[vm.imgUrls.length - 1].urls = url.origin
                      }
                    })
                  }
                })
//                vm.imgUrls[vm.imgUrls.length - 1].urls =
//                  result.res.requestUrls[0]
                if (result.res.status === 200) {
                  setTimeout(() => {
                    vm.type === 1 && vm.$emit('imgs', vm.imgUrls, vm.type)
                    vm.type === 2 && vm.$emit('imgs', vm.imgUrls, vm.type)
                    vm.visible = true
                    loadingInstance.close()
                  }, 300)
                } else {
                  setTimeout(() => {
                    vm.visible = true
                    loadingInstance.close()
                    vm.$message({
                      message: '上传失败！',
                      type: 'warning'
                    })
                  }, 300)
                }
              })
              .catch(function (err) {
                console.log(err)
              })
          })
        })
      }
    },
    // 显示浮层
    showMask (item) {
      this.$set(item, 'maskVisible', true)
    },
    // 隐藏浮层
    hideMask (item) {
      this.$set(item, 'maskVisible', false)
    },
    // 放大
    enlarge (item) {
      this.enlargeImgUrl = item.url
      this.dialogTableVisible = true
    },
    // 删除
    doDelete (item) {
      if (item.type === this.type) {
        deleteArray(this.imgUrls, 'url', item.url)
        this.type === 1 && this.$emit('imgs', this.imgUrls, this.type)
        this.type === 2 && this.$emit('imgs', this.imgUrls, this.type)
      }
    }
  }
}
</script>
<style lang="less">
.imgPage{
  .images {
    height: 140px;
  }
  .images__item__wrap {
    border: 1px dashed #c0ccda;
    background-color: #fbfdff;
    border-radius: 5px;
    width: 140px;
    height: 140px;
    position: relative;
    float: left;
    margin-right: 10px;
    input {
      width: 100%;
      height: 100% !important;
    }
    .upload__wrap {
      color: #ABB9C6;
      position: absolute;
      left: 50%;
      top: 50%;
      text-align: center;
      transform: translateX(-50%) translateY(-50%);
      -ms-transform: translateX(-50%) translateY(-50%);
      -moz-transform: translateX(-50%) translateY(-50%);
      -webkit-transform: translateX(-50%) translateY(-50%);
      -o-transform: translateX(-50%) translateY(-50%);
      i {
        display: block;
        font-size: 30px;
      }
      span {
        font-size: 12px;
      }
    }
  }
  .images__item__wrap.img:hover {
    background-color: #000;
  }
  .images__item__wrap.upload:hover {
    border: 1px dashed rgba(32, 117, 255, 0.815);
  }
  .images__item {
    width: 100%;
    height: 100%;
  }
  .images__item__edit {
    text-align: center;
    position: absolute;
    width: 100%;
    height: 100%;
    font-size: 24px;
    color: rgba(32, 117, 255, 0.815);
    background-color: rgba(0, 0, 0, 0.7);
    padding-top: 40px;
  }
  .images__item__edit i {
    cursor: pointer;
  }
  .upload__input {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
</style>
