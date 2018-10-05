<template>
  <div>
    <h1>Type in Code</h1>
    <p>
      This is a typing game using programming source code.<br>
      <span v-show="!startedTime">
        Press ENTER to
        {{nPlays === 0 ? "start" : "retry"}}!
      </span>
      <span v-show="startedTime">
        Started!
      </span>
    </p>
    <screen
      :problem="problem"
      :started-time="startedTime"
      @finish="handleFinish"
     ></screen>
  </div>
</template>

<script>
import Screen from './screen';

export default {
  components: {
    Screen,
  },

  mounted() {
    document.addEventListener('keydown', this.detectKeydown);
    this.$store.dispatch('fetchProblemCode');
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

  computed: {
    problem() {
      return this.$store.state.problem;
    },
  },

  methods: {
    detectKeydown(event) {
      if (event.code == 'Enter') {
        this.startTyping();
        this.removeKeydownHandler();
      }
    },

    removeKeydownHandler() {
      document.removeEventListener('keydown', this.detectKeydown);
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