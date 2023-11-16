import qs from 'qs';
import { getAPI } from '@/utils';
import { request } from '@/utils/request';
import { Console } from 'console';

/**
 * 校验邮件验证码是否正确
 */
export function verificationMailCheck(data?: Recordable) {
  return request({
    url: `/verification/mail/check`,
    method: 'post',
    data,
  });
}

/**
 * 获取邮件验证码
 */
export function verificationMailGet(data?: Recordable) {
  // const host: string = import.meta.env.VITE_APP_API_HOST_MY;
  return request({
    url: `http://47.99.137.224:7071/api/user/v1/send_code`,
    method: 'get',
    params: data,
  });
}

/**
 * 校验图片验证码是否正确
 */
export function verificationPicCheck(data?: Recordable) {
  return request({
    url: `/verification/pic/check`,
    method: 'post',
    data,
  });
}

/**
 * 获取图形验证码
 */
export function verificationPicGet() {
  // const host: string = import.meta.env.VITE_APP_API_HOST_MY;
  return `http://47.99.137.224:7071/api/user/v1/captcha`
}

/**
 * 校验短信验证码是否正确
 */
export function verificationSmsCheck(data?: Recordable) {
  return request({
    url: `/verification/sms/check`,
    method: 'post',
    data,
  });
}

/**
 * 获取短信验证码
 */
export function verificationSmsGet(data?: Recordable) {
  return request({
    url: `/verification/sms/get`,
    method: 'get',
    params: data,
  });
}

/**
 * 获取短信验证码[发送至当前绑定手机]
 */
export function verificationSmsGetByToken(data?: Recordable) {
  return request({
    url: `/verification/sms/get-by-token`,
    method: 'get',
    params: data,
  });
}

export default {
  verificationMailCheck,
  verificationMailGet,
  verificationPicCheck,
  verificationPicGet,
  verificationSmsCheck,
  verificationSmsGet,
  verificationSmsGetByToken,
};
