<script setup>
const props = defineProps(["pagePropertyName", "model", "heading", "message"]);

function prefixPropertyName(propertyName) {
  return props.pagePropertyName
    ? `${props.pagePropertyName}.${propertyName}`
    : propertyName;
}
</script>

<template>
  <div class="buyTickets-container">
    <h3 v-epi-edit="prefixPropertyName('Heading')">
      {{ heading || model.heading }}
    </h3>
    <div>
      <label for="tickets-email" v-epi-edit="prefixPropertyName('Message')">
        {{ message || model.message }}
        <input id="tickets-email" type="email" />
      </label>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "../../assets/styles/common/variables.less";

.buyTickets-container {
  background: @backgroundColor;
  padding: @space;
  border-radius: 1em;
}
</style>
