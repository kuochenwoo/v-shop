import { request } from '@/utils/request';
import { ServiceResult } from '@/utils/request/types';
import { shoppingCartAddParams, shoppingCartResult } from './types';

/**
 * 加入购物车
 */
export function shoppingCartAdd(data: shoppingCartAddParams) {
  const host: string = import.meta.env.VITE_APP_API_HOST_MY;
  return request<ServiceResult<shoppingCartResult>>({
    // url: `/shopping-cart/add`,
    url: `http://${host}:7072/api/product/v1/cart/add`,
    method: 'post',
    data,
  });
}

/**
 * 清空购物车
 */
export function shoppingCartEmpty(data?: Recordable) {
  return request({
    url: `/shopping-cart/empty`,
    method: 'post',
    data,
  });
}

/**
 * 读取购物车数据
 */
export function shoppingCartInfo(data?: Recordable) {
  const host: string = import.meta.env.VITE_APP_API_HOST_MY;
  return request<ServiceResult<shoppingCartResult>>({
    // url: `/shopping-cart/info`,
    url: `http://${host}:7072/api/product/v1/cart/info`,
    method: 'get',
    params: data,
  });
}

/**
 * 购物车修改购买数量
 */
export function shoppingCartModifyNumber(data?: Recordable) {
  return request<ServiceResult<shoppingCartResult>>({
    url: `/shopping-cart/modifyNumber`,
    method: 'post',
    data,
  });
}

/**
 * 移除购物车中某条记录
 */
export function shoppingCartRemove(data?: Recordable) {
  const host: string = import.meta.env.VITE_APP_API_HOST_MY;
  return request<ServiceResult<shoppingCartResult>>({
    // url: `/shopping-cart/remove`,
    url: `http://${host}:7072/api/product/v1/cart/delete`,
    method: 'post',
    data,
  });
}

/**
 * 购物车修改选中状态
 */
export function shoppingCartSelect(data?: Recordable) {
  return request<ServiceResult<shoppingCartResult>>({
    url: `/shopping-cart/select`,
    method: 'post',
    data,
  });
}

export default {
  shoppingCartAdd,
  shoppingCartEmpty,
  shoppingCartInfo,
  shoppingCartModifyNumber,
  shoppingCartRemove,
  shoppingCartSelect,
};
