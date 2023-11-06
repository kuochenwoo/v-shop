<script lang="ts">
export default {
  name: 'OrderList',
};
</script>

<script setup lang="ts">
import { reactive, ref, unref } from 'vue';
import { useRoute } from 'vue-router';

import API_ORDER from '@/apis/order';
import OrderItem from './components/OrderItem.vue';
import { orderListModel } from '@/model/modules/order/list';
import { usePage } from '@/hooks/shared/usePage';

const route = useRoute();
const { onMountedOrActivated } = usePage();

onMountedOrActivated(() => {
  const { status } = route.query;
  if (status) {
    active.value = unref(tabList).findIndex((item) => item.status === status);
  }

  listRef.value?.loadData();
});

const tabList = ref<Recordable[]>([
  { name: '全部', status: '' },
  { name: '待付款', status: 'NEW' },
  { name: '已完成', status: 'PAY' },
  { name: '超时取消', status: 'CANCEL' },
]);

const active = ref(0);

function onTabClicked() {
  listQueryType.value = 'query';
  listRef.value?.refresh();
  // if (item.status === 'PAY' || item.status === 'REVIEW') {
  //   listRef.value?.refresh('COMPLETE');
  // } else {
  //   listRef.value?.refresh(item.status);
  // }
}

const listRef = ref<any>(null);
const list = ref<Recordable[]>([]);
const pagination = reactive({
  pageCurrent: 1,
  pageSize: 10,
});
const listQueryType = ref('query');

const listMeta = reactive({
  loadingText: '订单加载中...',
  emptyText: '暂无订单',
});

function onOrderItemDelete(_item, index: number) {
  list.value.splice(index, 1);
}

function getOrderList() {
  const params = {
    page: pagination.pageCurrent,
    pageSize: pagination.pageSize,
    status: unref(tabList)[unref(active)].status,
  };

  listMeta.emptyText = unref(listQueryType) === 'search' ? '未找到符合条件数据' : '暂无订单';

  return API_ORDER.orderList(params);
}

function listAfterFetch(data) {
  const records = orderListModel(data?.current_data ?? [], data?.goodsMap ?? []);
  const filteredRecords = records.filter(item => item.del !== 1);
  return filteredRecords;
}
</script>

<template>
  <div class="container">
    <van-sticky>
      <div class="header">

        <van-tabs v-model:active="active" @click-tab="onTabClicked">
          <van-tab v-for="(item, index) in tabList" :key="index" :title="item.name" />
        </van-tabs>
      </div>
    </van-sticky>

    <ProList ref="listRef" v-model:dataSource="list" mode="infinite" :api="getOrderList" :afterFetch="listAfterFetch"
      :pagination="pagination" :meta="listMeta">
      <div class="list">
        <OrderItem v-for="(item, index) in list" :key="item.id" :item="item" :index="index" @delete="onOrderItemDelete" />
      </div>
    </ProList>
  </div>
</template>

<style lang="less" scoped>
// ...
</style>
