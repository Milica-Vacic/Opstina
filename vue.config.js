module.exports = {
    css: {
      loaderOptions: {
        scss: {
            additionalData: `
            @import "@/scss/Variables.scss";
            @import "@/scss/Mixins.scss";
          `
        }
      }
    }
  }