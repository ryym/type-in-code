<template>
  <div class="root">
    <header class="header">
      <h1>Type in Code</h1>
    </header>
    <div class="body">
      <p>
        This is a typing game using programming source code.<br>
        <button
          type="button"
          class="start-btn"
          title="Press Enter"
          :disabled="isInGame"
          @click="startTyping"
         >
          {{isInGame ? "STARTED!" : nPlays == 0 ? "START" : "RETRY"}}
        </button>
      </p>
      <main>
        <screen class="screen"></screen>
      </main>
    </div>
  </div>
</template>

<script>
import Screen from './screen';
import {mapGetters, mapState} from 'vuex';

export default {
  components: {
    Screen,
  },

  mounted() {
    document.addEventListener('keydown', this.detectKeydown);
    this.$store.dispatch('fetchProblemCode');

    this.$store.subscribe(mut => {
      if (mut.type === 'finishTyping') {
        document.addEventListener('keydown', this.detectKeydown);
      }
    });
  },

  beforeDestroy() {
    this.removeKeydownHandler();
  },

  computed: {
    ...mapState({
      nPlays: s => s.nPlays,
    }),

    ...mapGetters(['isInGame']),
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
    },
  },
};
</script>

<style scoped>
.root {
  background-color: rgb(37, 37, 38);
  color: rgb(156, 156, 156);
}

.header {
  background-color: rgb(51, 51, 51);
  color: #fff;
  padding: 8px 16px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
}

.header h1 {
  margin: 0;
  font-size: 20px;
}

.body {
  padding: 52px 20px 40px;
}

.start-btn {
  margin: 10px 0;
  color: #fff;
  border: 0;
  background-color: rgb(0, 122, 204);
  font-size: 16px;
  text-align: center;
  padding: 8px 12px;
  cursor: pointer;
}

.start-btn:disabled {
  opacity: 0.5;
}

.screen {
  margin: 40px auto;
  min-width: 480px;
}
</style>