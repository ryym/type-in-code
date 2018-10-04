<template>
  <!-- Be careful not to insert link breaks. -->
  <pre><code :class="langClasses"><span
    v-html="codeHtml"
   ></span><span
    :class="{'code-cursor': showCursor, 'is-blinking': !inputting}"
   ></span></code></pre>
</template>

<script>
export default {
  props: {
    lang: String,
    codeHtml: String,
    showCursor: {
      type: Boolean,
      default: false,
    },
    inputting: {
      type: Boolean,
      default: false,
    },
  },

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

<style scoped>
.code-cursor {
  margin: 0 10px 0 0;
  border-right: 1px #fff solid;
}

.code-cursor.is-blinking {
  animation-name: blink-cursor;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}

@keyframes blink-cursor {
  0% {
    visibility: hidden;
  }

  50% {
    visibility: hidden;
  }

  100% {
    visibility: visible;
  }
}
</style>
