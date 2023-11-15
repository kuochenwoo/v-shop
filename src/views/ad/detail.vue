<script lang="ts">
export default {
    name: 'AdDetail',
};
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import API_BANNER from '@/apis/banner';
import { useRoute } from 'vue-router';
const picList = ref<Recordable[]>([]);
const title = ref<Recordable>({});
const contact = ref<Recordable>({});
const phone = ref<Recordable>({});
const address = ref<Recordable>({});
const linkUrl = ref<Recordable>({});
const content = ref('');
onMounted(() => {
    getGoodsDetail();
});

const route = useRoute();
function getGoodsDetail() {
    API_BANNER.adDetail({ id: route.query.id }).then((res) => {
        picList.value = res.data.pics;
        title.value = res.data.title;
        content.value = res.data.content;
        linkUrl.value = res.data.linkUrl;
        contact.value = res.data.contact;
        phone.value = res.data.phone;
        address.value = res.data.address;
    })
    console.log("XXX", content.value)
}
</script>

<template>
    <div class="container">

        <van-swipe :autoplay="3000" class="swiper">
            <van-swipe-item v-for="item in picList" :key="item.id" class="swiper-item">
                <van-image class="swiper-item-img" fit="contain" :src="item.pic" alt="" />
            </van-swipe-item>
        </van-swipe>
        <div class="section">
            <div class="desc">
                <div class="desc-hd">
                    <!-- <div class="desc-title van-multi-ellipsis--l2">{{ title }}</div> -->
                    <h1>
                        {{ title }}
                    </h1>
                </div>
            </div>
        </div>
        <Plate title="商家详情" class="mt10" />
        <div class="box">
            <div class="plane"></div>
        </div>
        <div class="goods-content" v-html="content"></div>
        <div class="goods-info">
            <div class="goods-address">
                <span class="goods-text">地址：</span>
                <span class="goods-from-back">{{ address }}</span>
            </div>
            <div class="goods-contact">
                <span class="goods-text">联系人：</span>
                <span class="goods-from-back">{{ contact }}</span>
            </div>
            <div class="goods-phone">
                <span class="goods-text">联系电话：</span>
                <span class="goods-from-back">{{ phone }}</span>
            </div>
            <div class="goods-link">
                <span class="goods-text">网址：</span>
                <a href="{{ linkUrl }}" target="_blank" class="goods-link-link">{{ linkUrl }}</a>
            </div>
        </div>

    </div>
</template>

<style lang="less" scoped>
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

.goods {
    &-content {
        font-size: medium;
        margin-top: 20px;
        padding-left: 16px;
        padding-right: 16px;
        line-height: 1.8;
        color: darkgreen;
    }

    &-contact {
        margin-top: 10px;
    }

    &-phone {
        margin-top: 10px;
    }

    &-address {
        margin-top: 100px;
    }

    &-link {
        margin-top: 10px;

        &-link {
            font-size: small;
        }
    }

    &-info {
        position: fixed;
        bottom: 10px;
        left: 10px;
    }

    &-text {
        font-weight: bold;
    }

    &-from-back {
        color: grey;
        font-size: small;
    }
}

.box {
    perspective: 120px;
    margin-top: 15px;
    display: flex;
    justify-content: space-around;
}

.plane {
    width: 2em;
    height: 2em;
    background-color: #fc2f70;
    transform: rotate(0);
    animation: flip 1s infinite;
}

@keyframes flip {
    50% {
        transform: rotateY(180deg);
    }

    100% {
        transform: rotateY(180deg) rotateX(180deg);
    }
}
</style>