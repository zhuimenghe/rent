<template>
  <view>
    <p class="title"><span class="line"></span>项目信息</p>
    <view class="project-infomation-bg">
      <selectorInput
        title="项目名称"
        placeholder="请输入项目名称"
        :content="dataDic.projectName"
        :isRequire="true"
        @textChage="textChage($event, 'project')"
        :isEdit="isEdit"
      />
      <selectorPick
        title="施工类别"
        placeholder="请选择施工类别"
        :content="dataDic.constructionTypeName"
        :isRequire="true"
        @clickItem="showPick('constructionType')"
        :isEdit="isEdit"
      />
      <selectorInputIcon
        title="交机地点"
        placeholder="请输入交机地点"
        :content="dataDic.deliveryPlace"
        :isRequire="true"
        @iconClick="showPick('deliveryPlace')"
        @textChage="textChage($event, 'deliveryPlace')"
        :isEdit="isEdit"
      />
      <selectorInputIcon
        title="归还地点"
        placeholder="请输入归还地点"
        :content="dataDic.returnPlace"
        :isRequire="false"
        @iconClick="showPick('returnPlace')"
        @textChage="textChage($event, 'returnPlace')"
        :isEdit="isEdit"
      />
      <selectorPick
        v-if="isEdit"
        title="最短租期"
        :content="dataDic.isShowMinTenancy ? '是' : '否'"
        :isRequire="false"
        @clickItem="showPick('isShowMinTenancy')"
        :isEdit="isEdit"
      />

      <view
        class="selector-input-bg prepay"
        v-if="dataDic.isShowMinTenancy && isEdit"
        style="display: flex; padding: 10px"
      >
        <view>最短租期</view>
        <view>
          <input
            style="width: auto; border: 1rpx solid #e8e8e8"
            type="text"
            v-model="minTenancy"
            @blur.trim="minTenancyChange($event, 'isShowMinTenancy')"
        /></view>
      </view>

      <view
        class="selector-input-bg prepay"
        v-if="!isEdit"
        style="display: flex; padding: 10px"
      >
        <view>最短租期</view>
        <view>{{
          dataDic.contractDetailDto && dataDic.contractDetailDto.minTenancy
            ? dataDic.contractDetailDto.minTenancy
            : "-"
        }}</view>
      </view>

      <selectortextArea
        title="其他约定"
        placeholder="请输入其他约定"
        :content="dataDic.covenants"
        :isRequire="false"
        @textChage="textChage($event, 'covenants')"
        :isEdit="isEdit"
      />
    </view>
  </view>
</template>
<script>
import selectorPick from "@/components/common/selector-pick/selector-pick.vue";
import selectorInput from "@/components/common/selector-pick/selector-input.vue";
import selectortextArea from "@/components/common/selector-pick/selector-textArea.vue";
import selectorInputIcon from "@/components/common/selector-pick/selector-inputwithicon.vue";
export default {
  name: "project-information",
  components: {
    selectorPick,
    selectorInput,
    selectortextArea,
    selectorInputIcon,
  },
  computed: {
    minTenancy: {
      get() {
        if (this.dataDic.contractDetailDto && this.dataDic.contractDetailDto.minTenancy) {
          return this.dataDic.contractDetailDto.minTenancy;
        } else {
          return "";
        }
      },
      set(newValue) {
        this.$emit("minTenancyChange", newValue);
      },
    },
  },
  props: {
    backDic: {
      type: Object,
      default() {
        return {};
      },
    },
    itemData: {
      type: Object,
      default() {
        return {};
      },
    },
    dataDic: {
      type: Object,
      default() {
        return {};
      },
    },
    isEdit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isShowMinTenancy: false,
    };
  },
  created() {},
  // onShow(){
  //   if(this.backDic){
  //     this.isShowMinTenancy=(this.isEdit&&this.dataDic.contractDetailDto.minTenancy)?true:false
  //   }
  // },

  methods: {
    minTenancyChange(val) {
      let value = val.target.value ? val.target.value.trim() : null;
      this.$emit("minTenancyChange", value);
    },

    showPick(type) {
      this.$emit("clickItem", type);
    },
    textChage(e, type) {
      let param = {
        type: type,
        data: e,
      };
      this.$emit("textChange", param);
    },
  },
};
</script>

<style lang="scss" scoped>
.prepay {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  padding: 10px 20px;
  border-bottom: #f0f2f4 1px solid;
  background-color: #fff;
  input {
    width: 50px;
    border: 1px solid #ccc;
    margin-right: 5px;
  }
}
.project-infomation-bg {
  display: flex;
  flex-direction: column;
  padding: 10px;
  padding-top: 0;
  background: #ffffff;
}

.title-bg {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  border-bottom: #e9e9e9 1px solid;
}
.title-left {
  font-size: $uni-font-size-lg;
  font-weight: bold;
  color: #222831;
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
