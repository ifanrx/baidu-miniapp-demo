Component({
  porperties: {
    label: {
      type: String,
      value: '',
    },
    type: {
      type: String,
      value: 'text',
    },
    value: {
      type: String,
      value: '',
    },
    placeholder: {
      type: String,
      value: '',
    },
    isShowLine: {
      type: Boolean,
      value: false,
    }
  },

  methods: {
    bindInput(e) {
      this.triggerEvent('inputchange', {
        value: e.detail.value,
      })
    }
  }
})