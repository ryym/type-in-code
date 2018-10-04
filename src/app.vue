<template>
  <div>
    <h1>Type in Code</h1>
    <p>
      This is a typing game using programming source code.<br>
      <span v-show="!startedTime">
        Press SPACE to
        {{nPlays === 0 ? "start" : "retry"}}!
      </span>
      <span v-show="startedTime">
        Started!
      </span>
    </p>
    <screen :started-time="startedTime" @finish="handleFinish"></screen>
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
      nPlays: 0,
    };
  },

  methods: {
    detectKeydown(event) {
      if (event.code == 'Space') {
        this.startTyping();
        this.removeKeydownHandler();
      }
    },

    removeKeydownHandler() {
      if (this.keydownHandler) {
        document.removeEventListener('keydown', this.keydownHandler);
      }
    },

    startTyping() {
      this.startedTime = Date.now();
    },

    handleFinish() {
      this.startedTime = null;
      this.nPlays += 1;
    },
  },
};
</script>

<style scoped>
/* nothing */
</style>