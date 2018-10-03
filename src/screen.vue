<template>
  <div>
    <textarea
      autofocus
      id="input"
      cols="1"
      rows="1"
      ref="textarea"
      class="screen-textarea"
      @input="parseInput"
     ></textarea>
    <div id="error"></div>
    <div class="container" @click="focusTextarea">
      <code-block lang="javascript" :code-html="codeHtml" />
      <code-block class="display" lang="javascript" :code-html="inputHtml" />
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
      finalCode: code,
      codeHtml: result.value,
      inputHtml: '',
    };
  },

  methods: {
    focusTextarea() {
      this.$refs.textarea.focus();
    },
    parseInput(event) {
      const code = event.target.value;
      if (this.finalCode.indexOf(code) === -1) {
        console.log('wrong input');
        const lastIdx = code.length - 1;
        this.$refs.textarea.value = code.substring(0, lastIdx);
        return;
      }

      const result = hljs.highlight('javascript', code, true);
      this.inputHtml = result.value;
    },
  },
};
</script>

<style>
/* XXX: Should use scoped styles */

pre {
  margin: 0;
}

.screen-textarea {
  /* XXX: Is there a better way to hide textarea? */
  position: absolute;
  top: -100px;
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

.display > code {
  padding-right: 0;
  background-color: transparent;
}

.code-cursor {
  margin: 0 10px 0 0;
  border-right: 1px white solid;
}
</style>
