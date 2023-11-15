<script lang="ts">
export default {
  name: 'Home',
};
</script>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import API_GOODS from '@/apis/goods';
import API_BANNER from '@/apis/banner';
import IMAGE_LIST_EMPTY from '@/assets/images/empty/good.png';

onMounted(() => {
  getBannerList();
  getAdList();
  listRef.value?.loadData();
});

const router = useRouter();
const bannerList = ref<Recordable[]>([]);
const adList = ref<Recordable[]>([]);

function getBannerList() {
  API_BANNER.bannerList({ type: 'indexBanner' }).then((res) => {
    bannerList.value = res.data || [];
  });
}

function getAdList() {
  API_BANNER.adList({}).then((res) => {
    adList.value = res.data || [];
  });
}

function onBannerClicked(linkUrl: string) {
  if (linkUrl) {
    window.location.href = linkUrl;
  }
}

const listRef = ref<any>(null);
const list = ref<Recordable[]>([]);
const pagination = reactive({
  pageCurrent: 1,
  pageSize: 10,
});
const listMeta = reactive({
  loadingText: '努力加载中...',
  emptyText: '暂无商品',
  emptyImage: IMAGE_LIST_EMPTY,
});

function getGoodList() {
  const params = {
    page: pagination.pageCurrent,
    pageSize: pagination.pageSize,
  };
  // 参数由form-data传入
  return API_GOODS.goodsList(params);
}

function onItemClick(id: number) {
  router.push({ path: '/good/detail', query: { id } });
}

function onAdClick(id: number) {
  router.push({ path: '/ad/detail', query: { id } });
}

function onBookClicked() {
  // 否则，执行跳转到预约页面的逻辑
  router.push({ path: '/category' });
}
</script>

<template>
  <div class="container">
    <div class="swiper">
      <van-swipe :autoplay="5000" class="swiper">
        <van-swipe-item v-for="item in bannerList" :key="item.id" class="swiper-item"
          @click="onBannerClicked(item.linkUrl)">
          <van-image class="swiper-item-img" fit="cover" :src="item.picUrl" :alt="item.title" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="main">
      <Plate class="section-header" title="合作商家" />

      <van-swipe :autoplay="3000" class="advertise">
        <van-swipe-item v-for="item in adList" :key="item.id" class="advertise-item" @click="onAdClick(item.id)">
          <h1>
            {{ item.title }}
          </h1>
          <van-image class="advertise-item-img" fit="cover" :src="item.picUrl" :alt="item.title" />
        </van-swipe-item>
      </van-swipe>
      <Plate class="section-header" title="服务列表" />
      <ProList ref="listRef" v-model:dataSource="list" mode="infinite" :api="getGoodList" :pagination="pagination"
        :meta="listMeta">
        <div class="list">
          <div v-for="item in list" :key="item.id" class="list-col">
            <div class="list-item" style="display: flex;" @click="onItemClick(item.id)">
              <div v-if="item.recommendStatus" class="list-item-badge">推荐</div>
              <van-image class="list-item-photo" :src="item.pic" :alt="item.name" />
              <div class="list-item-info">
                <div class="list-item-info-more">
                  <div class="list-item-title">{{ item.name }}</div>
                  <div class="list-item-sold">已售：{{ item.numberOrders }}</div>
                </div>

                <div class="list-item-price">
                  <div class="price">
                    <div class="price-current">
                      <span class="price-current-symbol">¥</span>
                      <span class="price-current-integer">{{ item.minPrice }}</span>
                    </div>
                    <div v-if="item.originalPrice > 0" class="price-origin">
                      <span class="price-origin-symbol">¥</span>
                      <span class="price-origin-integer">{{ item.originalPrice }}</span>
                    </div>
                  </div>
                  <van-button type="primary" plain class="buy-btn" @click.stop="onBookClicked">预约</van-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProList>
    </div>
    <!-- 底部导航栏 -->
    <Tabbar />
  </div>
</template>

<style lang="less" scoped>
.swiper {
  width: 100%;
  height: 180px;
  margin-bottom: 10px;

  &-item,
  &-item-img {
    width: 100%;
    height: 100%;
  }
}

.advertise {
  width: 100%;
  height: 180px;
  margin-bottom: 10px;

  &-item,
  &-item-img {
    width: 100%;
    height: 100%;
  }
}

h1 {
  font-size: 15px;
  text-align: center;
  color: #8f1f1f;
  text-shadow: 0 0 25px #fff, 0 0 40px #fff, 0 0 55px #e600db, 0 0 70px #0073e6, 0 0 75px #0073e6, 0 0 90px #0073e6, 0 0 115px #0073e6;
  animation: blinker 2s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}

.list {
  display: flex;
  flex-wrap: wrap;
  padding-left: 5px;
  padding-right: 5px;

  &-col {
    width: 100%;
    box-sizing: border-box;
    padding-left: 5px;
    padding-right: 5px;
    margin-bottom: 10px;
  }

  &-item {
    position: relative;
    text-align: left;
    overflow: hidden;
    background: var(--color-bg-2);
    border-radius: 8px;
    // box-shadow: 0px 2px 4px 3px rgba(243, 243, 243, 0.5);

    &-badge {
      position: absolute;
      top: 15px;
      left: 0;
      z-index: 20;
      display: inline-block;
      padding: 2px 4px;
      color: #fff;
      background-color: var(--color-red);
      font-size: 10px;
      line-height: normal;
      border-radius: 0 8px 8px 0;
      padding-right: 6px;
    }

    &-photo {
      display: flex;
      width: 30%;
      height: 30%;
      // height: 172px;
    }

    &-info {
      padding: 5px 10px;
      width: 70%;

      &-more {
        display: flex;
        height: 60%;
      }
    }

    &-title {
      font-size: 14px;
      color: var(--color-text-1);
      min-height: 36px;
      line-height: 18px;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      width: 70%;
      margin-top: auto;
    }

    &-sold {
      text-align: right;
      width: 30%;
      font-size: small;
      font-family: emoji;
      margin-top: auto;
    }

    &-price {
      margin-bottom: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40%;
    }

    .buy-btn {
      height: 24px;
      padding: 0 8px;
      line-height: 24px;
    }

    .price {
      display: flex;
      align-items: center;

      &-current {
        margin-right: 5px;
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

      &-origin {
        font-size: 12px;
        text-decoration: line-through;
        color: var(--color-text-3);

        &-label {
          margin-right: 2px;
        }

        &-integer {
          text-decoration: line-through;
          font-family: @font-family-price-integer;
        }
      }
    }
  }
}
</style>
