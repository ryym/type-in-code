<template>
  <!-- Be careful not to insert link breaks. -->
  <pre><code :class="langClasses"><span
    v-html="codeHtml"
   ></span><span
    :class="{
      'code-cursor': showCursor,
      'is-blinking': !inputting,
      'has-missed': hasMissed,
    }"
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
    hasMissed: {
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
.hljs {
  background-color: #111;
}

.code-cursor {
  margin: 0 10px 0 0;
  border-right: 1px #fff solid;
}

.code-cursor.is-blinking {
  animation-name: blink-cursor;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}

.code-cursor.has-missed {
  animation-name: has-missed;
  animation-duration: 0.2s;
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

@keyframes has-missed {
  0% {
    transform: scale(4);
    border: 6px solid red;
  }

  20% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
    border: 1px solid #fff;
  }
}
</style>
