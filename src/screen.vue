<template>
  <div>
    <button type="button" class="start-btn" @click="startTyping">
      {{started ? "STARTED!" : "START"}}
    </button>
    <textarea
      cols="1"
      rows="1"
      ref="textarea"
      class="textarea"
      :disabled="finished"
      @keydown="preventInvalidKeys"
      @keyup="parseInput"
    >
    </textarea>
    <div class="main">
      <div class="mask" v-if="!isInGame"></div>
      <div class="miss">
        <template  v-if="miss">
          <div class="miss-got">{{miss.got}}</div>
          <div class="miss-want">{{miss.want}}</div>
        </template>
      </div>
      <div class="container" @click="focusTextarea">
        <code-block lang="javascript" :code-html="codeHtml" />
        <code-block class="display" lang="javascript" :code-html="inputHtml" />
      </div>
      <dialog :open="finished">
        <p>clear!</p>
        <p>{{elapsedTime}}ms</p>
        <p>Miss types: {{missTypes}} / {{nTypes}} ({{missPercentage}}%)</p>
      </dialog>
    </div>
  </div>
  </template>

  <script>
import CodeBlock from './code-block';

export default {
  components: {
    CodeBlock,
  },

  mounted() {
    if (typeof hljs === 'undefined') {
      throw new Error('Highlight.js must be loaded');
    }
  },

  data() {
    const code = `console.log('hello');`;
    const result = hljs.highlight('javascript', code, true);
    return {
      startedTime: null,
      finishedTime: null,
      finalCode: code,
      codeHtml: result.value,
      inputHtml: '',
      miss: null,
      isLastKeyValid: true,
      nTypes: 0,
      missTypes: 0,
    };
  },

  computed: {
    started() {
      return this.startedTime != null;
    },

    finished() {
      return this.started && this.finishedTime != null;
    },

    isInGame() {
      return this.started && !this.finished;
    },

    elapsedTime() {
      return this.finishedTime - this.startedTime;
    },

    missPercentage() {
      return Math.floor((this.missTypes / this.nTypes) * 100);
    },
  },

  methods: {
    startTyping() {
      this.startedTime = Date.now();
      this.focusTextarea();
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

      this.nTypes += 1;

      const code = event.target.value;
      const lastIdx = code.length - 1;
      if (this.finalCode.indexOf(code) === -1) {
        this.missTypes += 1;
        this.miss = {
          want: this.finalCode[lastIdx],
          got: code[lastIdx],
        };
        this.$refs.textarea.value = code.substring(0, lastIdx);
        return;
      } else {
        this.miss = null;
      }

      const result = hljs.highlight('javascript', code, true);
      this.inputHtml = result.value;

      if (code.length === this.finalCode.length) {
        this.finishTyping();
      }
    },

    finishTyping() {
      this.finishedTime = Date.now();
    },
  },
};
</script>

<style scoped>
pre {
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

.miss {
  height: 50px;
}

.miss-got {
  color: red;
}

.miss-got::before {
  content: '✖ ';
  width: 20px;
  display: inline-block;
}

.miss-want {
  color: green;
}

.miss-want::before {
  content: '✓ ';
  width: 20px;
  display: inline-block;
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

.code-cursor {
  margin: 0 10px 0 0;
  border-right: 1px white solid;
}
</style>
