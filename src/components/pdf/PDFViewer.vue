<template>
  <div class="PDFViewer">
    <iframe class="pdfFrame" ref="pdfFrame" :src="finalUrl" frameborder="0" @load="handleLoad" allowfullscreen>
    </iframe>
    <!-- <embed ref="pdfFrame" v-show="url" class="pdfContainer" :src="finalUrl" type="application/pdf"> -->
  </div>
</template>

<script>
  // import mixin, { banFn } from '@/mixins/contextmenu'
  import { genParams } from '@/utils/pdf'

  export default {
    // mixins: [mixin],
    props: {
      url: {
        // frame打印pdf会有跨域问题
        type: String,
        default: '/static/media/dingtalk.pdf'
      },
      params: {
        // 向 chrome pdf 查看器中传入的参数
        type: Object,
        default: () => ({
          pagemode: 'thumbs',
          navpanes: 0,
          toolbar: 0,
          statusbar: 0,
          view: 'FitH'
        })
      }
    },
    computed: {
      finalUrl () {   // pdf的实现是用pdf.js iframe中引用的路径是static中的viewer.html
        return `../../../../static/js/web/viewer.html?file=${this.url + genParams(this.params)}`
      }
    },
    methods: {
      print () {
        // this.$refs.pdfFrame.contentWindow.document.requestFullscreen()
        // this.$refs.pdfFrame.contentWindow.print()
        this.$refs.pdfFrame.contentWindow.document.getElementById('print').click()  // 触发iframe中的print的点击事件
      },
      handleLoad (e) {
        // console.log(e, this.$refs.pdfFrame)
        // console.log(e, this.$refs.pdfFrame.contentDocument)
      }
    },
    mounted () {
      // 禁用 iframe 右键
      // banFn(this.$refs.pdfFrame)
    }
  }
</script>

<style scoped>
  .pdfFrame {
    width: 100%;
    height: 80vh;
  }

  .pdfContainer {
    width: 100%;
    height: 80vh;
  }
</style>
