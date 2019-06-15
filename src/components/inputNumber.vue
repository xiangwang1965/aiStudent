<template>
  <div class="inputNumber"
    :class="[{'inputNumber-mini': size==='mini'}, {'inputNumber-small': size==='small'}, {'inputNumber-large': size==='large'}]"
    :style="{width: width, height:height}">
    <input :class="{'input-disabled': disabled, 'input-right': alignRight}" type="text" :placeholder="placeholder" :value="currentValue" :disabled="disabled" :maxlength="maxlength" @input="inputChange">
  </div>
</template>
<script>
  import { twoFloatFormat } from '@/utils'
  export default {
    props: {
      max: {
        type: Number,
        default: 9999999
      },
      min: {
        type: Number,
        default: -9999999
      },
      value: {
        default: 0
      },
      size: {
        type: String,
        default: 'mini'
      },
      width: {
        type: String,
        default: ''
      },
      height: {
        type: String,
        default: ''
      },
      isFloat: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: '请输入'
      },
      maxlength: {
        type: Number,
        default: Infinity
      },
      alignRight: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        currentValue: this.value
      }
    },
    watch: {
      'currentValue': function (val, oldval) {
        this.$emit('input', val)
        this.$emit('change', val)
      },
      value: function (val) {
        this.updateValue(val)
      }
    },
    mounted () {
      this.updateValue(this.value)
    },
    methods: {
      updateValue (val) {
        if (val > this.max) {
          val = this.isFloat ? twoFloatFormat(this.max) : this.max
        }
        if (val < this.min) {
          val = this.isFloat ? twoFloatFormat(this.min) : this.min
        }
        this.$set(this, 'currentValue', val)
      },
      isValueNumber (value) {
        if (this.isFloat) {
          return (/((^-?[0-9]+(\.{1}\d{0,2})?$))|(^-?[1-9]*$)|(^-?0{1}$)/).test(value + '')
        }
        return (/0|(^-?[0-9]$)|(^-?[1-9]*$)|(^-?0{1}$)/).test(value + '')
      },
      inputChange (event) {
        var val = event.target.value.trim()
        var max = this.isFloat ? twoFloatFormat(this.max) : this.max
        var min = this.isFloat ? twoFloatFormat(this.min) : this.min
        if (this.isValueNumber(val)) {
          if ((val).indexOf('.') < 0 && val * 1 === 0) {
            event.target.value = 0
          }
          if ((val).indexOf('.') < 0) {
            val = isNaN(Number(val)) || Number(val) === 0 ? 0 : Number(val)
          }
          this.currentValue = val
          if (val * 1 > max * 1) {
            this.currentValue = max
          }
          if (val * 1 < min * 1) {
            this.currentValue = min
          }
        } else {
          event.target.value = this.currentValue
        }
      }
    }
  }
</script>
<style lang="less">
  .inputNumber {
    display: inline-block;
    border: 1px solid #E6ECEF;
    border-radius: 4px;
    input {
      height: 100% !important;
      width: 100% !important;
      padding: 0 15px;
      border-radius: 4px;
      color: #606266;
      font-size: 12px;
      background: transparent;
      &::-webkit-input-placeholder{
        color: #BFC4CC;          /* 使用webkit内核的浏览器 */
      }
      &::-moz-placeholder{
        color: #BFC4CC;                   /* Firefox版本4-18 */
      }
      &::-moz-placeholder{
        color: #BFC4CC;                  /* Firefox版本19+ */
      }
      &::-ms-input-placeholder{
        color: #BFC4CC;              /* IE浏览器 */
      }
    }
    .input-disabled {
      background-color: #f5f7fa;
    }
    .input-right {
      text-align: right;
    }
  }
  .inputNumber-mini {
    height: 28px;
    line-height: 28px;
  }
  .inputNumber-small {
    height: 32px;
    line-height: 32px;
  }
  .inputNumber-large {
    height: 36px;
    line-height: 36px;
  }
</style>
