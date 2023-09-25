<script setup lang="ts">
import { ref } from 'vue';
import avatar from '@/assets/images/avatar_default.png';

defineProps({
  title: { type: String },
});

const show = ref(false);

interface UserData {
  nickName: string;
  rate: number;
  remark: string;
}

const list = ref<UserData[]>([]);


function getDataList() {
  const nickNameList = ['系统默认好评', '不错', '好评'];
  const mockData = [];

  for (let i = 0; i < 4; i++) {
    const randomNickName = `匿名用户${generateRandomString(4)}`;
    const randomRemark = nickNameList[Math.floor(Math.random() * nickNameList.length)];

    const data = {
      nickName: randomNickName,
      rate: 5, // 固定为5
      remark: randomRemark,
    };

    mockData.push(data);
  }

  list.value = [...mockData];
}

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

function close() {
  toggle(false);
}

function open() {
  getDataList();
  toggle(true);
}

function toggle(value: boolean) {
  show.value = value;
}

defineExpose({
  open,
  close,
  toggle,
});
</script>

<template>
  <div class="coupons">
    <van-cell class="mb10" center @click="open">
      <div slot="title" class="van-cell-title">查看评价</div>
    </van-cell>
    <!-- 弹层 -->
    <van-popup v-model:show="show" round closeable position="bottom">
      <div class="coupons-header van-hairline--bottom">评论列表</div>
      <div class="list">
        <div v-for="(item, index) in list" :key="index" class="list-item">
          <div class="reputation-inner-hd">
            <van-image class="reputation-inner-media" :src="avatar" />
            <div class="reputation-inner-name">{{ item.nickName }}</div>
            <div class="reputation-inner-stars">
              <van-rate v-model="item.rate" :size="14" color="#f44" void-icon="star" void-color="#eee" readonly />
            </div>
          </div>
          <div class="reputation-inner-ft">
            <div>{{ item.remark }}</div>
          </div>
        </div>
      </div>
      <div class="coupons-footer" @click="close">
        <van-button type="primary" round block @click="close">返回</van-button>
      </div>
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.coupons {
  height: 20px;

  &-header {
    box-sizing: border-box;
    text-align: center;
    padding: 0 15px;
    width: 100%;
    font-size: 16px;
    color: var(--color-text-1);
    height: 50px;
    line-height: 50px;
  }

  &-body {
    // padding: 10px 15px;
  }

  &-footer {
    box-sizing: border-box;
    display: flex;
    padding: 8px 15px;
    width: 100%;
  }
}




.mb10 {
  margin-bottom: 1px;
  height: 5px;
  background: transparent;
}

.fz12 {
  font-size: 12px;
}

.van-cell-title {
  color: #1832d0;
  text-decoration: underline;
  font-size: 12px;
}

.list-item {
  background: var(--color-bg-2);

  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 3%;


  &-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 5px;
  }

  &-name {
    font-size: 14px;
    color: var(--color-text-1);
    line-height: 1;
  }

  &-inner {
    flex: 1;
    padding-top: 4px;
  }

  &-header {
    padding: 10px 15px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  &-content {
    padding: 10px 15px;
    color: var(--color-text-3);
    font-size: 14px;
    line-height: 18px;
  }

  &-prop {
    margin-top: 5px;
    font-size: 12px;
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
      margin-left: 10px;
    }

    &-stars {
      margin-left: 10px;
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
      margin-left: 10px;
    }

    &-prop {
      margin-top: 5px;
      font-size: 12px;
    }
  }
}
</style>
