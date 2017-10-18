<template>
  <button :class="classes" @click="launch"><slot></slot></button>
</template>

<script>
export default {
  name: 'button-component',
  props: {
    type: String
  },
  data() {
    return {}
  },
  computed: {
    classes() {
      const obj = {}

      obj['btn'] = true
      obj['primary'] = this.type === 'primary'
      obj['disabled'] = this.type === 'disabled'
      return obj
    }
  },
  methods: {
    launch() {
      if (this.type === 'disable') return
      this.$emit('click')
    }
  }
}
</script>