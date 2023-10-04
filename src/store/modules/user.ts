import { defineStore } from 'pinia';
import { store } from '@/store';
import storage from 'good-storage';
import { router } from '@/router';
import API_USER from '@/apis/user';
import { loginProviderType } from '@/constants/modules/user';

export interface UserState {
  token: string;
  userInfo: NonNullable<UserInfo>;
  userLevel: NonNullable<UserLevel>;
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: storage.get('token', ''),
    userInfo: storage.get('userInfo', {}),
    userLevel: {},
  }),
  getters: {
    getToken: (state): string => state.token,
    hasLogin: (state): boolean => !!state.token,
    getUserInfo: (state): UserInfo => state.userInfo,
    getUserLevel: (state): UserLevel => state.userLevel,
  },
  actions: {
    async login(payload: Recordable = {}) {
      const { provider = 'system', params } = payload;

      try {
        const loginProvider = loginProviderType[provider];

        const res = await API_USER[loginProvider.apiName](params);
        const token = res.data;
        this.token = token;

        // token 设置在local storage里面
        storage.set('token', token);
        return res.data;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async logout(payload: Recordable = {}) {
      const { goLogin = false } = payload;

      if (this.getToken) {
        try {
          await API_USER.userLoginOut();
        } catch (error) {
          console.error('退出登录失败', error);
        }
      }

      this.token = '';
      storage.set('token', '');
      this.userInfo = {};
      storage.set('userInfo', {});
      goLogin && router.push('/login');
    },
    async getUserDetail() {
      try {
        const res = await API_USER.userDetail();
        console.log(res.data)
        const base = res.data;

        this.userInfo = base;
        storage.set('userInfo', base);
      } catch (error) {
        console.error('获取用户详情失败', error);
      }
    },
  },
});

export function useUserStoreWithOut() {
  return useUserStore(store);
}

export interface UserInfo {
  slogan?: number;
  name?: string;
  headImg?: string;
  [key: string]: any;
}
export interface UserLevel {
  id?: number;
  [key: string]: any;
}
