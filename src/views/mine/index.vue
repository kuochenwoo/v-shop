<script lang="ts">
export default {
  name: 'Mine',
};
</script>

<script setup lang="ts">
import { computed, onMounted, ref, unref } from 'vue';
// import API_ORDER from '@/apis/order';
import MineSvgWaveBg from '@/components/MineSvgWaveBg/index.vue';
import { assets } from '@/constants';
import API_USER from '@/apis/user';
import { showToast, showDialog } from 'vant';
import { useUserStore } from '@/store/modules/user';
import { usePage } from '@/hooks/shared/usePage';
import { useRouter } from 'vue-router';
import { decimalFormat } from '@/utils/format';

onMounted(() => {
  console.log("hasLogin", hasLogin.value);
  if (unref(hasLogin)) {
    userStore.getUserDetail();
    getUserAmount();
    // getCounts();
  }
});

const userStore = useUserStore();
const { hasLogin, goLogin, goPage } = usePage();
const router = useRouter();


// 钱包
const balance = ref<number>(0);

function getUserAmount() {
  API_USER.userAmount().then((res) => {
    balance.value = res.data ?? 0;
  });
}
const userInfo = computed(() => userStore.getUserInfo);

function showAmount() {
  // showToast({
  //   message: `${decimalFormat(balance.value)}`,
  //   duration: 1000 * 2,
  // });
  showDialog({
    title: '您的账户余额',
    message: `${decimalFormat(balance.value)}`,
  }).then(() => {
    // on close
  });
}

function onEasterEgg() {
  const el = document.querySelector('.header-avatar') as HTMLElement;
  el.classList.toggle('active');
}

function onLogout() {
  userStore.logout().then(() => {
    router.back();
  });
}

// function getCounts() {
//   API_ORDER.orderStatistics().then((res) => {
//     const orderCount = res.data;

//     orderList.value.forEach((item) => {
//       orderCount[item.countKey] && (item.count = orderCount[item.countKey]);
//     });
//   });
// }
</script>

<template>
  <div class="container">
    <div class="header">
      <div v-if="hasLogin" class="header-inner" @click="goPage('/profile')">
        <div class="hea">
          <div class="header-tag">个人资料</div>
          <div class="header-tag-logout" @click="onLogout">退出登录</div>
        </div>
        <van-image class="header-avatar" :src="userInfo.avatarUrl || assets.avatar" alt="" @click.stop="onEasterEgg" />
        <div class="header-info">
          <div class="header-nick van-ellipsis mb10">
            {{ userInfo.name || `还没有昵称` }}
          </div>
          <div class="header-sub">
            <span class="header-sub-item">签名： {{ userInfo.slogan }}</span>
          </div>
        </div>
      </div>
      <div v-else class="header-inner" @click="goLogin">
        <van-image class="header-avatar" :src="assets.avatar" alt="" @click.stop="onEasterEgg" />
        <div class="header-info">
          <div class="header-nick">登录/注册</div>
        </div>
      </div>
      <div class="header-bg">
        <div class="header-bg-wave">
          <MineSvgWaveBg />
        </div>
      </div>
    </div>
    <van-grid direction="horizontal" :column-num="1">
      <van-grid-item @click="goPage('/order/list')">
        <template #text>
          <div class="menu-text">
            <div class="menu-text-up">
              全部订单
            </div>
            <div class="menu-text-down">
              查看订单详情
            </div>
          </div>
          <div class="menu-icon">
            <van-icon name="orders-o" />
          </div>
          <span class="menu-arrow">
            <van-icon name="arrow" />
          </span>
        </template>
        <template #icon>
          <van-icon name="location-o" color="transparent" />
        </template>

      </van-grid-item>
      <van-grid-item to="/address">
        <template #text>
          <div class="menu-text">
            <div class="menu-text-up">
              收货地址
            </div>
            <div class="menu-text-down">
              常用地址及联系方式
            </div>
          </div>
          <div class="menu-icon">
            <van-icon name="location-o" />
          </div>

          <span class="menu-arrow">
            <span class="menu-arrow-info">编辑</span>
            <van-icon name="arrow" />
          </span>
        </template>
        <template #icon>
          <van-icon name="location-o" color="transparent" />
        </template>
      </van-grid-item>
      <van-grid-item @click="showAmount" style="margin-top: 5%;">
        <template #text>
          <div class="menu-text">
            <div class="menu-text-up">
              我的资产
            </div>
            <div class="menu-text-down">
              备用金余额
            </div>
          </div>
          <div class="menu-icon">
            <van-icon name="points" />
          </div>
          <span class="menu-arrow">
            <span class="menu-arrow-info">查看</span>
            <van-icon name="arrow" />
          </span>
        </template>
        <template #icon>
          <van-icon name="location-o" color="transparent" />
        </template>
      </van-grid-item>
      <van-grid-item @click="goPage('/refund')">
        <template #text>
          <div class="menu-text">
            <div class="menu-text-up">
              联系客服
            </div>
            <div class="menu-text-down">
              拨打客服电话
            </div>
          </div>
          <div class="menu-icon">
            <van-icon name="phone-o" />
          </div>
          <span class="menu-arrow">
            <van-icon name="arrow" />
          </span>
        </template>
        <template #icon>
          <van-icon name="location-o" color="transparent" />
        </template>
      </van-grid-item>
      <van-grid-item @click="showToast({
        message: `敬请期待`,
        duration: 1000 * 2,
      })">
        <template #text>
          <div class="menu-text">
            <div class="menu-text-up">
              优惠券
            </div>
            <div class="menu-text-down">
              查看我的优惠券
            </div>
          </div>
          <div class="menu-icon">
            <van-icon name="coupon-o" />
          </div>
          <span class="menu-arrow">
            <van-icon name="arrow" />
          </span>
        </template>
        <template #icon>
          <van-icon name="location-o" color="transparent" />
        </template>
      </van-grid-item>
      <van-grid-item @click="showToast({
        message: `敬请期待`,
        duration: 1000 * 2,
      })">
        <template #text>
          <div class="menu-text">
            <div class="menu-text-up">
              申请加盟
            </div>
            <div class="menu-text-down">
              商家入驻
            </div>
          </div>
          <div class="menu-icon">
            <van-icon name="shield-o" />
          </div>
          <span class="menu-arrow">
            <van-icon name="arrow" />
          </span>
        </template>
        <template #icon>
          <van-icon name="location-o" color="transparent" />
        </template>
      </van-grid-item>
      <van-grid-item to="/setting" style="margin-top: 5%;">
        <template #text>
          <div class="menu-text">
            <div class="menu-text-up">
              设置
            </div>
            <div class="menu-text-down">
              系统及用户设定
            </div>
          </div>
          <div class="menu-icon">
            <van-icon name="setting-o" />
          </div>
          <span class="menu-arrow">
            <span class="menu-arrow-info">查看</span>
            <van-icon name="arrow" />
          </span>
        </template>
        <template #icon>
          <van-icon name="setting-o" color="transparent" />
        </template>
      </van-grid-item>

    </van-grid>
    <!-- 底部导航栏 -->
    <Tabbar />
  </div>
</template>

<style lang="less" scoped>
.style-box() {
  box-sizing: border-box;
  border-radius: 8px;
  overflow: hidden;
  background: var(--color-bg-2);
}

.menu-text {
  font-size: 15px;
  display: flex;
  align-items: flex-start;
  position: absolute;
  left: 12%;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  font-size: 10px;

  &-up {
    font-size: 12px;
  }

  &-down {
    font-size: 10px;
    margin-top: 5%;
    color: grey;
  }
}

.menu-icon {
  font-size: 15px;
  display: flex;
  align-items: center;
  position: absolute;
  left: 5%;
}

.menu-arrow {
  font-size: 15px;
  position: absolute;
  right: 8%;
  display: flex;
  align-items: center;

  &-info {
    font-size: 12px;
    margin-right: 5px;
    color: grey;
  }
}

.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 180px;
  color: #fff;
  background-color: var(--color-primary);
  overflow: hidden;

  &-bg {
    box-sizing: border-box;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;

    &-wave {
      position: absolute;
      left: 0;
      bottom: -20px;
      width: 100%;
    }
  }

  &-inner {
    box-sizing: border-box;
    position: absolute;
    top: 30px;
    width: 100%;
    padding: 0 15px;
    display: flex;
    align-items: center;
    z-index: 20;
  }

  &-tag {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    box-sizing: border-box;
    width: auto;
    padding: 2px 8px;
    color: #fff;
    font-size: 12px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px 0 0 10px;
    z-index: 20;

    &-logout {
      position: absolute;
      right: 0px;
      margin-top: 20px;
      font-size: 12px;
      padding: 2px 8px;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 10px 0 0 10px;
      z-index: 20;
    }

    &-icon {
      margin-right: 5px;
    }
  }

  &-avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;

    &.active {
      transform: rotate(666turn);
      transition-delay: 1s;
      transition-property: all;
      transition-duration: 60s;
      transition-timing-function: cubic-bezier(0.34, 0, 0.84, 1);
    }
  }

  &-nick {
    font-size: 20px;
    max-width: 200px;
    height: 30px;
    line-height: 30px;
  }

  &-sub {
    font-size: 12px;
    line-height: 24px;
    color: #fff;
    display: flex;
    align-items: center;

    &-item {
      display: flex;
      align-items: center;

      &-separate {
        display: inline-flex;
        margin: 0 5px 0 5px;
      }

      &-icon {
        margin-right: 5px;
      }
    }
  }
}

// .main {
// padding:0 20px;
// margin-top: -50px;
// }

.mb10 {
  margin-bottom: 10px;
}

.group {
  .style-box();
  margin: 0 15px 15px 15px;

  &-inner {
    padding: 10px 0;
  }
}

.group {
  &-header {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 15px;

    &-hd {
      color: var(--color-text-1);
      text-align: left;
      font-size: 14px;
      font-weight: bold;
    }

    &-bd {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 12px;
      color: var(--color-text-3);
    }

    &-arrow {
      margin-left: 2px;
      font-size: 14px;
    }
  }
}

.order {
  &-list {
    box-sizing: border-box;
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    &-item {
      box-sizing: border-box;
      width: 20%;
      text-align: center;

      .van-icon {
        font-size: 24px;
        margin-bottom: 5px;
      }

      &-title {
        color: var(--color-text-1);
        font-size: 12px;
      }
    }
  }
}



.tool {
  &-list {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-evenly;

    &-item {
      box-sizing: border-box;
      width: 20%;
      text-align: center;
      padding: 10px 0;

      .van-icon {
        font-size: 24px;
        margin-bottom: 5px;
      }

      &-title {
        color: var(--color-text-1);
        font-size: 12px;
      }
    }
  }
}

.balance {
  &-list {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    &-item {
      box-sizing: border-box;
      width: 25%;
      text-align: center;
      padding: 10px 0;

      .van-icon {
        font-size: 24px;
        margin-bottom: 5px;
      }

      &-title {
        color: var(--color-text-2);
        font-size: 14px;
      }
    }
  }
}

.count {
  &-list {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    &-item {
      box-sizing: border-box;
      flex: 1;
      padding: 10px 0;
      text-align: center;

      &-value {
        font-size: 16px;
        font-weight: bold;
        color: #141414;
        margin-bottom: 10px;
      }

      &-label {
        font-size: 12px;
        color: var(--color-text-2);
      }
    }
  }
}

.dark {
  .count-list-item-value {
    color: var(--van-text-color);
  }

  .header {
    background-color: var(--color-bg-2);
  }

  .header-tag {
    background-color: rgba(255, 255, 255, 0.2);
  }
}
</style>
