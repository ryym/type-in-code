<template>
  <div>
    <h1>Type in Code</h1>
    <p>
      This is a typing game using programming source code.<br>
      <span v-show="!startedTime">
        Press SPACE to start!
      </span>
      <span v-show="startedTime">
        Started!
      </span>
    </p>
    <screen :started-time="startedTime"></screen>
  </div>
</template>

<script>
import Screen from './screen';

export default {
  components: {
    Screen,
  },

  mounted() {
    this.keydownHandler = document.addEventListener('keydown', this.detectKeydown);
  },

  beforeDestroy() {
    this.removeKeydownHandler();
  },

  data() {
    return {
      startedTime: null,
    };
  },

  methods: {
    detectKeydown(event) {
      if (event.code == 'Space') {
        this.startedTime = Date.now();
        this.removeKeydownHandler();
      }
    },

    removeKeydownHandler() {
      if (this.keydownHandler) {
        document.removeEventListener('keydown', this.keydownHandler);
      }
    },
  },
};
</script>

<style scoped>
/* nothing */
</style>