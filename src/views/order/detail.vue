<script lang="ts">
export default {
  name: 'OrderDetail',
};
</script>

<script setup lang="ts">
import { onMounted, ref, unref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showConfirmDialog, showToast, showLoadingToast, closeToast } from 'vant';
import dayjs from 'dayjs';
import API_ORDER from '@/apis/order';
import { setClipboardData } from '@/utils/web/clipboard';
import { makePhoneCall } from '@/utils/web/makePhoneCall';
import Price from '@/components/Price/index.vue';
import OrderSteps from './components/OrderSteps.vue';
import OrderRate from './components/OrderRate.vue';
import { decimalFormat } from '@/utils/format';

import { useOrderStore } from '@/store/modules/order';
import { watchEffect } from 'vue';

onMounted(() => {
  getDetail();
});

const router = useRouter();
const route = useRoute();

const stepsPopupShow = ref(false);
// function onStepsOpen() {
//   stepsPopupShow.value = true;
// }

const ratePopupShow = ref(false);
function onOrderReputation() {
  ratePopupShow.value = true;
}

function onRateSuccess() {
  onRefresh();
}

const orderStore = useOrderStore();
function onOrderCancel(outTradeNo: string) {
  console.log(outTradeNo)
  orderStore
    .closeOrder({ outTradeNo })
    .then(() => {
      showToast({ message: '取消订单成功', duration: 1500 });
      onRefresh();
    })
    .catch((err) => {
      console.error(err);
    });
}

function onOrderDelete(outTradeNo: string) {
  orderStore
    .deleteOrder({ outTradeNo })
    .then(() => {
      showToast({ message: '删除订单成功', duration: 1500 });
      router.back();
    })
    .catch((err) => {
      console.error(err);
    });
}

function payOrder(payParam) {
  return API_ORDER.orderPay(payParam);
}

const submitLoading = ref(false);
async function onOrderPay(_orderId: number) {
  // showToast({ message: '未开放：收银台', duration: 1500 });
  showLoadingToast({
    forbidClick: true,
    message: '订单创建中...',
    duration: 0,
  });
  submitLoading.value = true;
  const orderPayParam = {
    outTradeNo: orderInfo.value.outTradeNo,
    productId: goods.value[0].productId,
    serviceId: goods.value[0].serviceId,
  }

  try {
    await payOrder(orderPayParam);
    closeToast();
    submitLoading.value = false;
    router.replace({
      path: '/order/payResult',
      query: {
        outTradeNo: orderInfo.value.outTradeNo,
      },
    });
  } catch (error) {
    closeToast();
    submitLoading.value = false;
    console.error(error);
  }

}

function onConcatService() {
  makePhoneCall({
    phoneNumber: '88881234', // 模拟打电话
  });
}

function onOrderDelivery(outTradeNo: string) {
  showConfirmDialog({
    title: '提示',
    message: '确认您已收到上门服务？',
  })
    .then(() => {
      // on confirm
      showLoadingToast({
        forbidClick: false,
        message: '加载中...',
        duration: 0,
      });
      API_ORDER.orderDelivery({ outTradeNo }).then(() => {
        closeToast();
        showToast({ message: '确认收货成功', duration: 1500 });
        onRefresh();
      });
    })
    .catch(() => {
      // on cancel
    });
}

function onGoodClicked(id: number) {
  router.push({
    path: '/good/detail',
    query: {
      id,
    },
  });
}

function onCopy(text: string) {
  setClipboardData({ data: text }).then(() => {
    showToast({
      message: '复制成功',
      duration: 1500,
    });
  });
}

function onRefresh() {
  getDetail();
}

function formatDatetime(datetime: string) {
  const date = new Date(datetime);

  // Get the components (year, month, day, hour, minute, second)
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are 0-based, so add 1
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  // Create a formatted date string
  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
  return formattedDate;
}

function getOrderStatus(input) {
  switch (input) {
    case 'NEW':
      return '未支付订单';
    case 'PAY':
      return '订单已支付';
    case 'CANCEL':
      return '订单已取消';
    case 'REVIEW':
      return '订单待评价';
    case 'COMPLETE':
      return '订单已完成';
    default:
      return '未知状态';
  }
}

const isLoading = ref(false);
const pullRefreshDisabled = ref(false);
const orderInfo = ref<Recordable>({});
const goods = ref<Recordable[]>([]);
const logistics = ref<Recordable>({});
const logList = ref<Recordable[]>([]);

function getDetail() {
  API_ORDER.orderDetail({ outTradeNo: route.query.outTradeNo })
    .then((res) => {
      orderInfo.value = res.data.orderInfo;
      goods.value = res.data.goods;
      logList.value = res.data.logs;
      logistics.value = res.data?.logistics ?? {};

      // 待支付的订单
      if (unref(orderInfo).state === 'NEW' && unref(orderInfo).dateClose) {
        const end = dayjs(unref(orderInfo).dateClose);
        const now = dayjs();
        closeTime.value = end.diff(now);
      }
    })
    .finally(() => {
      isLoading.value = false;
    });
}

const closeTime = ref(0);
function onCountDownFinish() {
  onRefresh();
}

watchEffect(() => {
  if (unref(stepsPopupShow) || unref(ratePopupShow)) {
    pullRefreshDisabled.value = true;
  } else {
    pullRefreshDisabled.value = false;
  }
});
// pullRefreshDisabled
</script>

<template>
  <div class="container">
    <van-pull-refresh v-model="isLoading" :disabled="pullRefreshDisabled" @refresh="onRefresh">
      <div class="header">
        <div :class="['order-status', `order-status--${orderInfo.state}`]">
          <div class="order-status-title">{{ getOrderStatus(orderInfo.state) }}</div>
          <template v-if="orderInfo.state === 'NEW' && closeTime > 0">
            <div class="order-status-desc">
              请于<van-count-down class="count-down" :time="closeTime" format="mm 分 ss 秒" @finish="onCountDownFinish" />内付款，
              超时订单将自动关闭
            </div>
          </template>
        </div>
        <!-- <div class="order-step" @click="onStepsOpen">
          <span class="order-step-label">订单跟踪</span>
          <van-icon class="order-step-icon" name="arrow" />
        </div> -->
        <OrderSteps v-model:show="stepsPopupShow" :list="logList" />
      </div>
      <!-- <template v-if="orderInfo.isNeedLogistics">
        <div class="address van-hairline--top">
          <div class="address-hd">
            <div class="address-inner">
              <van-icon name="location-o" class="address-inner-icon" />
              <div class="address-inner-title">收货人：{{ logistics.linkMan }}</div>
              <div class="address-inner-title">{{ logistics.mobile }}</div>
            </div>
            <div class="address-inner-bottom">收货地址：{{ logistics.address }}</div>
          </div>
        </div>
        <van-cell title="物流信息" class="cell">
          <template v-if="logistics.trackingNumber">
            {{ logistics.shipperName }} {{ logistics.trackingNumber }}
          </template>
          <template v-else>无</template>
        </van-cell>
      </template> -->
      <!-- 商品列表 -->
      <div class="section">
        <div class="section-header van-hairline--bottom">
          <van-icon class="section-header-icon" name="shop-o" />
          <span class="section-header-title">已预约服务</span>
        </div>
        <div class="list">
          <div v-for="(item, index) in goods" :key="index" class="list-item" @click="onGoodClicked(item.serviceId)">
            <van-image fit="contain" class="list-item-pic" :src="item.servicePic" />
            <div class="list-item-content">
              <div class="list-item-title">{{ item.serviceName }}-{{ item.productName }}</div>
              <div class="list-item-desc">
                <div class="list-item-prop">
                  服务时间：{{ orderInfo.serviceTime }}
                </div>
              </div>
              <div class="list-item-bottom">
                <div class="list-item-price text-primary-color">
                  <span class="list-item-price-symbol">¥</span>
                  <span class="list-item-price-integer">{{ decimalFormat(item.amount) }}</span>
                </div>
                <!-- <div class="list-item-number">x{{ item.number }}</div> -->
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="subtotal">
          <span class="subtotal-label">商品小计：</span>
          <span class="subtotal-price">
            <span class="subtotal-price-symbol">¥</span>
            <span class="subtotal-price-integer">{{ decimalFormat(orderInfo.totalAmount) }}</span>
          </span>
        </div> -->
      </div>
      <!-- 备注 -->
      <div class="section">
        <van-cell title="买家留言" class="cell" :value="orderInfo.remark || '无'" />
      </div>
      <!-- 金额统计信息 -->
      <div class="section">
        <!-- <div class="amount">
          <div class="amount-hd">服务金额</div>
          <div class="amount-bd">¥ {{ decimalFormat(orderInfo.totalAmount) }}</div>
        </div> -->
        <!-- <div v-if="orderInfo.isNeedLogistics" class="amount">
          <div class="amount-hd">运费</div>
          <div class="amount-bd">+ {{ decimalFormat(orderInfo.amountLogistics) }}</div>
        </div> -->
        <div class="amount amount-total-price">
          <span class="amount-total-price-label">{{ orderInfo.state === 'NEW' ? '需付款：' : '实付款：' }}</span>
          <Price class="amount-total-price-price" :price="orderInfo.payAmount" />
        </div>
      </div>
      <!-- 订单信息 -->
      <div class="section">
        <div class="order-no">
          <div class="order-no-p">
            订单编号：
            <span class="order-no-p-value">{{ orderInfo.outTradeNo }}</span>
            <van-button class="order-no-copy-btn" plain type="default" size="mini" @click="onCopy(orderInfo.outTradeNo)">
              复制
            </van-button>
          </div>
          <div class="order-no-p">
            下单时间：
            <span class="order-no-p-value"> {{ formatDatetime(orderInfo.createTime) }}</span>
          </div>
          <div class="order-no-p">
            支付方式：
            <span class="order-no-p-value">在线支付</span>
          </div>
          <div class="order-no-p">
            付款方式：
            <span class="order-no-p-value">钱包余额</span>
          </div>
          <div class="order-no-p">
            联系客服:
            <van-button icon="service" class="action-bar-btn-small" round @click.stop="onConcatService"> 联系客服
            </van-button>
          </div>
          <div class="order-no-p">
            上门地址:
            <span class="order-no-p-value">{{ orderInfo.receiverAddress }}</span>
          </div>
          <!-- <div v-if="orderInfo.isNeedLogistics" class="order-no-p">
            配送方式：
            <span class="order-no-p-value"> 普通快递</span>
          </div> -->
        </div>
      </div>
    </van-pull-refresh>
    <!-- 底部操作栏 -->
    <div class="action-bar-wrap">
      <div class="action-bar">
        <!-- ▼ 操作按钮组（一行最好不要超过3个） -->
        <template
          v-if="orderInfo.state === 'PAY' || orderInfo.state === 'CANCEL' || orderInfo.state === 'REVIEW' || orderInfo.state === 'COMPLETE'">
          <van-button class="action-bar-btn" round @click.stop="onOrderDelete(orderInfo.outTradeNo)"> 删除订单 </van-button>
        </template>
        <template v-if="orderInfo.state === 'NEW'">
          <div class="action-bar-hd">
            <span class="action-bar-total">合计：</span>
            <div class="action-bar-price">
              <span class="action-bar-price-symbol">¥</span>
              <span class="action-bar-price-integer">{{ decimalFormat(orderInfo.payAmount) }}</span>
            </div>
          </div>
          <van-button class="action-bar-btn" round plain @click.stop="onOrderCancel(orderInfo.outTradeNo)">
            取消订单
          </van-button>
          <van-button class="action-bar-btn" round type="primary" @click.stop="onOrderPay">
            去支付
          </van-button>
        </template>
        <!-- <template v-if="orderInfo.state === 'NEW'">
          <van-button icon="service" class="action-bar-btn" round @click.stop="onConcatService"> 联系客服 </van-button>
        </template> -->
        <template v-if="orderInfo.state === 'PAY'">
          <van-button class="action-bar-btn" round @click.stop="onOrderDelivery(orderInfo.outTradeNo)">确认消费</van-button>
        </template>
        <template v-if="orderInfo.state === 'REVIEW'">
          <!-- <template v-if="orderInfo.state === 'REVIEW'"> -->
          <van-button class="action-bar-btn" round @click.stop="onOrderReputation">评价</van-button>
        </template>
        <!-- ▲ 操作按钮组 -->
      </div>
    </div>
    <!-- 评价弹层-->
    <OrderRate v-model:show="ratePopupShow" :goods="goods" :order-info="orderInfo" @success="onRateSuccess" />
  </div>
</template>

<style lang="less" scoped>
.header {
  box-sizing: border-box;
  position: relative;
  padding: 0 15px;
  background: var(--color-bg-2);
}

.order-status {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px 90px 10px 52px;
  min-height: 40px;
  background: url('@/assets/images/order/icon_status.png') 0 no-repeat;
  background-size: 40px 40px;

  &---1 {
    background-image: url('@/assets/images/order/icon_status_-1.png');
  }

  &--1 {
    background-image: url('@/assets/images/order/icon_status_1.png');
  }

  &--2 {
    background-image: url('@/assets/images/order/icon_status_2.png');
  }

  &-title {
    font-size: 14px;
    font-weight: bold;
    color: var(--color-text-1);
  }

  &-desc {
    font-size: 12px;
    color: var(--color-text-2);
  }

  .count-down {
    display: inline-flex;
    font-size: 12px;
    color: var(--color-text-2);
  }
}

.order-step {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
  color: var(--color-text-3);
  font-size: 14px;

  &-icon {
    margin-left: 5px;
  }
}

.address {
  position: relative;
  box-sizing: border-box;
  min-height: 60px;
  // display: flex;
  // justify-content: flex-start;
  // align-items: center;
  padding: 8px 15px;
  background: var(--color-bg-2);

  &-hd {
    flex: 1;
    // padding:0 10px;
    padding-left: 20px;
  }

  &-bd {
    margin-top: 10px;
    padding: 10px 15px 5px;
    font-size: 14px;
    color: #333;
  }

  &-inner {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-icon {
      position: absolute;
      top: 2px;
      left: -20px;
    }

    &-title {
      font-size: 14px;
      color: #333;
      font-weight: bold;
      margin-bottom: 5px;
    }

    &-bottom {
      font-size: 12px;
      color: #999;
    }
  }

  &:before {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 2px;
    background: -webkit-repeating-linear-gradient(135deg,
        #ff6c6c 0,
        #ff6c6c 20%,
        transparent 0,
        transparent 25%,
        #1989fa 0,
        #1989fa 45%,
        transparent 0,
        transparent 50%);
    background: repeating-linear-gradient(-45deg,
        #ff6c6c 0,
        #ff6c6c 20%,
        transparent 0,
        transparent 25%,
        #1989fa 0,
        #1989fa 45%,
        transparent 0,
        transparent 50%);
    background-size: 80px;
    content: '';
  }
}

.mb10 {
  margin-bottom: 10px;
}

.mt10 {
  margin-top: 10px;
}

.list {
  &-item {
    position: relative;
    box-sizing: border-box;
    padding: 8px 15px;
    display: flex;
    align-items: center;

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
    }

    &-title {
      font-size: 14px;
      line-height: 16px;
      color: var(--color-text-1);
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-top: 10px;
    }

    &-desc {
      flex: 1;
      font-size: 12px;
      line-height: 20px;
      color: var(--color-text-3);
    }

    &-price {
      color: var(--color-text-1);
      margin-bottom: 10px;

      &-symbol {
        font-size: 12px;
        margin-right: 2px;
      }

      &-integer {
        font-size: 18px;
        font-family: @font-family-price-integer;
      }
    }

    &-bottom {
      font-size: 12px;
      color: var(--color-text-3);
    }
  }
}

.section {
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  margin: 12px 0;
  // border-radius: 8px;
  background-color: var(--color-bg-2);

  &-header {
    font-size: 14px;
    padding: 10px 15px;
    display: flex;
    align-items: center;
    margin-bottom: 2px;

    &-icon {
      margin-right: 8px;
      font-size: 18px;
    }

    &-title {
      font-weight: bold;
    }

    &.van-hairline--bottom::after {
      right: -40%;
      left: -40%;
    }
  }
}

.subtotal {
  box-sizing: border-box;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 44px;
  font-size: 14px;
  color: var(--color-text-1);

  &-num {
    margin-right: 8px;
  }

  &-price {
    color: var(--color-primary);

    &-symbol {
      font-size: 12px;
      margin-right: 2px;
    }

    &-integer {
      font-size: 16px;
      font-family: @font-family-price-integer;
    }
  }
}

.cell {
  font-size: 14px;

  .van-cell__title {
    color: var(--color-text-3);
  }

  .van-cell__value {
    color: var(--color-text-1);
  }
}

.amount {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  font-size: 14px;

  &-hd {
    margin-right: 10px;
    color: var(--color-text-3);
  }

  &-bd {
    flex: 1;
    margin-left: 10px;
    text-align: right;
    color: var(--color-text-1);
  }

  &-total-price {
    height: 48px;
    padding: 0 15px;
    color: var(--color-text-1);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 12px;

    &-price {
      color: var(--color-primary);
    }
  }
}

.order-no {
  font-size: 12px;
  padding: 10px 15px;

  &-p {
    height: 24px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    color: var(--color-text-3);

    &-value {
      margin-left: 10px;
      color: var(--color-text-1);
    }
  }

  &-copy-btn {
    margin-left: 5px;
  }
}

.action-bar {
  box-sizing: border-box;
  position: fixed;
  left: 0;
  bottom: var(--safe-area-height-bottom);
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
    justify-content: flex-start;
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

  &-btn {
    height: 32px;
    padding: 0 8px;
    min-width: 80px;
    font-size: 14px;

    &:not(:last-child) {
      margin-right: 12px;
    }

    &-small {
      height: 24px;
      font-size: 12px;
      margin-left: 14px;
      padding: 0 8px;
    }
  }
}
</style>
