<template>
  <pre><code :class="langClasses" v-html="codeHtml"></code></pre>
</template>

<script>
export default {
  props: ['lang', 'codeHtml'],

  computed: {
    langClasses() {
      return {
        hljs: true,
        [`language-${this.lang}`]: true,
      };
    },
  },
};
</script>
