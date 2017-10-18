<template>
  <transition name="tips">
    <div class="tips-wrapper" v-show="visible">
      <i :class="iconClass"></i>
      <span class="message">{{message}}</span>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'tips',
  data() {
    return {
      type: 'success',
      message: '',
      visible: false,
      duration: 3000,
      closed: false
    }
  },
  watch: {
    closed(val) {
      if (val) {
        this.visible = false
        this.$el.addEventListener('transitionend', this.destroy)
      }
    }
  },
  computed: {
    iconClass() {
      return {
        icon: true,
        success: this.type === 'success',
        warning: this.type === 'warning',
        error: this.type === 'error'
      }
    }
  },
  methods: {
    destroy() {
      this.$el.removeEventListener('transitionend', this.destroy)
      this.$destroy(true)
      document.body.removeChild(this.$el)
    },
    startTimer() {
      if (this.duration > 0) {
        setTimeout(() => {
          if (!this.closed) {
            this.closed = true
          }
        }, this.duration)
      }
    }
  },
  mounted() {
    this.startTimer()
  }
}
</script>
