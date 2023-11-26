<script lang="ts">
export default {
  name: 'Cart',
};
</script>

<script setup lang="ts">
import { computed, onMounted, ref, unref } from 'vue';
import { showConfirmDialog, showToast } from 'vant';
import NP from 'number-precision';
import API_CART from '@/apis/cart';
import { decimalFormat } from '@/utils/format';
import IMAGE_LIST_EMPTY from '@/assets/images/empty/cart.png';
import ICON_SHOPPING_CART from '@/assets/videos/shopping-cart.mp4';

import { useOrderStore } from '@/store/modules/order';
import { usePage } from '@/hooks/shared/usePage';

onMounted(() => {
  console.log("hasLogin", hasLogin.value);
  if (unref(hasLogin)) {
    getList();
  } else {
    listLoading.value = false;
  }
});

const orderStore = useOrderStore();
const { hasLogin, goHome, goLogin } = usePage();

const editStatus = ref(1); // 编辑, 取消
const fee = ref();
function onEditStatusChange() {
  editStatus.value = unref(editStatus) === 1 ? 2 : 1;
}

const list = ref<Recordable[]>([]);
const listLoading = ref(true);
// const listEmptyText = ref('暂无数据');
const listEmptyImage = IMAGE_LIST_EMPTY;
const cartVideoSrc = ICON_SHOPPING_CART;

const selectedList = computed(() => {
  return unref(list).filter((v) => v.selected);
});
let checkBoxStatus = false;
const totalGoodCount = computed(() => {
  return unref(selectedList).reduce((acc, cur) => NP.plus(acc, cur.number), 0);
});

const totalPrice = computed(() => {
  return unref(selectedList).reduce((acc, cur) => NP.plus(acc, NP.times(cur.price, cur.number)) + fee.value, 0);
});

// const selectedAll = computed({
//   get() {
//     return unref(selectedList).length === unref(list).length;
//   },
//   set(val) {
//     unref(list).forEach((v) => {
//       v.selected = val;
//     });
//   },
// });

function getList() {
  listLoading.value = true;

  API_CART.shoppingCartInfo()
    .then((res) => {
      list.value = res.data?.items ?? [];
      getFee();
    })
    .finally(() => {
      listLoading.value = false;
    });
}

async function getFee() {
  const params: Recordable = {
    productId: list.value[0].productId,
    serviceId: list.value[0].serviceId
  }
  const res = await API_CART.getDeliveryFee(params);
  fee.value = res.data;
}

function onDelete() {
  if (!unref(selectedList).length) {
    showToast({
      message: '您还没有选择服务哦',
      duration: 1500,
    });
    return;
  }

  // const type = unref(selectedList).length === unref(list).length ? 'empty' : 'remove';
  // const message = type === 'empty' ? `确定要清空购物车吗？` : `确定要删除这${unref(selectedList).length}个预约吗？`;
  const message = `确定要删除这个预约吗？`;

  showConfirmDialog({
    message: message,
  })
    .then(() => {
      // if (type === 'empty') {
      //   cartEmptyHandle();
      // } else {
      cartRemoveHandle();
      // }
    })
    .catch((err) => {
      console.log(err);
    });
}

function onCLickBoxChange(selected) {
  checkBoxStatus = selected;
  console.log(selected)
}
// function cartNumberHandle(_index: number, { key, number }) {
//   showLoadingToast({
//     forbidClick: true,
//     message: '修改中...',
//     duration: 0,
//   });

//   API_CART.shoppingCartModifyNumber({ number, key })
//     .then((res) => {
//       closeToast();
//       list.value = res.data?.items ?? [];
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

// function cartEmptyHandle() {
//   API_CART.shoppingCartEmpty()
//     .then(() => {
//       list.value = [];
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

function cartRemoveHandle() {
  const keyStr = unref(selectedList)
    .map((v) => v.serviceId)
    .join(',');

  API_CART.shoppingCartRemove({ serviceId: keyStr })
    .then((res) => {
      list.value = res.data?.items ?? [];
    })
    .catch((err) => {
      console.log(err);
    });
}
const balanceSwitch = ref<boolean>(true);
function onSubmit() {
  if (!unref(selectedList).length) {
    showToast({
      message: '您还没有选择技师哦',
      duration: 1500,
    });
    return;
  }

  if (unref(selectedList).some((v) => v.status === 0)) {
    showToast({
      message: '请删除掉失效服务',
      duration: 1500,
    });
    return;
  }
  orderStore.setTradeGoods({
    origin: 'cart',
    list: unref(selectedList),
  });
}
</script>

<template>
  <div class="container">
    <SpainList v-model:loading="listLoading">
      <template v-if="list.length">
        <div class="goods">
          <div class="goods-header van-hairline--bottom">
            <div class="goods-header-hd">
              <video class="goods-header-cart" :src="cartVideoSrc" width="40" height="40" autoplay muted loop
                type="video/mp4"></video>
              <span>购物车</span>
            </div>
            <div class="goods-header-bd" @click="onEditStatusChange">
              {{ editStatus === 1 ? '编辑' : '完成' }}
            </div>
          </div>
          <div class="list">
            <div v-for="(item, index) in list" :key="item.serviceId" class="list-item">
              <div class="list-item-selected">
                <van-checkbox v-model="item.selected" @click="onCLickBoxChange(item.selected)"></van-checkbox>
              </div>
              <van-image fit="contain" class="list-item-pic" :src="item.servicePic" />
              <div class="list-item-content">
                <div class="list-item-title">
                  <span v-if="item.status === 0" style="color: var(--color-text-4)">!!!--失效--!!!</span>
                  {{ item.name }}
                </div>
                <div class="list-item-bottom">
                  <div class="list-item-bottom-detail">
                    <div class="list-item-bottom-detail-service">
                      {{ item.serviceName }}
                    </div>
                    <div class="list-item-bottom-detail-product">
                      {{ item.productName }}
                    </div>
                  </div>
                  <div class="list-item-price">
                    <span class="list-item-price-symbol">¥</span>
                    <span class="list-item-price-integer">{{ decimalFormat(item.price) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <van-empty v-else class="empty" :image="listEmptyImage">
        <template v-if="hasLogin">
          <div class="empty-title">您还没选择服务</div>
          <van-button class="empty-btn" round plain type="primary" @click="goHome">去逛逛</van-button>
        </template>
        <template v-else>
          <div class="empty-title">登录后才能看到您的购物车</div>
          <van-button class="empty-btn" type="primary" round @click="goLogin">去登录</van-button>
        </template>
      </van-empty>
    </SpainList>
    <div>
      <div v-if="checkBoxStatus === true && list.length">
        <van-cell title="车费" center>
          <template #label>
            <span style="color: red;">
              出租车打表计费：
            </span>
            {{ decimalFormat(fee) }}
          </template>
          <template #right-icon>
            <van-checkbox :model-value="balanceSwitch"> </van-checkbox>
          </template>
        </van-cell>
        <van-cell title="已选服务" :value="`${list[0].serviceName}`" size="large" style="position: relative;width: 100%; "
          class="van-cell-full" />
        <van-cell title="服务时间" :value="`${list[0].status}分钟`" size="large" style="position: relative;width: 100%; "
          class="van-cell-full" />
        <van-card class="van-card-full">
          <template #title>
            <div style="font-size: large;">
              {{ list[0].productName }}
            </div>
          </template>
          <template #thumb>
            <van-image width="100%" height="100%" fit="cover" :src="list[0].productPic" round />
          </template>
          <template #desc>
            <div style="font-size: 12px; color: grey; margin-top: 3%;">
              车程大约：{{ list[0].distance }}分钟
            </div>
          </template>
        </van-card>
      </div>
    </div>
    <!--结算栏 -->
    <div class="submit-bar-wrap">
      <div v-if="list.length" class="submit-bar">
        <!-- <van-checkbox v-model="selectedAll">全选</van-checkbox> -->
        <template v-if="editStatus === 2">
          <div class="submit-bar-hd"></div>
          <van-button class="submit-bar-button" round plain @click="onDelete">删除</van-button>
        </template>
        <template v-else>
          <div class="submit-bar-hd">
            <span class="submit-bar-total">合计：</span>
            <div class="submit-bar-price">
              <span class="submit-bar-price-symbol">¥</span>
              <span class="submit-bar-price-integer">{{ decimalFormat(totalPrice) }}</span>
            </div>
          </div>
          <van-button class="submit-bar-button" round type="primary" @click="onSubmit">去结算({{ totalGoodCount
          }})</van-button>
        </template>
      </div>
    </div>
    <!-- 底部导航栏 -->
    <Tabbar />
  </div>
</template>

<style lang="less" scoped>
.drop-down-img {
  display: flex;
}

.van-card-full {
  --van-card-background: #ac9b9b26;
}

.van-cell-full {
  --van-cell-background: #ac9b9b26;
}

.goods {
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  margin: 12px 10px;
  border-radius: 8px;
  background-color: var(--color-bg-2);

  &-header {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0 15px;
    font-size: 14px;

    &.van-hairline--bottom::after {
      right: -40%;
      left: -40%;
    }

    &-hd,
    &-bd {
      flex: 1;
    }

    &-hd {
      display: flex;
      align-items: center;
    }

    &-bd {
      position: relative;
      overflow: hidden;
      color: #38f;
      text-align: right;
    }

    &-cart {
      margin-left: -10px;
      width: 40px;
      height: 40px;
    }
  }
}

.list {
  padding-top: 10px;

  &-item {
    position: relative;
    box-sizing: border-box;
    padding: 8px 15px;
    display: flex;
    align-items: center;

    &-selected {
      margin-left: -10px;
      min-width: 40px;
      display: flex;
      justify-content: center;
    }

    &-pic {
      width: 90px;
      height: 90px;
      border-radius: 8px;
      margin-right: 10px;
      overflow: hidden;
    }

    &-content {
      min-width: 0;
      min-height: 90px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    &-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 15px;

      &-detail {
        &-service {
          font-size: 15px;
        }

        &-product {
          font-size: 12px;
        }
      }
    }

    &-title {
      font-size: 14px;
      line-height: 18px;
      color: var(--color-text-1);
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &-desc {
      flex: 1;
      font-size: 12px;
      line-height: 20px;
      color: var(--color-text-3);
    }

    &-price {
      color: var(--color-primary);

      &-symbol {
        font-size: 12px;
        margin-right: 2px;
      }

      &-integer {
        font-size: 18px;
        font-family: @font-family-price-integer;
      }
    }
  }
}

.submit-bar {
  box-sizing: border-box;
  position: fixed;
  left: 0;
  bottom: calc(50px + var(--safe-area-height-bottom));
  z-index: 100;
  width: 100%;
  padding: 0 16px;
  background-color: var(--color-bg-2);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 50px;
  font-size: 14px;

  &-wrap {
    height: calc(50px + var(--safe-area-height-bottom));
  }

  &-hd {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 15px;
    color: var(--color-text-1);
  }

  &-price {
    color: var(--color-primary);
    font-weight: bold;

    &-symbol {
      font-size: 12px;
      margin-right: 2px;
    }

    &-integer {
      font-size: 20px;
      font-family: @font-family-price-integer;
    }
  }

  &-button {
    width: 110px;
    height: 40px;
  }
}

.empty {
  text-align: center;

  &-title {
    margin-bottom: 8px;
    font-size: 14px;
    color: var(--color-text-1);
  }

  &-txt {
    font-size: 14px;
    color: var(--color-text-3);
  }

  &-btn {
    box-sizing: border-box;
    height: 32px;
    line-height: 30px;
    font-size: 14px;
    margin: 10px auto 0;
    border-radius: 16px;
  }
}

.dark {
  .goods-header-cart {
    display: none;
  }
}
</style>
