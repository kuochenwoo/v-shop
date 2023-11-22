<script lang="ts">
export default {
  name: 'GoodDetail',
};
</script>

<script setup lang="ts">
import { computed, onMounted, ref, unref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showConfirmDialog, showToast } from 'vant';
import API_GOODS from '@/apis/goods';
import API_CART from '@/apis/cart';
import { makePhoneCall } from '@/utils/web/makePhoneCall';
// import { shoppingCartAddParams } from '@/apis/cart/types';
import { ISku } from '@/components/Sku/types';
// import Coupons from './components/Coupons.vue';
// import Reputations from './components/Reputations.vue';
import { decimalFormat, priceIntegerFormat } from '@/utils/format';
// import { debounce } from '@/utils';
// import { getAfterSaleTitle } from '@/model/modules/order/afterSale';

// import { useOrderStore } from '@/store/modules/order';
import { usePage } from '@/hooks/shared/usePage';

onMounted(() => {
  getGoodsDetail();

  if (unref(hasLogin)) {
    getCartCount();
  }
});

const route = useRoute();
const router = useRouter();
const active = ref(0);
// const orderStore = useOrderStore();
const { hasLogin } = usePage();

const picList = ref<Recordable[]>([]);
const basicInfo = ref<Recordable>({});
const logistics = ref<Recordable>({});
const content = ref('');
const goodPrice = computed(() => {
  if (unref(hasSku)) {
    return unref(sku).skuList[0].price;
  } else {
    return unref(basicInfo).minPrice;
  }
});
const goodMaxPrice = computed(() => {
  if (unref(hasSku)) {
    return unref(sku).skuList[unref(sku).skuList.length - 1].price;
  } else {
    return '';
  }
});

function getGoodsDetail() {
  API_GOODS.goodsDetail({ id: route.query.id }).then((res) => {
    picList.value = res.data.pics;
    basicInfo.value = res.data.basicInfo;
    logistics.value = res.data?.logistics ?? {};
    content.value = res.data.content;

    // 商品已下架
    if (unref(basicInfo).status === 1) {
      showToast(unref(basicInfo).statusStr);
      return;
    }
    // 商品库存为0
    if (unref(basicInfo).stores === 0) {
      showConfirmDialog({
        title: '提示',
        message: '该服务已售罄,去看看其他服务吧！',
        showCancelButton: false,
      })
        .then(() => {
          // on confirm
          router.replace({ path: '/home' });
        })
        .catch(() => {
          // on cancel
        });
      return;
    }

    document.title = unref(basicInfo).name;

    // getSkuData(res.data.basicInfo, res.data?.properties ?? [], res.data?.skuList ?? []);
    // getAfterService();
    // TODO 商品收藏
  });
}

// Sku
// const skuNextActionType = ref('goBuy');
// const skuShow = ref(false);
const sku = ref<ISku>({
  goodsId: 0,
  price: 0,
  stock: 0,
  goodInfo: {},
  propList: [],
  skuList: [],
});
// const initialSku = ref<IInitialSku>({
//   selectedNum: 1,
//   selectedProps: {},
//   selectedPropList: [],
// });

/**
 * 是否多规格
 */
const hasSku = computed(() => !!unref(sku).skuList.length);

// const goodSelectedSkuTitle = computed(() => {
//   if (unref(hasSku)) {
//     if (unref(initialSku).selectedPropList.length) {
//       return unref(initialSku).selectedPropList.reduce((acc, cur) => `${acc} ${cur.childName}`, '');
//     } else {
//       return unref(sku).propList.reduce((acc, cur) => `${acc} ${cur.name}`, '');
//     }
//   } else {
//     return '';
//   }
// });

// function onSkuShow(type: string) {
//   skuNextActionType.value = type;
//   skuShow.value = true;
// }

function generateRandomNumber() {
  // 生成一个介于8到15之间的随机整数
  return Math.floor(Math.random() * 8) + 8;
}

// const onSkuConfirm = debounce((data) => {
//   skuShow.value = false;
//   if (unref(skuNextActionType) === 'addCart') {
//     addCartHandle();
//   } else {
//     orderStore.setTradeGoods({
//       origin: 'buy',
//       list: [
//         {
//           goodsId: unref(sku).goodsId,
//           name: unref(sku).goodInfo.name,
//           number: unref(initialSku).selectedNum,
//           pic: unref(sku).goodInfo.pic,
//           price: data.selectedSkuComb.price,
//           // logisticsId: unref(basicInfo).logisticsId,
//           // propertyList: unref(initialSku).selectedPropList,
//         },
//       ],
//     });
//   }
// }, 1500);

// function getSkuData(basicInfo: Recordable, properties: Recordable[], skuList: Recordable[]) {
//   sku.value = {
//     goodsId: basicInfo.id,
//     stock: basicInfo.stores,
//     price: basicInfo.minPrice,
//     goodInfo: {
//       id: basicInfo.id,
//       pic: basicInfo.pic,
//       name: basicInfo.name,
//       unit: basicInfo.unit,
//     },
//     propList: properties,
//     skuList: skuList.sort((a, b) => a.price - b.price), // 按照商品价格从低到高排序
//   };
// }

function onConcatService() {
  makePhoneCall({
    phoneNumber: '88881234', // 模拟打电话
  });
}

function onBookClicked() {
  // 否则，执行跳转到预约页面的逻辑
  router.push({ path: '/category' });
}

// 售后服务
// const afterSaleTitle = ref('');
// function getAfterService() {
//   afterSaleTitle.value = getAfterSaleTitle(unref(basicInfo).afterSale);
// }

// 购物车
const cartCount = ref<number | undefined>(undefined);
function getCartCount() {
  API_CART.shoppingCartInfo().then((res) => {
    cartCount.value = res.data?.number as number;
  });
}

// function addCartHandle() {
//   const params: shoppingCartAddParams = {
//     goodsId: unref(sku).goodsId,
//     number: unref(initialSku).selectedNum,
//   };

//   if (unref(initialSku).selectedPropList.length) {
//     params.sku = JSON.stringify(
//       unref(initialSku).selectedPropList.map((v: Recordable) => ({
//         optionId: v.id,
//         optionValueId: v.childId,
//       })),
//     );
//   }

//   API_CART.shoppingCartAdd(params)
//     .then(() => {
//       showToast('已成功加入购物车');
//       getCartCount();
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// }
</script>

<template>
  <div class="container">
    <van-swipe :autoplay="3000" class="swiper">
      <van-swipe-item v-for="item in picList" :key="item.id" class="swiper-item">
        <van-image class="swiper-item-img" fit="contain" :src="item.pic" alt="" />
      </van-swipe-item>
    </van-swipe>
    <div class="section">
      <div class="price">
        <div class="price-hd">
          <div class="price-current">
            <span class="price-current-symbol">¥</span>
            <span class="price-current-integer">{{ priceIntegerFormat(goodPrice, goodMaxPrice) }}</span>
            <!-- <span v-if="marketing.type" class="price-tag">{{ marketing.info.label }}</span> -->
          </div>
          <div v-if="basicInfo.originalPrice > 0" class="price-origin">
            <span class="price-origin-label">价格</span>
            <span class="price-origin-symbol">¥</span>
            <span class="price-origin-integer">{{ decimalFormat(basicInfo.originalPrice) }}</span>
          </div>
        </div>

      </div>

      <div class="desc">
        <div class="desc-hd">
          <div class="desc-title">{{ basicInfo.name }}</div>
          <div class="desc-info-time">
            <van-icon name="underway-o" />
            {{ basicInfo.status }}分钟
          </div>
          <div class="desc-info-other">
            <!-- <div class="card-other-info"> -->
            <div class="list-item-appointment">
              <span class="list-item-appointment-bk1">最早可约：</span>
              <span class="list-item-appointment-bk2">12:00</span>
            </div>
            <div class="list-item-distance">最近技师：{{ generateRandomNumber() }}分钟</div>
            <!-- </div> -->
          </div>
          <!-- <div v-if="basicInfo.characteristic" class="desc-brief">
            {{ basicInfo.characteristic }}
          </div> -->
        </div>

      </div>
    </div>

    <!-- <Coupons title="领券" />
    <van-cell>
      <template #title>
        <div class="cell-bar">
          <div class="cell-bar-title">服务</div>
          <div class="cell-bar-text">{{ afterSaleTitle }}</div>
        </div>
      </template>
    </van-cell> -->

    <!-- <van-cell v-if="hasSku" :border="false" is-link @click="onSkuShow">
      <template #title>
        <div class="cell-bar">
          <div class="cell-bar-title">{{ initialSku.selectedPropList.length ? '已选' : '选择' }}</div>
          <div class="cell-bar-text">{{ goodSelectedSkuTitle }}</div>
        </div>
      </template>
    </van-cell> -->

    <!-- 获取商品评价 -->
    <!-- <Reputations v-if="basicInfo.id" class="mt10" :goods-id="basicInfo.id" /> -->

    <!-- content也是由后端返回，全部为html格式 -->
    <!-- <Plate title="服务详情" class="mt10" /> -->
    <van-tabs v-model:active="active" type="card" swipeable animated color="#CA7A2C" style="margin-top: 5%;">
      <van-tab title="项目详解">
        <br>
        <div class="goods-content" v-html="content"></div>
        <br>
      </van-tab>
      <van-tab title="下单须知">
        <br>
        <div class="know-text">
          1、秋香到家服务属于舒缓保健，不是治疗，如需治疗请到医院就诊。
        </div>
        <div class="know-text">
          2、秋香到家服务只提供专业、正规的推拿服务。对于不正当的行为和要求，技师有权拒绝服务，并保留诉诸法律的权利。
        </div>
        <div class="know-text">
          3、客人因看见技师不够漂亮等与专业无关系列因素而要求退单者，该客人所付项目费退一半，交通费不予退还。
        </div>
        <div class="know-text">
          4、服务开始过后，因顾客原因提前终止服务的，服务费不予退还。
        </div>
        <div class="know-text">
          5、在平台规定的服务范国内如因技师个人的手法、态度问题而导致客人不满意而要求退单者，平台在查清核实后将会无理由退款。退款金额会在7个工作日内退到顾客的支付账户里。
        </div>
        <div class="know-text">
          6、客人下单后，技师与该客人联系确定了服务时间、服务地址；若技师已经出发，客人要取消订单的，该客人所付的交通费用不予退还。
        </div>
        <div class="know-text">
          7、技师到达服务地址后，等待时间不得超过20分钟，否则系统会自动按项目的服务时间开始倒计时。
        </div>
        <div class="know-text">
          8、顾客下单后，当技师还没出发时，顾客可申请全额退款。
        </div>
        <br>
      </van-tab>
      <van-tab title="禁忌说明">
        <br>
        <div class="know-text">
          1、妇女在月经和妊娠期间不宜做腹部、腰骶部按摩。
        </div>
        <div class="know-text">
          2、饭后半小时不宜做按摩。
        </div>
        <div class="know-text">
          3、极度疲劳、醉酒神志不清者禁用。
        </div>
        <div class="know-text">
          4、皮肤病、皮肤破损者（如瘟瘆，疱珍，脓肿，烧伤，烫伤）禁用。
        </div>
        <div class="know-text">
          5、内科为重的病人，如严重的心脏病，各种恶性肿瘤，急腹症，急性阑尾炎，宫外孕，胰腺炎等禁用。
        </div>
        <div class="know-text">
          6、骨折复位稳定，开放性的骨折人体，内有金属固定物禁用。
        </div>
        <div class="know-text">
          7、感染性疾病，如骨结核，骨髓炎禁用。
        </div>
        <div class="know-text">
          8、糖尿病受术者，下肢静脉曲张和血栓性静脉炎，局部肿胀者禁用。
        </div>
        <div class="know-text">
          9、需外科手术的人，及其他严重疾病或诊断不明的较严重疾病禁用。
        </div>
        <br>

      </van-tab>
    </van-tabs>

    <div class="action-bar-perch"></div>
    <!-- 商品导航栏 -->
    <van-action-bar>
      <van-action-bar-icon icon="thumb-circle-o" text="首页" to="/home" replace />
      <van-action-bar-icon icon="chat-o" text="客服" @click="onConcatService" />
      <van-action-bar-icon icon="cart-o" text="购物车" to="/cart" :badge="cartCount" replace />
      <!-- <van-action-bar-button type="danger" text="立即购买" @click="onBookClicked" />-->
      <!-- <van-action-bar-button type="warning" text="加入购物车" @click="onSkuShow('addCart')" /> -->
      <van-button square type="primary" class="aaa" @click="onBookClicked">立即预约</van-button>
    </van-action-bar>
    <!-- SKU 弹窗 -->
    <!-- <Sku v-model:show="skuShow" :sku="sku" :initial-sku="initialSku" @confirm="onSkuConfirm" /> -->
  </div>
</template>

<style lang="less" scoped>
.section {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 0 15px 10px;
  background: var(--color-bg-2);
}

.know-text {
  font-size: 12px;
  line-height: 20px;
  padding: 0 10px;
  word-break: break-word;
}

.desc-info-other {
  display: flex;
  flex-direction: column;
  align-content: stretch;
  align-items: center;
  justify-content: center;
}

.desc-info-time {
  font-size: 14px;
}

.list {
  &-item {
    &-distance {
      margin-top: 1%;
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

.swiper {
  width: 100%;
  height: 375px;

  &-item,
  &-item-img {
    width: 100%;
    height: 100%;
  }
}

.aaa {
  width: 50%;
  margin-left: 30px;
  height: 70%;
}

.price {
  margin-top: 10px;

  &-hd {}

  &-current {
    display: flex;
    align-items: flex-end;
    align-items: center;
    margin-right: 8px;
    font-size: 16px;
    color: var(--color-primary);

    &-symbol {
      font-size: 14px;
      margin-right: 2px;
    }

    &-integer {
      font-size: 22px;
      font-weight: bold;
      font-family: @font-family-price-integer;
    }


  }

  &-origin {
    display: flex;
    align-items: flex-end;
    align-items: center;
    margin-right: 8px;
    font-size: 12px;
    line-height: 18px;
    color: var(--color-text-3);

    &-label {
      margin-right: 4px;
    }

    &-integer {
      text-decoration: line-through;
      font-family: @font-family-price-integer;
    }
  }

  &-tag {
    box-sizing: border-box;
    margin-left: 10px;
    display: inline-flex;
    font-size: 10px;
    padding: 2px 4px;
    border-radius: 4px;
    color: #f44;
    border: 1px solid #f44;
  }
}

.desc {
  margin-top: 10px;

  &-title {
    // font-size: 16px;
    // line-height: 20px;
    display: flex;
  }

  &-brief {
    margin-top: 4px;
    color: var(--color-text-3);
    font-size: 12px;
    word-break: break-all;
  }

  &-hd {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: stretch;
    justify-content: space-between;
    align-items: center;
  }
}

.stock {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background: var(--color-bg-2);
  margin-bottom: 10px;

  &-item {
    flex: 1;
    font-size: 12px;
    color: var(--color-text-3);

    &:last-child {
      text-align: right;
    }
  }
}

.goods-content {
  box-sizing: border-box;
  background: var(--color-bg-2);
  padding: 0 10px;
  padding-top: 10px;
  overflow: hidden;
  color: var(--color-text-1);
  font-size: 12px;
  line-height: 20px;
  text-align: left;
  word-wrap: break-word;
  padding: 7px 5px 5px 5px;

  :deep(i)mg {
    display: block;
    max-width: 100% !important;
    height: auto !important;
  }

  :deep(p) {
    margin: 0;
    padding: 0;
  }
}

.mb10 {
  margin-bottom: 10px;
}

.mt10 {
  margin-top: 10px;
}

.cell-bar {
  display: flex;
  color: var(--color-text-1);

  &-title {
    flex-shrink: 0;
    margin-right: 12px;
    color: var(--color-text-3);
  }

  &-txt {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
}

.action-bar-perch {
  height: calc(50px + var(--safe-area-height-bottom));
}
</style>
