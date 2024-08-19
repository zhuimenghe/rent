export default {
    data() {
        return {
            paymentInput: "0",
            remarkInput: '',
            paymentForm: {

            }
        }
    },

    methods: {
        paymentCancel() {
            this.$refs.payTip.close();
            this.paymentInput = "0";
            this.remarkInput = "";

        }
        , paymentConfirm() {
            if (!this.paymentInput) {
                uni.showToast({
                    title: '请输入已付金额',
                    icon: 'none'
                });
                return;
            }
            this.paymentForm.total = this.$datestr.doubleFloat(Number(this.paymentForm.total_o) + Number((Number(this.paymentForm.paidTotal_o) - Number(this.paymentInput))))
            this.paymentForm.paidRemark = this.remarkInput
            this.paymentForm.paidTotal = this.paymentInput
            uni.showLoading();
            this.$network
                .getData(this.$url.SUBLET_PAY_FINISH, 'PUT', this.paymentForm)
                .then(result => {
                    this.headerrefresh();
                    uni.showToast({
                        title: '修改成功',
                        icon: 'none'
                    });
                    this.$refs.payTip.close();
                    this.remarkInput = ""
                    this.paymentInput = "0";
                    uni.hideLoading();
                })
                .catch(err => {
                    uni.showToast({
                        title: err.message + "," + err.details[0],
                        icon: 'none'
                    });
                });
        }
    },
}
