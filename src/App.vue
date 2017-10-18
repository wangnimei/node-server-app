<template>
  <div id="app">
    <div class="logo"></div>
    <div class="content">
      <app-button :type="isStarted ? 'disabled' : 'primary'" @click="startServer">Start server</app-button>
      <app-button :type="isStarted ? 'primary' : 'disabled'" @click="stopServer">Stop server</app-button>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import AppButton from './components/Button'
import { Tips } from './components/Tips'

export default {
  name: 'app',
  components: {
    AppButton
  },
  data () {
    return {
      process: null,
      isStarted: false
    }
  },
  methods: {
    startServer() {
      if (this.isStarted) return
      ipcRenderer.send('startServer')
    },
    stopServer() {
      if (!this.isStarted) return
      ipcRenderer.send('stopServer')
    }
  },
  created() {
    ipcRenderer.on('closed', (event, message) => {
      this.isStarted = false
      Tips({
        message: 'Server closed',
        duration: 1500
      })
    })

    ipcRenderer.on('listening', (event, message) => {
      this.isStarted = true
      Tips({
        message: `Listening on ${message}`,
        duration: 1500
      })
    })
  }
}
</script>
