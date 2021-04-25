<template>
  <div class="modal" v-show="value">
    <div class="container">
      <div class="modal__title">Direction</div>
      <p>Get a direction with your favourite apps</p>
      <button
        @click.prevent="close"
        class="mt-3 border-b border-teal font-semibold"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: {
    value: {
      required: true,
    },
  },
  methods: {
    close() {
      this.$emit("input", !this.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-enter-active,
.modal-leave-active {
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.5s;
  .modal-content {
    transform: scale(1.2);
    transition: 0.5s;
  }
}
.modal-enter,
.modal-leave-to {
  opacity: 0;
  transform: scale(0);
  transition: opacity 0.5s, transform 0s 0.5s;
  .modal-content {
    transform: scale(1);
  }
}
</style>
