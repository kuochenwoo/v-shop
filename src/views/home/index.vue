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

function getTagsArray(tagsString) {
  return tagsString.split(",").map(tag => tag.trim());
}

const listRef = ref<any>(null);
const list = ref<Recordable[]>([]);
const pagination = reactive({
  pageCurrent: 1,
  pageSize: 10,
});
const listMeta = reactive({
  loadingText: '努力加载中...',
  emptyText: '暂无数据',
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

function generateRandomNumber() {
  // 生成一个介于8到15之间的随机整数
  return Math.floor(Math.random() * 8) + 8;
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
      <van-swipe :autoplay="3000" class="advertise">
        <van-swipe-item v-for="item in adList" :key="item.id" class="advertise-item" @click="onAdClick(item.id)">
          <h1>
            {{ item.title }}
          </h1>
          <van-image class="advertise-item-img" fit="cover" :src="item.picUrl" :alt="item.title" />
        </van-swipe-item>
      </van-swipe>
      <ProList ref="listRef" v-model:dataSource="list" mode="infinite" :api="getGoodList" :pagination="pagination"
        :meta="listMeta">
        <div class="list">
          <div v-for="item in list" :key="item.id" class="list-col">
            <van-card :price="item.minPrice" :thumb="item.pic" :origin-price="item.originalPrice"
              @click="onItemClick(item.id)">
              <template v-if="item.recommendStatus === 1" #tag>
                <van-tag type="primary" color="red">推荐</van-tag>
              </template>
              <template #tags>
                <div class="card-tag-service">
                  <van-tag v-for="tag in getTagsArray(item.tags)" :key="tag" plain type="primary"
                    style="font-size: xx-small; margin-right: 3%; margin-bottom: 2%;" text-color="darkgoldenrod">
                    {{ tag }}
                  </van-tag>
                </div>
              </template>
              <template #title>
                <div class="card-title">
                  {{ item.name }}
                </div>
              </template>
              <template #footer>
                <div class="card-other-info">
                  <div class="list-item-appointment">
                    <span class="list-item-appointment-bk1">最早可约：</span>
                    <span class="list-item-appointment-bk2">12:00</span>
                  </div>
                  <div class="list-item-distance">最近技师：{{ generateRandomNumber() }}分钟</div>
                </div>
              </template>
              <template #desc>
                <div class="card-desc">
                  {{ item.description }}
                </div>
              </template>
              <template #bottom>
                <van-button size="normal" class="order-button" color="linear-gradient(to right, #FFC73AFA, #ED5B00EE)"
                  @click.stop="onBookClicked">预约</van-button>
              </template>
            </van-card>
          </div>
        </div>
      </ProList>
    </div>
    <!-- 底部导航栏 -->
    <Tabbar />
  </div>
</template>

<style lang="less" scoped>
.order-button {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 35%;
  width: 35%;
}


.list {
  &-item {
    &-distance {
      margin-top: 3%;
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
        display: flex;
        align-items: center;
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
        display: flex;
        align-items: center;
      }
    }
  }
}

.card {
  &-title {
    font-weight: 600;
    font-size: 14px;
  }

  &-other {
    &-info {
      position: absolute;
      right: 5%;
      top: 10%;
    }
  }

  &-desc {
    color: darkslateblue;
    font-size: 10px;
  }

  &-tag {
    &-service {
      margin-top: 1%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
      width: 60%;
      color: gold;
    }
  }
}

.swiper {
  width: 100%;
  height: 190px;
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
  // padding-left: 5px;
  // padding-right: 5px;

  &-col {
    width: 100%;
    box-sizing: border-box;
    // padding-left: 5px;
    // padding-right: 5px;
    // margin-bottom: 10px;
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
