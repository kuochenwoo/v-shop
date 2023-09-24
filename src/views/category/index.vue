<script lang="ts">
export default {
  name: 'Category',
};
</script>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import API_GOODS from '@/apis/goods';
import API_BANNER from '@/apis/banner';
import Coupons from '@/views/good/components/Coupons.vue';
import IMAGE_LIST_EMPTY from '@/assets/images/empty/good.png';

onMounted(() => {
  getBannerList();
  listRef.value?.loadData();
});

const router = useRouter();

const bannerList = ref<Recordable[]>([]);

function getBannerList() {
  API_BANNER.bannerList({ type: 'indexBanner' }).then((res) => {
    bannerList.value = res.data || [];
  });
}

function onBannerClicked(linkUrl: string) {
  if (linkUrl) {
    window.location.href = linkUrl;
  }
}

function formatTime(itemTime) {
  // 创建一个新的Date对象，将后端返回的时间字符串解析为日期对象
  const backendTime = new Date(itemTime);

  // 获取当前时间
  const currentTime = new Date();

  // 将后端时间转化为UTC+8时区的时间
  const utc8Time = backendTime;
  console.log(111, currentTime);
  console.log(222, backendTime);
  // 判断后端时间是否早于当前时间
  if (utc8Time < currentTime) {
    return '现在可约';
  } else {
    // 判断日期是否大于今天
    if (
      utc8Time.getUTCFullYear() > currentTime.getUTCFullYear() ||
      (utc8Time.getUTCFullYear() === currentTime.getUTCFullYear() &&
        utc8Time.getUTCMonth() > currentTime.getUTCMonth()) ||
      (utc8Time.getUTCFullYear() === currentTime.getUTCFullYear() &&
        utc8Time.getUTCMonth() === currentTime.getUTCMonth() &&
        utc8Time.getUTCDate() > currentTime.getUTCDate())
    ) {
      // 显示“明天”加上小时和分钟
      const hours = utc8Time.getUTCHours().toString().padStart(2, '0');
      const minutes = utc8Time.getUTCMinutes().toString().padStart(2, '0');
      return `明天 ${hours}:${minutes}`;
    } else if (
      utc8Time.getUTCFullYear() === currentTime.getUTCFullYear() &&
      utc8Time.getUTCMonth() === currentTime.getUTCMonth() &&
      utc8Time.getUTCDate() === currentTime.getUTCDate()
    ) {
      // 显示“今天”加上小时和分钟
      const hours = utc8Time.getUTCHours().toString().padStart(2, '0');
      const minutes = utc8Time.getUTCMinutes().toString().padStart(2, '0');
      return `今天 ${hours}:${minutes}`;
    }
  }

  // 默认情况下返回空字符串
  return '';
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

function getProductList() {
  const params = {
    page: pagination.pageCurrent,
    pageSize: pagination.pageSize,
  };
  // 参数由form-data传入
  return API_GOODS.productList(params);
}

function onGoodClicked(id: number) {
  router.push({ path: '/good/detail', query: { id } });
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
      <Plate class="section-header" title="技师列表" />
      <ProList ref="listRef" v-model:dataSource="list" mode="infinite" :api="getProductList" :pagination="pagination"
        :meta="listMeta">
        <div class="list">
          <div v-for="item in list" :key="item.id" class="list-col">
            <div class="list-item" style="display: flex;">
              <div v-if="item.available" class="list-item-badge">可服务</div>
              <van-image class="list-item-photo" :src="item.coverImg" :alt="item.name" />

              <div class="list-item-info">

                <div class="list-item-info-more">
                  <div class="list-item-title">{{ item.name }}</div>
                  <div class="list-item-detail-more">
                    <div class="list-item-distance">车程约：{{ item.distance }}分钟</div>
                    <div class="list-item-appointment">
                      <span class="list-item-appointment-bk1">最早可约：</span>
                      <span class="list-item-appointment-bk2">{{ formatTime(item.availableTime) }}</span>
                    </div>
                  </div>
                </div>
                <div class="list-item-detail">{{ item.detail }}</div>
                <div class="reputation-inner-stars">
                  <van-rate v-model="item.role" :size="14" color="#f44" icon="like" void-icon="like" void-color="#eee"
                    readonly :count="item.role" />
                </div>
                <div class="list-item-price">
                  <div class="list-item-review">
                    <Coupons title="查看评价" />
                  </div>
                  <van-button type="primary" plain class="buy-btn" @click="onGoodClicked(item.id)">立即预约</van-button>
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
    width: 104%;
    height: 100%;
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
      top: 5px;
      left: 0;
      z-index: 20;
      display: inline-block;
      padding: 2px 4px;
      color: #fff;
      background-color: #ee0a247a;
      line-height: normal;
      border-radius: 0 8px 8px 0;
      padding-right: 6px;
      font-size: 10px;
    }

    &-photo {
      display: flex;
      width: 70%;
      height: 80%;
      // height: 172px;
    }

    &-info {
      padding: 5px 10px;
      width: 65%;
      background-color: aliceblue;

      &-more {
        display: flex;
        height: 30%;
        justify-content: space-between;
      }
    }

    &-distance {
      font-size: 10px;
      color: grey;
      text-align: right;
    }

    &-appointment {
      font-size: 10px;
      font-weight: 500;
      border-radius: 5px;
      padding-left: 5px;
      background-color: #221406;
      display: flex;

      &-bk1 {
        border-radius: 5px;
        color: burlywood;
      }

      &-bk2 {
        flex: 1;
        color: #2e1d05;
        padding-right: 5px;
        padding-left: 5px;
        background-color: darksalmon;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
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
      width: 25%;
      margin-top: auto;
    }

    &-detail {
      font-size: 10px;
      display: flex;
      align-items: flex-start;
      justify-content: left;
      color: darkgoldenrod;

      &-more {}
    }

    &-sold {
      text-align: right;
      width: 30%;
      font-size: small;
      font-family: emoji;
      margin-top: auto;
    }

    &-review {
      height: 25px;
      margin-left: -15px;
    }

    &-price {
      margin-bottom: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      align-content: stretch;
      text-align: right;
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

.reputation {
  background: var(--color-bg-2);

  &-inner {
    padding: 0 15px;
    font-size: 14px;

    &-hd {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 10px;
      font-size: 14px;
      color: var(--color-text-1);
    }

    &-media {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 5px;
    }

    &-name {
      flex: 1;
    }

    &-stars {}

    &-tag {
      padding: 2px 10px;
      border-radius: 10px;
      border: 1px solid var(--color-border-1);
      font-size: 10px;
      color: var(--color-text-3);
      margin-right: 10px;
    }

    &-bd {
      padding: 10px 0;
    }

    &-ft {
      padding: 5px 0 10px;
      color: var(--color-text-3);
    }

    &-prop {
      margin-top: 5px;
      font-size: 12px;
    }
  }
}
</style>
