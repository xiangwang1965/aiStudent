import CRUD from '../CRUD'

class Teacher extends CRUD {
  constructor () {
    super()
    this.allOrdersUrl = '/ws/api/order/orders'
    this.curOrdersUrl = '/ws/api/order/curOrders'
    this.hisOrdersUrl = '/ws/api/order/hisOrders'
  }
  queryOrders (params) {
        if (params.typeid === '1') {
            return this.sendGet( this.allOrdersUrl)
        } else if (params.typeid === '2') {
            return this.sendGet(this.curOrdersUrl, params)
        } else if (params.typeid === '3') {
            return this.sendGet(this.hisOrdersUrl, params)
        }
    }

}

export default new Teacher()
