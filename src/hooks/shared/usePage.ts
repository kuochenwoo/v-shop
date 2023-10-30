import { computed, unref } from 'vue';
import { useRouter } from 'vue-router';

import { useUserStore } from '@/store/modules/user';
import { useAppStore } from '@/store/modules/app';
import { onMountedOrActivated } from '../core/onMountedOrActivated';
import { makePhoneCall } from '@/utils/web/makePhoneCall';

export function usePage() {
  const userStore = useUserStore();
  const appStore = useAppStore();
  const router = useRouter();

  const token = computed(() => userStore.getToken);
  const hasLogin = computed(() => !!unref(token));
  const theme = computed(() => appStore.getTheme);

  function onConcatService() {
    makePhoneCall({
      phoneNumber: '88881234', // 模拟打电话
    });
  }

  function goPage(path) {
    if(path === '/refund') {
      onConcatService();
      return;
    }
    router.push({ path });
  }

  function goLogin() {
    router.push('/login');
  }

  function goHome() {
    router.replace('/');
  }

  return {
    token,
    hasLogin,
    theme,
    // 跳转页面
    goHome,
    goLogin,
    goPage,
    //
    onMountedOrActivated,
  };
}
