export default {
    data() {
        return {
            currentPickerIndex: null, // 用于存储当前操作的 item 索引
            isAnyChecked: false,
        }
    },
    watch: {
        datalist: {
            handler(val) {
                this.isAnyChecked = this.datalist.some((item) => item.checked === true);
            },
            deep: true,
        },
    },
    methods: {
        checkedDatalist() {
            // 过滤出 checked 为 true 的元素，并重新组织数据结构
            return this.datalist
                .filter((item) => item.checked)
                .map((item) => ({
                    businessNo: item.businessKey, // 将 businessKey 重命名为 businessNo
                    licenseId: item.licenseId, // 保留 licenseId
                    rentBackDate: item.rentBackDate, // 保留 rentBackDate
                }));
        },
        // 切换item的checked状态
        changeCheck(index, item) {
            this.$set(item, "checked", !item.checked); // 使用 Vue.set 确保响应性}
            if (!item.rentBackDate)
                this.showTimePick(index)
            this.$forceUpdate();
            // 如果需要对整个列表进行额外操作，可以在这里添加
        }
    }
}
