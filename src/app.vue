<template>
  <div class="app">
    <header class="header">
      <div class="header-left">
        <h1>Type in Code</h1>
      </div>
      <div v-if="isInGame" class="header-right">
        {{elapsedSecs}} s
      </div>
      <div class="typing-progress">
        <div
          class="typing-progress-bar"
          :style="{'width': `${typingProgress}%`}"
        ></div>
      </div>
    </header>
    <div class="body">
      <p>
        This is a typing game using programming source code.<br>
        <v-button
          type="button"
          title="Press Enter"
          :disabled="isInGame"
          @click="startTyping"
         >
          {{isInGame ? "STARTED!" : nPlays == 0 ? "START" : "RETRY"}}
        </v-button>
      </p>
      <main>
        <screen class="screen"></screen>
        <result-dialog :open="finished" @retry="startTyping">
        </result-dialog>
      </main>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import Button from './button';
import Screen from './screen';
import ResultDialog from './result-dialog';

export default {
  components: {
    'v-button': Button,
    Screen,
    ResultDialog,
  },

  mounted() {
    document.addEventListener('keydown', this.detectKeydown);
    this.$store.dispatch('fetchProblemCode');

    this.$store.subscribe(mut => {
      if (mut.type === 'finishTyping') {
        this.handleFinishTyping();
      }
    });
  },

  beforeDestroy() {
    this.removeKeydownHandler();
  },

  data() {
    return {
      elapsedSecs: 0,
    };
  },

  computed: {
    ...mapState({
      nPlays: s => s.nPlays,
    }),

    ...mapGetters(['isInGame', 'finished']),

    typingProgress() {
      return this.$store.getters.inputPercentage;
    },
  },

  methods: {
    detectKeydown(event) {
      if (event.code == 'Enter') {
        this.startTyping();
      }
    },

    removeKeydownHandler() {
      document.removeEventListener('keydown', this.detectKeydown);
    },

    startTyping() {
      this.$store.dispatch('startTyping');
      this.removeKeydownHandler();

      this.elapsedSecsTimer = setInterval(() => {
        this.elapsedSecs += 1;
      }, 1000);
    },

    handleFinishTyping() {
      clearInterval(this.elapsedSecsTimer);
      this.elapsedSecs = 0;
      document.addEventListener('keydown', this.detectKeydown);
    },
  },
};
</script>

<style scoped>
.app {
  background-color: rgb(37, 37, 38);
  color: rgb(156, 156, 156);
  min-height: 100%;
}

h1 {
  margin: 0;
  font-size: 20px;
}

.header {
  position: relative;
  display: flex;
  align-items: center;
  background-color: rgb(51, 51, 51);
  color: #fff;
  padding: 8px 16px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
}

.header-left {
  flex: 1 1 auto;
}

.header-right {
  justify-content: flex-end;
  flex: 1 1 auto;
  display: inline-flex;
  align-items: center;
}

.typing-progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
}

.typing-progress-bar {
  background-color: rgb(0, 122, 204);
  height: 100%;
  transition: width 0.1s linear;
}

.body {
  padding: 52px 32px 40px;
}

.screen {
  margin: 40px auto;
  min-width: 480px;
}
</style>