Component({
  properties: {
    last: {
      type: Boolean,
      value: true,
    },
    arrow: {
      type: Boolean,
      value: true,
    },
    url: {
      type: String,
      value: '',
    }
  },
  methods: {
    onTap(e) {
      this.triggerEvent('click', e);
    }
  },
  externalClasses: ['my-class']
})