import { defineStore } from 'pinia'

export const useMessageStore = defineStore('message', {
    state: () => ({
        message: '',
        type: 'info',
        timer: null
    }),
    actions: {
        initializeMessage() {
            this.clearMessage()
        },
        notify(message, type = 'info', duration = 3000) {
            this.clear()
            this.message = message
            this.type = type
            if (this.timer) clearTimeout(this.timer)
            if (duration > 0) {
                this.timer = setTimeout(() => this.clearMessage(), duration)
            }
        },
        clear() {
            if (this.timer) {
                clearTimeout(this.timer)
                this.timer = null
            }
            this.message = ''
        },
        clearMessage() {
            this.clear()
            this.type = 'info'
        }
    }
})