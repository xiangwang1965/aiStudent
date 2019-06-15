<template>
<div id="payOrder" class="orderView">
        <img :src="qrImg" />
</div>
</template>
<script>
    import buyApi from "@/services/buy";
    import utils from '../../utils';
    import config from '@/config'
    export default {
        data(){
            return {
                qRImg:'',
                out_trade_no: this.$route.query.out_trade_no,
                totalPric: this.$route.query.totalPric,
                qrImg: config.API_URL+'upload/pay/'+ this.$route.query.out_trade_no+ '.jpg'
            }
        },
        mounted() {
            this.payOrderStatus();
        },
        methods:{
            payOrderStatus() {
                let params = {
                    out_trade_no:this.out_trade_no
                };
                let t = setInterval(() => {
                    buyApi.queryOrderStatus(params).then(res=>{
                        if (res.code == '001') {
                            if (res.data === 1) {
                                clearInterval(t);
                                this.$router.push({
                                    name:'success',
                                    query:{
                                        out_trade_no:res.data.out_trade_no,
                                    }
                                });
                            }
                        } else {
                            this.$message({
                               message:res.msg,
                               type:'error'
                            })
                        }
                    });
                }, 5000);

            }
        }
    }
</script>

<style lang="less" scoped>
.orderView {
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
}
img {
    position:absolute;
    width:4rem;
    height:4rem;
}
</style>