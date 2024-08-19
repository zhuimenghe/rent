<template>
  <div>
    <icon-overview :list="overviews"></icon-overview>
    <payment-list :list="payments" :title="title" @headerrefresh="headerrefresh">
    </payment-list>
  </div>
</template>

<script>
import iconOverview from "./icon-overview";
import paymentList from "./payment-list";
export default {
  props: {
    overviews: {
      type: Array,
    },
    payments: {
      type: Array,
    },
  },
  computed: {
    title() {
      return `应付记录(${this.payments.length})`;
    },
  },
  methods: {
    headerrefresh() {
      this.$emit("headerrefresh");
    },
  },
  components: {
    iconOverview,
    paymentList,
  },
};
</script>

<style></style>
