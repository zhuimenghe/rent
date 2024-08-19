<template>
	<view>
		<selectorPick
		title="联系人"
		:isRequire="false"
		:isEdit="(customerType&&customerType=='1'?true:false)&&isEdit"
		:content="contactName"
		@clickItem="goTo"
		/>		
		<!-- <select-label-item tagName="联系人" :isRequired="false" 
		hint="请选择联系人" :value="contactName" :icon="righticon" 
		:isSelect="(customerType&&customerType=='1'?true:false)&&isEdit"
		 @clickItemLabel="goTo" /> -->
	</view>
</template>

<script>
	import selectorPick from '@/components/common/selector-pick/selector-pick.vue';
	
	import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
	export default {
		name: 'contactItem',
		components: {
			selectLabelItem,
			selectorPick
		},
		props: {
			//客戶ID
			customerId: {
				type: String,
				default: ''
			},
			//聯係人姓名
			contactName: {
				type: String,
				default: ''
			},
			dutyType: {
				type: [String, Number],
				default: ''
			},
			isEdit: {
				type: Boolean,
				default: false
			},
		},
		watch: {
			customerId(val) {
				if (val && this.isEdit) {
					this.getDetailWithId()
				}
			}
		},
		data() {
			return {
				righticon: 'iconarrow-right',
				customerType:''
			}
		},
		created() {
			setTimeout(()=>{
			if (this.customerId && this.isEdit) {
				this.getDetailWithId()
			}	
			},500)
			
			uni.$on('linkman-emit', obj => {
				this.$emit('getContactVal', obj.dict);
			})

		},
		onUnload() {
			uni.$off('linkman-emit')
		},
		methods: {
			//加载数据
			loadContractData() {
				let url = this.$url.LINKMAN_COMPANY_LIST + this.customerId + '?dutyTypeSort=' + this.dutyType;
				this.$network
					.getData(url, 'GET')
					.then(result => {
						let contact = result && result.length > 0 ? result[0] : {};
						if(!this.contactName){
							this.$emit('getContactVal', contact);
						}
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			//获取详情
			getDetailWithId() {
				let url = this.$url.CUSRTOMER_DETAIL + this.customerId
				this.$network
					.getData(url, 'GET')
					.then(result => {
						if (result) {
							this.customerType = result.type; ////客戶類型：1:企業客戶；2：個人客戶
							if (this.customerType && this.customerType == '1') {
								this.loadContractData();
							}
						}
					})
					.catch(err => {

					});
			},
			goTo() {
				let customerObj = {
					id: this.customerId
				}
				uni.navigateTo({
					url: '/otherPages/linkman/linkman-company-list?isnext=true&delta=1&dutyType=' + this.dutyType + '&item=' +
						encodeURIComponent(JSON.stringify(customerObj))
				})
			}
		}
	}
</script>

<style>
</style>
