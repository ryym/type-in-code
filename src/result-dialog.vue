<template>
  <div class="result-dialog" :class="{'is-open': open}">
      <p class="title">CLEAR</p>
      <div class="body">
        <p v-for="result in results" :key="result" class="result">
          {{result}}
        </p>
        <div class="actions">
          <v-button @click="$emit('retry')">RETRY</v-button>
        </div>
      </div>
  </div>
</template>

<script scoped>
import {mapState, mapGetters} from 'vuex';
import Button from './button';

export default {
  components: {
    'v-button': Button,
  },

  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters(['totalTime']),

    ...mapState({
      nTypes: s => s.nTypes,
      missTypes: s => s.missTypes,
      missed: s => s.missed,
    }),

    missPercentage() {
      return Math.floor((this.missTypes / this.nTypes) * 100);
    },

    results() {
      return [
        `${this.totalTime}ms`,
        `Types: ${this.nTypes}`,
        `Miss types: ${this.missTypes} / ${this.nTypes} (${this.missPercentage}%)`,
      ];
    },
  },
};
</script>

<style scoped>
.result-dialog {
  display: none;
  border: 2px solid black;
  color: #fff;
  background-color: rgb(51, 51, 51);
  box-shadow: 2px 1px 2px 1px rgb(10, 10, 10);
  padding: 8px 16px;
  min-width: 360px;
}

.result-dialog.is-open {
  display: block;
  position: fixed;
  top: 20px;
  right: 20%;
  z-index: 200;
}

p {
  margin: 4px 0;
}

.title {
  text-align: center;
  border-bottom: 1px solid rgb(156, 156, 156);
  margin-bottom: 16px;
  padding-bottom: 8px;
  position: relative;
}

.title::before {
  content: '✓';
  color: rgb(35, 203, 108);
  margin-right: 0.2em;
  position: absolute;
  left: 0px;
  font-size: 1.6em;
  top: -8px;
}

.body {
  margin-left: 16px;
}

.result::before {
  content: '>';
  color: rgb(156, 156, 156);
  margin-right: 0.5em;
}

.actions {
  margin-top: 8px;
  text-align: center;
}
</style>
