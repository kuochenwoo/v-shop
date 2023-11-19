<script lang="ts">
export default {
  name: 'Category',
};
</script>

<script setup lang="ts">
import { ref, reactive, watchEffect, onMounted, unref } from 'vue';
import { Popup as VanPopup } from 'vant';
import { useRouter } from 'vue-router';
import API_GOODS from '@/apis/goods';
import API_BANNER from '@/apis/banner';
import Coupons from '@/views/good/components/Coupons.vue';
import IMAGE_LIST_EMPTY from '@/assets/images/empty/good.png';
import { usePage } from '@/hooks/shared/usePage';
import { showToast } from 'vant';
import API_CART from '@/apis/cart';
import { shoppingCartAddParams } from '@/apis/cart/types';

onMounted(() => {
  if (unref(hasLogin)) {
    getGoodList().then((res) => {
      product_list.value = res.data.result || [];
    });
  }
  selectedProductId = null;
  selectedServiceId = null;
});

let imgDetailArr = ref<any>(null);
const showImgPopup = ref(false);
const showPopup = (id: number) => {
  showImgPopup.value = true;
  let selectedObject = list.value.filter(obj => obj.id === id);
  const { introImg1, introImg2, introImg3, introImg4 } = selectedObject[0]
  imgDetailArr = [introImg1, introImg2, introImg3, introImg4];
  console.log(imgDetailArr)
};

const { hasLogin, goLogin } = usePage();
const bannerList = ref<Recordable[]>([]);

const router = useRouter();

const listEmptyImage = IMAGE_LIST_EMPTY;
const product_list = ref<Recordable[]>([]);
const product_list_ref = ref<any>(null);
// const listRef = ref<any>(null);
// const list = ref<Recordable[]>([]);
const checked = ref('1');
let selectedProductId = null;
let selectedServiceId = null;

const show = ref(false);

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

function getGoodList() {
  const params = {
    page: pagination.pageCurrent,
    pageSize: pagination.pageSize,
  };
  // 参数由form-data传入
  return API_GOODS.goodsList(params);
}

function formatTime(itemTime) {
  // 创建一个新的Date对象，将后端返回的时间字符串解析为日期对象
  const backendTime = new Date(itemTime);

  // 获取当前时间
  const currentTime = new Date();

  // 将后端时间转化为UTC+8时区的时间
  const utc8Time = backendTime;
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

function toggle(value: boolean) {
  show.value = value;
}

const onServiceClick = (id) => {
  selectedServiceId = id; // 保存选中项的 id
};

function onProductClicked(id) {
  // router.push({ path: '/good/detail', query: { id } });
  // getGoodList().then((res) => {
  //   product_list.value = res.data.result || [];
  // });

  // product_list = product_list.value
  toggle(true);
  selectedProductId = id;
}

watchEffect(() => {
  if (hasLogin.value) {
    getBannerList();
    listRef.value?.loadData();
  }
});

function onTaskSubmit() {
  if (selectedProductId === null) {
    showToast("请先选择技师");
    return;
  }
  if (selectedServiceId === null) {
    showToast("请先选择服务");
    return;
  }
  const params: shoppingCartAddParams = {
    productId: selectedProductId,
    serviceId: selectedServiceId
  };

  API_CART.shoppingCartAdd(params)
    .then(() => {
      showToast('已成功加入购物车');
    })
    .then(() => {
      router.push({ path: '/cart' });
    })
    .catch((err) => {
      console.error(err);
    });

}

</script>


<template>
  <template v-if="hasLogin">
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
              <van-card :desc="item.detail">
                <template #price>
                  <span class="card-review" style="margin-left: -7%;">
                    好评
                    <span class="card-review-score">
                      {{ item.score }}
                    </span>
                    分
                    <Coupons title="查看评价" class="card-review-check" />
                  </span>
                </template>
                <template #thumb>
                  <div style="margin-left: -12%;">
                    <van-image width="85" height="85" :src="item.coverImg" fit="cover" position="center" />
                  </div>
                  <div v-if="item.available === 1" style="margin-left: -12%;">
                    <van-tag type="primary" style="position: absolute; bottom: 0px;">可服务</van-tag>
                  </div>
                  <div v-if="item.available === 0" style="margin-left: -12%;">
                    <van-tag type="primary" style="position: absolute; bottom: 0px;">服务中</van-tag>
                  </div>
                </template>
                <template #tag>
                  <div class="card-tag">
                    <div v-if="item.role === 1">
                      <van-tag type="primary" class="card-tag-one">新人</van-tag>
                    </div>
                  </div>

                </template>
                <template #title>
                  <div class="card-title-name">
                    {{ item.name }}
                    <van-tag type="primary" class="card-title-tag" @click="showPopup(item.id)">生活照</van-tag>
                  </div>
                </template>
                <template #desc>
                  <span class="card-desc">
                    {{ item.detail }}
                  </span>
                </template>
                <template #footer>
                  <div class="card-other-info">
                    <div class="list-item-appointment">
                      <span class="list-item-appointment-bk1">最早可约：</span>
                      <span class="list-item-appointment-bk2">{{ formatTime(item.availableTime) }}</span>
                    </div>
                    <div class="list-item-distance">车程约：{{ item.distance }}分钟</div>
                  </div>
                </template>
                <template #bottom>
                  <div>
                    <van-button color="linear-gradient(to right, #FF653A, #ED001C)" class="card-order-button"
                      @click="onProductClicked(item.id)" span v-if="item.available === 1" round>
                      <span style="font-size: 12px;">立即预约</span>
                    </van-button>
                    <van-button color="linear-gradient(to right, #FF653A, #ED001C)" class="card-order-button"
                      @click="onProductClicked(item.id)" span v-if="item.available === 0" disabled round>
                      <span style="font-size: 12px;">请稍候</span>
                    </van-button>
                  </div>
                  <!-- <van-cell title="展示弹出层" is-link @click="showPopup(item.id)" /> -->
                </template>
              </van-card>
            </div>
          </div>
        </ProList>
      </div>
      <!-- 底部导航栏 -->
      <Tabbar />
    </div>
    <!-- 弹出层要放在最外面 -->
    <van-popup v-model:show="show" closeable position="bottom" :style="{ height: '30%' }">
      <div class="coupons-header van-hairline--bottom">选择服务项目</div>
      <div class="popup-list">
        <van-list ref="product_list_ref" v-model:dataSource="product_list" mode="infinite">
          <van-radio-group v-model="checked">
            <div v-for="item in product_list" :key="item.id">
              <van-radio :name="item.id" margin-bottom="10px" margin-top="10px" shape="dot" icon-size="15px"
                @click="onServiceClick(item.id)">
                <div class="bbb">
                  <div class="bbb-l">
                    {{ item.name }}
                  </div>
                  <div class="bbb-m">
                    {{ item.originalPrice }}
                  </div>
                  <div class="bbb-r">
                    {{ item.minPrice }}
                  </div>
                </div>
              </van-radio>
            </div>
            <div class="popup-button-bottom">
              <van-button type="primary" round block @click="onTaskSubmit">马上预约</van-button>
            </div>
          </van-radio-group>
        </van-list>
      </div>

    </van-popup>
    <van-popup v-model:show="showImgPopup" :style="{ height: '27%' }">
      <van-swipe :autoplay="3000" lazy-render>
        <van-swipe-item v-for="image in imgDetailArr" :key="image">
          <van-image class="popup-photo" :src="image" />
        </van-swipe-item>
      </van-swipe>
    </van-popup>

  </template>
  <van-empty v-else class="empty" :image="listEmptyImage">
    <div class="empty-title">登录后才能看到技师列表</div>
    <van-button class="empty-btn" type="primary" round @click="goLogin">去登录</van-button>
  </van-empty>
  <Tabbar />
</template>


<style lang="less" scoped>
.card-review {
  font-weight: 500;
  display: flex;

  &-score {
    color: red;
  }

  &-check {
    display: flex;
  }
}

.card-tag {
  display: flex;
  display: flex;
  margin-left: -30%;

  &-one {
    color: #fff;
    background-color: #ee0a247a;
  }

  &-two {
    color: #fff;
    background-color: #ee0a247a;
  }
}

.card-xxx {
  display: flex;
}

.card-title {
  &-name {
    font-size: medium;
    margin-left: -5%;
  }

  &-tag {
    background-color: rgba(255, 72, 170, 0.79);
  }
}

.card-order-button {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 35%;
  width: 40%;
}

.order-button {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 30%;
  width: 35%;
}

.card-other-info {
  position: absolute;
  right: 5%;
  top: 10%;
}

.card-desc {
  font-weight: 500;
  color: grey;
  margin-top: 2%;
  margin-left: -5%;
}

.bbb {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &-l {
    // display: flex;
    font-weight: bold;
    flex: 5;
    /* Equal distribution of space among the elements */
    padding-left: 5px;
    /* Add padding for spacing if necessary */
  }

  &-r {
    // display: flex;
    color: red;
    font-style: italic;
    flex: 2;
    /* Equal distribution of space among the elements */
    padding-left: 20px;
    /* Add padding for spacing if necessary */
  }

  &-m {
    font-size: small;
    text-decoration: line-through;
    color: grey;
    flex: 2;
    /* Equal distribution of space among the elements */
    padding-left: 20px;
    /* Add padding for spacing if necessary */
  }
}

.popup {
  &-list {
    background: var(--color-bg-2);

    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: 3%;
    margin-top: 2%;

    &-item {
      margin-bottom: 10px;
    }

    &-photo {
      display: flex;
    }
  }

  &-button {
    &-bottom {
      position: absolute;
      bottom: 10px;
      left: 5px;
      right: 5px;
    }
  }
}

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

    &-new {
      position: absolute;
      top: 30px;
      left: 0;
      z-index: 20;
      display: inline-block;
      padding: 2px 4px;
      color: #fff;
      background-color: #cc0fc27a;
      line-height: normal;
      border-radius: 0 8px 8px 0;
      padding-right: 6px;
      font-size: 14px;
    }

    &-photo {
      display: flex;
      width: 30%;
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

.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
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

.coupons {
  height: 20px;

  &-header {
    box-sizing: border-box;
    text-align: center;
    padding: 0 15px;
    width: 100%;
    font-size: 15px;
    color: var(--color-text-1);
    height: 40px;
    line-height: 40px;
  }
}
</style>
