KarmaFields.includes.icon = function(args) {
  return {
    class: "karma-icon",
    update: function(icon) {
      if (this.element._src !== args.file) {
        KarmaFields.getAsset(args.file).then(function(result) {
          requestAnimationFrame(function() {
            icon.element.innerHTML = result;
          });
        });
        this.element._src = args.file;
      }
      this.render = function() {};
    }
  };
}
