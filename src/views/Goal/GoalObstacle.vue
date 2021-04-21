<template>
  <div>
    <div>
      <h3>
        <i
          class="material-icons"
          style="vertical-align: -5px; margin-right: 5px"
          >hiking</i
        >Obstacles
      </h3>
      <button class="click_me position_correction" @click="modal = true">
        <span class="add_it">Add it.</span>
      </button>
    </div>

    <MyModal @close="closeModal" v-if="modal">
      <!-- default スロットコンテンツ -->
      <p>Vue.js Modal Window!</p>
      <div><input v-model="message" /></div>
      <!-- /default -->
      <!-- footer スロットコンテンツ -->
      <template slot="footer">
        <button @click="doSend">送信</button>
      </template>
      <!-- /footer -->
    </MyModal>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Modal from "@/components/Modal.vue";
export default Vue.extend({
  components: {
    Modal,
  },
  data() {
    return {
      modal: false,
    };
  },
});
</script>

<style lang="scss" scoped>
.click_me {
  border: 10px dashed #d5d6d8;
  background: none;
  width: 90%;
  height: 10em;
  border-radius: 10px 10px;

  &:focus {
    border: 10px dashed #50c38f;
    transition: 0.3s;
  }
  &:hover {
    border: 10px dashed #50c38f;
    transition: 0.3s;
  }
}
.click_me:focus .add_it {
  color: #50c38f;
  transition: 0.3s;
}
.click_me:hover .add_it {
  color: #50c38f;
  transition: 0.3s;
}
.add_it {
  font-size: 3em;
  font-weight: 700;
  color: #d5d6d8;
}

.position_correction {
  font-weight: normal;
  margin: 0em 0em 0.5em 3em;
}
</style>
