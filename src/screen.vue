<template>
  <div>
    <textarea
      cols="1"
      rows="1"
      ref="textarea"
      class="textarea"
      :disabled="finished"
      @keydown="preventInvalidKeys"
      @input="parseInput"
    >
    </textarea>
    <div class="main">
      <div class="mask" v-if="!isInGame"></div>
      <div class="container" @click="focusTextarea">
        <code-block
          :lang="problem.lang"
          :code-html="finalHtml"
         />
        <code-block
          class="display"
          :lang="problem.lang"
          :code-html="inputHtml"
          show-cursor
          :inputting="isInGame"
          :has-missed="missed"
         />
      </div>
      <result-dialog :open="finished" />
    </div>
  </div>
  </template>

<script>
import CodeBlock from './code-block';
import ResultDialog from './result-dialog';
import {mapGetters, mapState} from 'vuex';

export default {
  components: {
    CodeBlock,
    ResultDialog,
  },

  mounted() {
    this.$store.watch(
      s => s.input,
      input => {
        if (this.$refs.textarea.value !== input) {
          this.syncTextarea(input);
        }
      }
    );

    this.$store.subscribe(mut => {
      if (mut.type === 'startTyping') {
        requestAnimationFrame(() => this.focusTextarea());
      }
    });
  },

  data() {
    return {
      isLastKeyValid: true,
    };
  },

  computed: {
    ...mapGetters(['finalHtml', 'inputHtml', 'started', 'finished', 'isInGame']),

    ...mapState({
      problem: s => s.problem,
      missed: s => s.missed,
    }),
  },

  methods: {
    syncTextarea(input) {
      this.$refs.textarea.value = input;
    },

    focusTextarea() {
      this.$refs.textarea.focus();
    },

    preventInvalidKeys(event) {
      this.isLastKeyValid = event.code != 'Backspace';
      if (!this.isLastKeyValid) {
        event.preventDefault();
      }
    },

    parseInput(event) {
      if (!this.isLastKeyValid) {
        return;
      }

      const input = event.target.value;
      const {$store: store} = this;
      if (store.getters.isCorrectInput(input)) {
        store.dispatch('addInput', input);
      } else {
        this.syncTextarea(store.state.input);
        store.dispatch('addMissType');
      }
    },
  },
};
</script>

<style scoped>
pre {
  font-size: 16px;
  margin: 0;
}

.start-btn {
  cursor: pointer;
}

.textarea {
  /* XXX: Is there a better way to hide textarea? */
  position: absolute;
  top: -1000px;
}

.main {
  position: relative;
}

.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 10;
}

.container {
  position: relative;
}

.display {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(48, 48, 48, 0.3);
}

.display >>> code {
  padding-right: 0;
  background-color: transparent;
}
</style>