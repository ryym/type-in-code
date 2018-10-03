<template>
  <div>
    <h1>Hello, {{name}}!</h1>
    <div v-html="html"></div>
    <screen></screen>
  </div>
</template>

<script>
import Screen from './screen';

export default {
  components: {
    Screen,
  },

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