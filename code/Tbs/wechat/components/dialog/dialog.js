const App = getApp();

Component({
    options: {
        multipleSlots: true
    },
    properties: {
      index: {
          type: String,
          value: '1'
      }
    },
    data: {
        isShow: true
    },
    created: function () {
      
    },
    methods: {
      showDialog: function() {
          this.setData({
            isShow: false
          })
      },
      hideDialog: function() {
          this.setData({
            isShow: true
          })
      }
    }
});