Component({
  properties: {
    value: {
      type: Number,
      value: 0
    },
    step: {
      type: Number,
      value: 1
    },
  },

  lifetimes: {
    attached() {},
  },

  methods: {
    onBtnClick(e) {
      const operator = e.target.dataset.operator
      const offset = Number(operator + this.data.step)
      this.setData({value: this.data.value + offset})
      this.emitInputChange()
    },

    onInput(e) {
      this.setData({value: e.detail.value})
      this.emitInputChange()
    },

    emitInputChange() {
      this.triggerEvent('inputchange', {
        value: this.data.value
      })
    }
  }
})