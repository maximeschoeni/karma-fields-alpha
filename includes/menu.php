<script>
	(function() {
		var menu_items = <?php echo json_encode($this->menu_items); ?>;
		function registerLinks(links, key) {
			for (var i = 0; i < links.length; i++) {
				links[i].addEventListener("click", function(event) {
					event.preventDefault();

					if (KarmaFieldsAlpha.saucer) {
						KarmaFieldsAlpha.Task.add({
							resolve: () => {
								KarmaFieldsAlpha.History.save("open", "Open link");
								KarmaFieldsAlpha.saucer.open(key);
							}
						});
						KarmaFieldsAlpha.saucer.render();
					}
				});
			}
		}
		for (var key in menu_items) {
			var links = document.querySelectorAll(`a[href$="${menu_items[key]}"]`);
			registerLinks(links, key);
		}
	})();
</script>
