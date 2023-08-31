import { request } from '@/utils/request';

/**
 * Banner列表
 */
// http://192.168.10.106:2022/dev-api/banner/list
// 请求以上的地址，从返回的地址中读取信息
// vite重定向该地址到API工厂，详见vite.config.ts的注释
// 只有 id/picUrl/title/linkUrl 是需要的
export function bannerList(data?: Recordable) {
  return request({
    url: `/banner/list`,
    method: 'get',
    params: data,
  });
}

/**
 * 获取所有的Banner类型
 */
// export function bannerTypes(data?: Recordable) {
//   return request({
//     url: `/banner/types`,
//     method: 'get',
//     params: data,
//   });
// }

export default {
  bannerList,
  // bannerTypes,
};
