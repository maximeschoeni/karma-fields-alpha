<script>
	(function() {
		var menu_items = <?php echo json_encode($this->menu_items); ?>;
		function registerLinks(links, key) {
			for (var i = 0; i < links.length; i++) {
				links[i].addEventListener("click", function(event) {
					event.preventDefault();
					// location.hash = key; //"karma="+key;
					// history.replaceState({table: null}, "");
					// history.pushState({table: key}, "");
					// window.dispatchEvent(new PopStateEvent("popstate"));


					KarmaFieldsAlpha.saucer.setParam(key, "table");

				});
			}
		}
		for (var key in menu_items) {
			var links = document.querySelectorAll(`a[href$="${menu_items[key]}"]`);
			registerLinks(links, key);
		}
		<?php /* foreach ($this->menu_items as $key => $item) { ?>
			registerLinks(document.querySelectorAll("a[href$='<?php echo $item; ?>']"), "<?php echo $key; ?>");
		<? } */ ?>
	})();
</script>
