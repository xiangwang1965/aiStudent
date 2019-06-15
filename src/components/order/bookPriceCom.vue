<template>
  <div class="book-price-wrap">
    <div class="order-list-item-footer">
      <div class="order-list-item-footer-book">
        <span>书本费&nbsp;&nbsp; </span>
        <span style="color:#ABB9C6;">(退费说明：{{rulerType || '无'}})</span>
      </div>
      <div>{{optionFee}} 元</div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      rulerType: {
        require: true
      },
      optionFee: {
        require: true
      }
    }
  }
</script>

<style lang="less" scoped>
.book-price-wrap {
  .order-list-item-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #FAFCFD;
    width: 390px;
    height: 61px;
    margin: 15px 0 0 120px;
    padding: 0 30px;
    position: relative;
    font-size: 13px;
    border-radius: 4px;

    &:before {
      display: block;
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-bottom: 5px solid #FAFCFD;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      top: -5px;
      left: 38px;
    }
    .order-list-item-footer-book {
      span {
        &:last-child {
          color: #7A808D;
        }
      }
    }
  }
}
</style>
