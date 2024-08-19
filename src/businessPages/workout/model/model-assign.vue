<template>
	<view >
		<p class="title"><span class="line"></span>{{modelName}}</p>

		<!-- <view class="model-tag"><text>{{modelName}}</text></view> -->
		<select-label-item tagName="现场接机人" :isRequired="true" hint="请选择接机人员" :value="workoutDic.deliveryUserName" :icon="righticon"
		 :isSelect="isEdit" @clickItemLabel="showPick('staff')" />
	</view>
</template>

<script>
	import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
	export default {
		name: 'modelAssign',
		components: {
			selectLabelItem,
		},
		props: {
			//传入的数据
			workoutDic: {
				type: Object,
				default () {
					return {};
				}
			},
			//是否可编辑
			isEdit: {
				type: Boolean,
				default: false
			},
			//模块名称
			modelName: {
				type: String,
				default: "指派人员"
			}
		},
		watch: {

		},
		data() {
			return {
				righticon: 'iconarrow-right',
			}
		},
		created() {},
		methods: {
			showPick(type) {
				this.$emit("showPick", {
					pickType: "staff",
					selectType: 'selector'
				})
			},

		}
	}
</script>
<style lang="scss" scoped>
	@import "../css/workout-style";
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
