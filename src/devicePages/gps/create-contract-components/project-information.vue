<template>
  <view class="project-infomation-bg">
 
    <selectorInput
      title="项目名称"
      :content="dataDic.projectName"
      :isRequire="true"
      placeholder="请输入项目名称"
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
      :isRequire="true"
      @iconClick="showPick('returnPlace')"
      @textChage="textChage($event, 'returnPlace')"
      :isEdit="isEdit"
    />
    <selectorPick
      title="租赁性质"
      placeholder="请选择租赁性质"
      :content="dataDic.rentalTypeName"
      :isRequire="true"
      @clickItem="showPick('rentalType')"
      :isEdit="isEdit"
    />
  </view>
</template>
<script>
import selectorPick from "@/components/common/selector-pick/selector-pick.vue";
import selectorInput from "@/components/common/selector-pick/selector-input.vue";
import selectortextArea from "@/components/common/selector-pick/selector-textArea.vue";
import selectorInputIcon from "@/components/common/selector-pick/selector-inputwithicon.vue";
export default {
  components: {
    selectorPick,
    selectorInput,
    selectortextArea,
    selectorInputIcon,
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
  },
};
</script>

<style lang="scss" scoped>
.project-infomation-bg {
  display: flex;
  flex-direction: column;
  padding: 10px;
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
</style>
