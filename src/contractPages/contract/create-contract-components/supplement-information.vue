<template>
  <view>
    <p class="title"><span class="line"></span>其他</p>
    <view class="supplement-infomation-bg">
      <selectorPick
        title="合同签订日"
        placeholder="请选择合同签订日"
        :content="changestr(dataDic.signDate)"
        :isRequire="false"
        @clickItem="showPick('signDate')"
        :isEdit="isEdit"
      />
      <selectorInput
        title="纸质合同号"
        placeholder="请输入纸质合同号"
        name="paperContractNo"
        :content="dataDic.paperContractNo"
        :isRequire="false"
        @textChage="textChage($event, 'paperContractNo')"
        :isEdit="isEdit"
      />
      <imgupload
        @uploadfinish="uploadfinish"
        @deleteUrl="deleteUrl"
        type="common_contract"
        uploadType="attachment"
        :maximg="20"
        :imgFinishlist="dataDic.fileList"
        :isupload="isEdit"
      />
      <!-- <selectortextArea
		title="备注"
		placeholder="请输入备注"
		:content="dataDic.remark"
		:isRequire="false"
		@textChage="textChage($event,'remark')"
		:isEdit="isEdit" 
		/>-->
    </view></view
  >
</template>
<script>
import selectorPick from "@/components/common/selector-pick/selector-pick.vue";
import selectorInput from "@/components/common/selector-pick/selector-input.vue";
import selectortextArea from "@/components/common/selector-pick/selector-textArea.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
export default {
  components: {
    selectorPick,
    selectorInput,
    selectortextArea,
    imgupload,
  },
  props: {
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
    return {};
  },
  created() {},
  methods: {
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
    changestr(str) {
      if (str == null) {
        return "";
      }
      return str.split(" ")[0];
    },
    //上传图片回调
    uploadfinish(val) {
      let list = val.data;
      let param = {
        type: "fileList",
        data: list,
      };
      this.$emit("textChange", param);
    },
    //删除回调
    deleteUrl(val) {
      let list = val.data;
      let param = {
        type: "fileList",
        data: list,
      };
      this.$emit("textChange", param);
    },
  },
};
</script>

<style lang="scss" scoped>
.supplement-infomation-bg {
  display: flex;
  flex-direction: column;
  padding: 10px 5px;
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
