<template>
  <div class="container">
    <div class="group">
      <van-field v-model="form.name" label="收货人" placeholder="收货人姓名" clearable />
      <van-field v-model="form.mobile" type="tel" label="手机号码" placeholder="收货人手机号" clearable />
      <AreaField :model-value="form.areaStr" :code="areaCode" @change="onAreaChange" />
      <van-field v-model="form.address" label="详细地址" placeholder="街道门牌、楼层房间号等信息" rows="1" autosize type="textarea"
        clearable />
    </div>
    <div class="group">
      <van-cell center title="设为默认收货地址">
        <template #right-icon>
          <van-switch v-model="form.isDefault" size="24px" />
        </template>
      </van-cell>
    </div>
    <van-button class="btn-submit" block type="primary" round @click="onSubmit">保存</van-button>
    <van-button v-if="form.id" class="btn-submit" block type="default" round @click="onDelete">删除收货地址</van-button>
  </div>
</template>

<script>
import API_USER from '@/apis/user';
import { isEmpty, isMobile } from '@/utils/validate';
import AreaField from '@/components/AreaField/index.vue';
import { showToast, showLoadingToast } from 'vant';

export default {
  components: {
    AreaField,
  },
  data() {
    return {
      form: {
        id: '',
        name: '',
        mobile: '',
        address: '',
        isDefault: '',
        areaStr: '',
        areaCode: '',
        provinceCode: '',
        cityCode: '',
        countyCode: '',
      },
    };
  },
  computed: {
    areaCode() {
      if (this.form.provinceCode) {
        return `${this.form.provinceCode.slice(0, 2)}${this.form.cityCode.slice(2, 4)}${this.form.countyCode.slice(
          4,
          6,
        )}`;
      } else {
        return '';
      }
    },
  },
  created() {
    if (this.$route.query.id) {
      API_USER.userShoppingAddressDetail({
        id: this.$route.query.id,
      }).then((res) => {
        const info = res.data;
        this.form = {
          id: info.id,
          name: info.receiverName,
          mobile: info.receiverMobile,
          address: info.addressDetail,
          isDefault: info.isDefault == 1 ? true : false,
          provinceCode: info.province,
          cityCode: info.city,
          countyCode: info.district,
          areaStr: this.formatAreaStr(info.province, info.city, info.district),
        };
      });
    }
  },
  methods: {
    onAreaChange({ selectedOptions }) {
      this.form.provinceCode = selectedOptions[0].text;
      this.form.cityCode = selectedOptions[1].text;
      this.form.countyCode = selectedOptions[2].text;
      this.form.areaStr = this.formatAreaStr(selectedOptions[0].text, selectedOptions[1].text, selectedOptions[2].text);
    },
    formatAreaStr(provinceStr, cityStr, countyStr) {
      let str = provinceStr;
      cityStr.length > 1 && cityStr !== provinceStr && (str += ` / ${cityStr}`);
      countyStr.length > 1 && (str += ` / ${countyStr}`);
      return str;
    },
    onSubmit() {
      if (isEmpty(this.form.name)) {
        showToast('收货人不能为空');
        return;
      }

      if (!isMobile(this.form.mobile)) {
        showToast('请填写正确的电话');
        return;
      }

      if (isEmpty(this.form.areaStr)) {
        showToast('所在地不能为空');
        return;
      }
      if (isEmpty(this.form.address)) {
        showToast('详细地址不能为空');
        return;
      }

      const params = {
        address_detail: this.form.address,
        receiver_name: this.form.name,
        receiver_mobile: this.form.mobile,
        is_default: this.form.isDefault ? 1 : 0,
        province: this.form.provinceCode,
        city: this.form.cityCode,
        district: this.form.countyCode,
      };

      showLoadingToast({
        forbidClick: true,
        message: '地址数据提交中...',
        duration: 0,
      });

      if (this.form.id) {
        params.id = this.form.id;
        API_USER.userShoppingAddressUpdate(params)
          .then(() => {
            showToast(this.form.id ? '修改成功' : '添加成功');
            this.$router.back();
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        API_USER.userShoppingAddressAdd(params)
          .then(() => {
            showToast(this.form.id ? '修改成功' : '添加成功');
            this.$router.back();
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    onDelete() {
      showLoadingToast({
        forbidClick: true,
        message: '加载中...',
        duration: 0,
      });

      API_USER.userShoppingAddressDelete({
        id: this.form.id,
      })
        .then(() => {
          showToast('删除成功');
          this.$router.back();
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  padding: 10px;
}

.group {
  overflow: hidden;
  margin-bottom: 10px;
  border-radius: 8px;
}

.btn-submit {
  margin-top: 10px;
}
</style>
