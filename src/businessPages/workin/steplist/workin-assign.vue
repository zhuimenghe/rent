<template>
  <view class="sum-view-bg" style="margin: 0px; padding: 0px">
    <p class="title"><span class="line"></span>指派人员</p>
    <selectorPick
      title="现场交机人"
      placeholder="请选择现场交机人"
      :content="dataDic.deliveryUserName"
      @clickItem="chooseType('assign')"
      :isEdit="isedit"
    />
  </view>
</template>
<script>
import selectorPick from "@/components/common/selector-pick/selector-pick.vue";
export default {
  components: {
    selectorPick,
  },
  data() {
    return {
      dateIcon: "iconzl--rili",
      companyicon: "iconiconzhengli_zuzhijiagou",
      righticon: "iconarrow-right",
      assginArr: [],
    };
  },
  props: {
    dataDic: {
      type: Object,
      default() {
        return {};
      },
    },
    isedit: {
      type: Boolean,
      default: true,
    },
  },
  // watch:{
  // 	dataDic(val) {
  // 		console.log(JSON.stringify(val))
  // 	},
  // },
  created() {},
  methods: {
    chooseType(type) {
      if (this.isedit) {
        this.$emit("clickevent", {
          type: type,
          data: [],
        });
        // uni.showLoading()
        // this.loadAssginArr(this.dataDic,type);
      }
    },
    loadAssginArr(val, type) {
      let param = {
        orgId: val.orgId,
        showAdmin: false,
        roleType: this.$savekey.USER_ROLE_SEVICER,
      };
      this.$network
        .getData(this.$url.USER_LEADERS, "GET", param)
        .then((result) => {
          let list = result;
          this.assginArr = list.map((dict) => {
            return {
              label: dict.username,
              value: dict.id,
            };
          });
          uni.hideLoading();
          setTimeout(() => {
            this.$emit("clickevent", {
              type: type,
              data: this.assginArr,
            });
          }, 100);
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.sum-view-bg {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  background: #f5f4f9;
  border-radius: 10px;
  padding-bottom: 10px;
}

.cell-input-view {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  margin: 10px;
  font-size: $uni-font-size-base;
}

.cell-input-view-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.cell-input-view-right {
  display: flex;
  flex: 1;
  min-height: 24px;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.input-style {
  flex: 1;
  text-align: right;
}

.boldstyle {
  font-size: $uni-font-size-lg;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 10px;
}

.title {
  height: 20px;
  font-size: 14px;
  color: #222222;
  font-weight: 600;
  padding: 6px 0;
  margin: 4px 0;
  display: flex;
  align-items: center;

  .line {
    display: block;
    width: 2px;
    height: 80%;
    background-color: #e60000;
    margin-right: 10px;
  }
}
</style>
