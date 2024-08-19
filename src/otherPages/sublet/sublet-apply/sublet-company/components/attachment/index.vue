<template>
    <card :title="title" class="card-padding">
        <imgupload :isupload="false" :imgFinishlist="companyInfo.fileList" v-if="companyInfo.fileList && companyInfo.fileList.length > 0" />
        <text-label-item class="text-label" tagName="备注" :inputDisabled="true" :inputValue="companyInfo.remark" v-if="companyInfo.remark" />
    </card>
</template>

<script>
import Card from "@/components/common/sany/card.vue";
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
export default {
    name: "attachment",
    components: {
        selectLabelItem,
        textLabelItem,
        imgupload,
        Card
    },
    props: {
        companyInfo: Object
    },
    data() {
        return {
            title: "附件及备注"
        }
    },
    components: {
    },
};
</script>

<style lang="scss" scoped>
.card-padding {
    display: flex;
    padding: 8px;
    //   padding-top: 0;
}

.text-label {
    ::v-deep  .textarea {
        // background-color: #e6e6e6 !important;
        padding: 14px;
        width: calc(100%);
        margin-left: 0;
    }
}
</style>
