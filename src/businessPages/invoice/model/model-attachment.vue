<template>
	<view class="model-container">
		<view class="model-tag">
			<text>{{modelName}}</text>
		</view>
		<text-label-item 
		tagName="备注" 
		placeholder="请输入备注..." 
		@ipnuttext="remarkmethod" 
		:inputValue="invoiceDic.comment"
		:inputDisabled="!isEdit" 
		/>
		<imgupload
		@uploadfinish="uploadfinish" 
		@deleteUrl="deleteUrl" 
		type="invoice_type" 
		uploadType="attachment" 
		:maximg="20"
		:isupload="isEdit" 
		:imgFinishlist="invoiceDic.fileList?invoiceDic.fileList:[]" 
		/>

	</view>
</template>

<script>
	import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
	import imgupload from '@/components/common/image-upload/image-upload.vue';
	export default {
		name: 'modelAttacment',
		components: {
			textLabelItem,
			imgupload
		},
		props: {
			//传入的数据
			invoiceDic: {
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
				default: "备注及附件"
			},
		},
		watch: {
		},
		data() {
			return {
			}
		},
		created() {
		},
		methods: {
			//备注
			remarkmethod(val) {
				this.$emit("setComment",val)
			},
			//上传图片回调
			uploadfinish(val) {
				this.$emit("updateFile",val.data)
			},
			//删除回调
			deleteUrl(val) {
				this.$emit("updateFile",val.data)
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "../css/invoice-style";
</style>
