<template functional>
  <button
    type="button"
    class="btn"
    v-bind="data.attrs"
    v-on="data.on"
    >
    <slot></slot>
  </button>
</template>

<script>
export default {};
</script>

<style scoped>
.btn {
  margin: 10px 0;
  color: #fff;
  border: 0;
  background-color: rgb(0, 122, 204);
  font-size: 16px;
  text-align: center;
  padding: 8px 12px;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.5;
}
</style>

