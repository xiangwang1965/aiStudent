<template>
  <div class="lectureTab">
    <div class="btnsRow" v-if="vm.url">
       <button class="btn btn-primary" @click="handlePrint">打印</button>
    </div>
    <div class="pdfViewer">
      <PDFViewer ref="pdfViewer" :url="vm.url" v-if="vm.url"></PDFViewer>
    </div>
  </div>
</template>

<script>
import PDFViewer from './PDFViewer'
export default {
  props: {
    vm: {
      type: Object,
      required: true
    }
  },
  components: {
    PDFViewer
  },
  methods: {
    handlePrint () {
      this.$refs.pdfViewer.print()
    }
  }
}
</script>

<style scoped>
.btnsRow {
  text-align: right;
  margin-bottom: 10px;
}
</style>
