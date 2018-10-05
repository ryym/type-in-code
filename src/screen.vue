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
      <div class="miss">
        <template  v-if="miss">
          <div class="miss-got">{{miss.got}}</div>
          <div class="miss-want">{{miss.want}}</div>
        </template>
      </div>
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
         />
      </div>
      <dialog :open="finished">
        <p>clear!</p>
        <p>{{totalTime}}ms</p>
        <p>Miss types: {{missTypes}} / {{nTypes}} ({{missPercentage}}%)</p>
      </dialog>
    </div>
  </div>
  </template>

  <script>
import CodeBlock from './code-block';

const SAMPLE_CODE = `function add(a, b) {
  return a + b;
}`;

const SAMPLE_CODE_NON_ASCII = `// 日本語コメント
function ほげ(a, いうえ, c) {
  あい, console.log(a + "𠮷野屋😭")
}`;

const CHAR_CODE = {
  LF: 10,
};

const findNextAsciiPos = (str, from) => {
  for (let i = from; i < str.length; i++) {
    const cc = str.charCodeAt(i);

    // Allow characters between space and tilde and line feeds.
    if ((32 <= cc && cc <= 126) || cc === CHAR_CODE.LF) {
      return i;
    }
  }
  return null;
};

const makeSpacePrefixes = (str, from) => {
  let i = from;
  let spaces = '';
  while (str[i] === ' ' && i < str.length) {
    spaces += ' ';
    i += 1;
  }
  return spaces;
};

export default {
  props: {
    problem: {
      type: Object,
      required: true,
    },
    startedTime: {
      type: Number,
      default: null,
    },
  },

  components: {
    CodeBlock,
  },

  mounted() {
    if (typeof hljs === 'undefined') {
      throw new Error('Highlight.js must be loaded');
    }
  },

  data() {
    // TODO: Replace tabs and full width spaces to spaces.
    // TODO: Replace CRLF to LF?
    const result = hljs.highlight('javascript', this.problem.code, true);
    return {
      finishedTime: null,
      codeLang: 'javascript',
      finalHtml: result.value,
      inputHtml: '',
      miss: null,
      isLastKeyValid: true,
      nTypes: 0,
      missTypes: 0,
      cursorPos: null,
      totalTime: null,
    };
  },

  computed: {
    started() {
      return this.startedTime != null;
    },

    finished() {
      return this.finishedTime != null;
    },

    isInGame() {
      return this.started && !this.finished;
    },

    missPercentage() {
      return Math.floor((this.missTypes / this.nTypes) * 100);
    },
  },

  watch: {
    startedTime(next, prev) {
      if (prev == null && next != null) {
        this.startTyping();
      }
    },
  },

  methods: {
    startTyping() {
      this.finishedTime = null;
      this.inputHtml = '';
      this.nTypes = 0;
      this.missTypes = 0;
      this.cursorPos = findNextAsciiPos(this.problem.code, 0);
      this.totalTime = null;

      // Without delaying the focusing,
      // a space (the trigger key to start) is inserted
      // to the textarea...
      requestAnimationFrame(() => this.focusTextarea());
    },

    focusTextarea() {
      this.$refs.textarea.focus();
      this.$refs.textarea.value = '';
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

      const finalCode = this.problem.code;

      let code = event.target.value;
      if (code[this.cursorPos] !== finalCode[this.cursorPos]) {
        this.missTypes += 1;
        this.miss = {
          want: finalCode[this.cursorPos],
          got: code[this.cursorPos],
        };
        this.$refs.textarea.value = code.substring(0, this.cursorPos);
        return;
      } else {
        this.miss = null;
      }

      // Skip space prefixes.
      if (finalCode.charCodeAt(this.cursorPos) === CHAR_CODE.LF) {
        const spaces = makeSpacePrefixes(finalCode, this.cursorPos + 1);
        if (spaces) {
          this.cursorPos += spaces.length;
          code += spaces;
          this.$refs.textarea.value = code;
        }
      }

      const result = hljs.highlight('javascript', code, true);
      this.inputHtml = result.value;

      // Skip un-inputtable characters.
      const nextPos = findNextAsciiPos(finalCode, this.cursorPos + 1);
      if (nextPos == null) {
        this.cursorPos = finalCode.length;
      } else {
        if (nextPos - this.cursorPos > 1) {
          const addedCode = code + finalCode.substring(this.cursorPos + 1, nextPos);
          this.$refs.textarea.value = addedCode;

          const result2 = hljs.highlight('javascript', addedCode, true);
          this.inputHtml = result2.value;
        }
        this.cursorPos = nextPos;
      }

      if (this.cursorPos >= finalCode.length) {
        this.finishTyping();
      }
    },

    finishTyping() {
      this.finishedTime = Date.now();
      this.totalTime = this.finishedTime - this.startedTime;
      this.$emit('finish');
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
</style>