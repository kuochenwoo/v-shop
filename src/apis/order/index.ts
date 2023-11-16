import { request } from '@/utils/request';

/**
 * 读取配送费设置
 */
export function peisonFeeList(data?: Recordable) {
  return request({
    url: `/fee/peisong/list`,
    method: 'get',
    params: data,
  });
}

/**
 * 关闭订单
 */
export function orderClose(data?: Recordable) {
  // const host: string = import.meta.env.VITE_APP_API_HOST_MY;
  return request({
    // url: `/order/close`,
    url: `http://47.99.137.224:7073/api/order/v1/cancel`,
    method: 'post',
    data,
  });
}

/**
 * 创建订单[下单]
 */
export function orderCreate(data?: Recordable) {
  // const host: string = import.meta.env.VITE_APP_API_HOST_MY;
  return request({
    // url: `/order/create`,
    url: `http://47.99.137.224:7073/api/order/v1/create`,
    method: 'post',
    data,
  });
}

/**
 * 获取下单token
 * @param data 
 * @returns 
 */
export function getOrderToken(data?: Recordable) {
  // const host: string = import.meta.env.VITE_APP_API_HOST_MY;
  return request({
    // url: `/order/create`,
    url: `http://47.99.137.224:7073/api/order/v1/get_token`,
    method: 'get',
    data,
  });
}

/**
 * 删除订单
 */
export function orderDelete(data?: Recordable) {
  // const host: string = import.meta.env.VITE_APP_API_HOST_MY;
  return request({
    // url: `/order/delete`,
    url: `http://47.99.137.224:7073/api/order/v1/delete`,
    method: 'post',
    data,
  });
}

/**
 * 确认收货
 */
export function orderDelivery(data?: Recordable) {
  // const host: string = import.meta.env.VITE_APP_API_HOST_MY;
  return request({
    // url: `/order/delivery`,
    url: `http://47.99.137.224:7073/api/order/v1/confirm`,
    method: 'post',
    data,
  });
}

/**
 * 订单详情
 */
export function orderDetail(data?: Recordable) {
  // const host: string = import.meta.env.VITE_APP_API_HOST_MY;
  return request({
    // url: `/order/detail`,
    url: `http://47.99.137.224:7073/api/order/v1/detail`,
    method: 'get',
    params: data,
  });
}

/**
 * 订单列表
 */
export function orderList(data?: Recordable) {
  // const host: string = import.meta.env.VITE_APP_API_HOST_MY;
  return request({
    // url: `/order/list`,
    url: `http://47.99.137.224:7073/api/order/v1/page_order`,
    method: 'post',
    data,
  });
}

/**
 * 钱包支付订单
 */
export function orderPay(data?: Recordable) {
  // const host: string = import.meta.env.VITE_APP_API_HOST_MY;
  return request({
    // url: `/order/pay`,
    url: `http://47.99.137.224:7073/api/order/v1/pay`,
    method: 'post',
    data,
  });
}

/**
 * 获取订单退款记录
 */
export function orderRefund(data?: Recordable) {
  return request({
    url: `/order/refund`,
    method: 'get',
    params: data,
  });
}

/**
 * 申请售后
 */
export function orderRefundApplyApply(data?: Recordable) {
  return request({
    url: `/order/refundApply/apply`,
    method: 'post',
    data,
  });
}

/**
 * 撤销退换货申请
 */
export function orderRefundApplyCancel(data?: Recordable) {
  return request({
    url: `/order/refundApply/cancel`,
    method: 'post',
    data,
  });
}

/**
 * 退换货详情
 */
export function orderRefundApplyInfo(data?: Recordable) {
  return request({
    url: `/order/refundApply/info`,
    method: 'get',
    params: data,
  });
}

/**
 * 评价接口
 */
export function orderReputation(data?: Recordable) {
  // const host: string = import.meta.env.VITE_APP_API_HOST_MY;
  return request({
    // url: `/order/reputation`,
    url: `http://47.99.137.224:7073/api/order/v1/review`,
    method: 'post',
    data,
  });
}

/**
 * 获取订单设置信息
 */
export function orderSet(data?: Recordable) {
  // const host: string = import.meta.env.VITE_APP_API_HOST_MY;
  return request({
    // url: `/order/set`,
    url: `http://47.99.137.224:7073/api/order/v1/info`,
    method: 'get',
    params: data,
  });
}

/**
 * 开始周期性订阅,针对已经停止的订阅重新开启
 */
export function orderStartOrderPeriod(data?: Recordable) {
  return request({
    url: `/order/startOrderPeriod`,
    method: 'post',
    data,
  });
}

/**
 * 订单统计
 */
export function orderStatistics(data?: Recordable) {
  return request({
    url: `/order/statistics`,
    method: 'get',
    params: data,
  });
}

export default {
  peisonFeeList,
  orderClose,
  getOrderToken,
  orderCreate,
  orderDelete,
  orderDelivery,
  orderDetail,
  orderList,
  orderPay,
  orderRefund,
  orderRefundApplyApply,
  orderRefundApplyCancel,
  orderRefundApplyInfo,
  orderReputation,
  orderSet,
  orderStartOrderPeriod,
  orderStatistics,
};
