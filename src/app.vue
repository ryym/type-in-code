<template>
  <div>
    <h1>Hello, {{name}}!</h1>
    <div v-html="html"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {name: 'world', html: '<em>hello</em>'};
  },
};
</script>

<style scoped>
h1 {
  color: green;
}
</style>
