<script setup lang="ts">
import type { PropType } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import Price from '@/components/Price/index.vue';
// import { decimalFormat } from '@/utils/format';

import { useOrderStore } from '@/store/modules/order';

defineProps({
  item: { type: Object as PropType<Recordable>, default: () => { } },
  index: { type: Number, default: 0 },
});
const emit = defineEmits(['delete']);
const router = useRouter();
const orderStore = useOrderStore();

function onOrderClicked(item: Recordable) {

  const { outTradeNo } = item;
  router.push({
    path: '/order/detail',
    query: {
      outTradeNo,
    },
  });
}

function onConcatService(_item: Recordable) {
  showToast({ message: '请拨打商家电话：88888888', duration: 5000 });
}

function onOrderCancel(item: Recordable) {
  orderStore
    .closeOrder({ outTradeNo: item.outTradeNo })
    .then(() => {
      showToast({ message: '取消订单成功', duration: 1500 });
      item.state = 'CANCEL';
      item.statusStr = `订单关闭`;
    })
    .catch((err) => {
      console.error(err);
    });
}

function onOrderDelete(item: Recordable, index: number) {
  orderStore
    .deleteOrder({ outTradeNo: item.outTradeNo })
    .then(() => {
      showToast({ message: '删除订单成功', duration: 1500 });
      emit('delete', item, index);
    })
    .catch((err) => {
      console.error(err);
    });
}
</script>

<template>
  <div class="list-item">
    <div class="list-item-header van-hairline--bottom">
      <div class="list-item-header-hd">
        <div class="list-item-header-hd-title">订单编号</div>
        <div class="list-item-header-hd-number">{{ item.outTradeNo }}</div>
      </div>
      <div :class="['list-item-header-state', item.status !== -1 ? 'text-primary-color' : '']">
        {{ item.statusStr }}
      </div>
    </div>
    <div class="list-item-body" @click="onOrderClicked(item)">
      <div v-if="item.goodsInfo" class="good-card">
        <van-image fit="contain" class="good-card-pic" :src="item.orderItemVOList[0].servicePic" />
        <div class="good-card-content">
          <div class="good-card-content-hd">
            <div class="good-card-title">{{ item.orderItemVOList[0].serviceName }} - {{
              item.orderItemVOList[0].productName }}</div>
            <div class="good-card-prop">服务时间：{{ item.serviceTime }}</div>
          </div>
          <!-- <div class="good-card-content-bd">
            <div class="good-card-price">¥{{ decimalFormat(item.totalAmount) }}</div>
          </div> -->
        </div>
      </div>
      <!-- <div v-if="item.goodsNumber > 1" class="list-item-more">查看全部{{ item.goodsNumber }}件商品</div> -->
      <div class="list-item-total van-hairline--top">
        <!-- <span class="list-item-total-number">共{{ item.goodsNumber }}件商品</span> -->
        <div class="list-item-total-price">
          <span class="list-item-total-price-label"> {{ item.state === 'NEW' ? '需付款：' : '实付款：' }}</span>
          <Price :price="item.payAmount" />
        </div>
      </div>
    </div>
    <!-- ▼ 操作按钮组（一行最好不要超过3个） -->
    <div class="list-item-footer van-hairline--top">
      <template v-if="item.state === 'CANCEL' || item.state === 'PAY'">
        <van-button class="list-item-action-btn" round @click.stop="onOrderDelete(item, index)"> 删除订单 </van-button>
      </template>
      <template v-if="item.state === 'NEW'">
        <van-button class="list-item-action-btn" round plain @click.stop="onOrderCancel(item)"> 取消订单 </van-button>
        <van-button class="list-item-action-btn" round plain type="primary" @click.stop="onOrderClicked(item)">
          去支付
        </van-button>
      </template>
      <template v-if="item.state === 'NEW' || item.state === 'PAY' || item.state === 'CANCEL'">
        <van-button icon="service" class="list-item-action-btn" round @click.stop="onConcatService(item)">
          联系客服
        </van-button>
      </template>
    </div>
    <!-- ▲ 操作按钮组 -->
  </div>
</template>

<style lang="less" scoped>
.list {
  &-item {
    .van-hairline--bottom::after {
      right: -44%;
      left: -44%;
    }

    margin: 10px;
    border-radius: 8px;
    background: var(--color-bg-2);
    padding-bottom: 10px;

    &-header {
      display: flex;
      padding: 10px 12px;
      align-items: center;
      font-size: 14px;
      color: var(--color-text-1);


      &-hd {
        flex: 1;
        margin-right: 10px;

        &-title {
          font-weight: bold;
          font-size: small;
        }

        &-number {
          font-size: small;
          overflow: hidden;
          width: 70%;
          text-overflow: ellipsis;
          font-weight: 300;
          color: grey;
        }
      }

      &-state {
        text-align: right;
        color: var(--color-text-3);
      }
    }

    &-more {
      font-size: 14px;
      color: var(--color-text-3);
      padding: 5px;
      line-height: 28px;
      text-align: center;
    }

    &-total {
      height: 48px;
      padding: 0 12px;
      color: var(--color-text-1);
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 12px;

      &-number {
        margin-right: 5px;
      }

      &-price {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 12px;
      }
    }

    &-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 10px 10px 0;
    }

    &-action-btn {
      height: 32px;
      padding: 0 8px;
      min-width: 80px;
      font-size: 14px;

      &:not(:last-child) {
        margin-right: 12px;
      }
    }
  }
}

.good-card {
  position: relative;
  box-sizing: border-box;
  padding: 12px 12px 10px;
  display: flex;
  align-items: center;

  &-pic {
    width: 72px;
    height: 72px;
    border-radius: 8px;
    margin-right: 8px;
    overflow: hidden;
  }

  &-content {
    flex: 1;
    display: flex;

    &-hd {
      flex: 1;
      margin-right: 12px;
    }

    &-bd {
      text-align: right;
    }
  }

  &-title {
    font-size: 14px;
    color: var(--color-text-1);
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &-prop {
    font-size: 12px;
    color: var(--color-text-3);
    line-height: 16px;
    margin-top: 8px;
  }

  &-price {
    color: var(--color-text-1);
    letter-spacing: 0;
    font-size: 14px;
  }

  &-number {
    color: var(--color-text-3);
    line-height: 16px;
    margin-top: 8px;
    font-size: 12px;
  }
}
</style>
