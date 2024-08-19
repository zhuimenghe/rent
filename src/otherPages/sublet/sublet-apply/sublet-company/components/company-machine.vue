<template>
	<div>
		<icon-overview :list="overviews" @total="clickHandler" @sublet="clickHandler" @rentBack="clickHandler" @subletForRent="clickHandler"></icon-overview>
		<sublet-list :list="sublets" :title="title" :total="total" @headerrefresh="headerrefresh">
		</sublet-list>
		<attachment :companyInfo="companyInfo" v-if="(companyInfo.fileList && companyInfo.fileList.length > 0) || companyInfo.remark"></attachment>
	</div>
</template>

<script>
import iconOverview from './icon-overview';
import subletList from './sublet-list';
import attachment from './attachment';
export default {
	props: {
		overviews: {
			type: Array
		},
		sublets: {
			type: Array
		},
		companyInfo: {
			type: Object
		}
	},
	computed: {
		title() {
			return `转租单(${this.sublets.length})`;
		},
		total() {
			let total = 0;
			// 一次性循环处理全部的数据
			this.sublets.forEach((record) => {
				// 将每个记录的 id 添加到 activeNames 以默认展开所有项
				total = total + Number(record.receivable);
				// 同时处理每个记录的 orderList 来生成 flattenedData
				// console.log("record.orderList", record.orderList);
				// const flattenedData = this.getFlattenedData(record);
				// this.$set(record, "flattenedData", flattenedData);
			});
			return total
		}
	},
	data() {
		return {
		}
	},
	components: {
		iconOverview,
		subletList,
		attachment
	},
	methods: {
		clickHandler(event) {
			if (event) {
				this.$emit(event.clickEvent, { 'clickEvent': event.clickEvent })
			}
		},
		headerrefresh() {
			this.$emit("headerrefresh");
		}
	}
};
</script>

<style></style>
