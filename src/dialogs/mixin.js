export default {
  props: {
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: 'add'
    },
    params: {
      type: Object,
      required: false,
      default: () => ({
        callback: () => { }
      })
    }
  },
  data () {
    return {
      loadings: {
        btn: false
      }
    }
  },
  methods: {
    close () {
      this.$eventHub.$emit('closeDialog', this.name)
      // 如果有回调，就调用回调
      if (this.params.callback) {
        this.params.callback()
      }
    }
  }
}
