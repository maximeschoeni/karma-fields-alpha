<script>
	(function() {
		var menu_items = <?php echo json_encode($this->menu_items); ?>;
		function registerLinks(links, key) {
			for (var i = 0; i < links.length; i++) {
				links[i].addEventListener("click", function(event) {
					console.log(key);
					event.preventDefault();
					location.hash = key; //"karma="+key;
				});
			}
		}
		for (var key in menu_items) {
			var links = document.querySelectorAll("a[href$='"+menu_items[key]+"']");
			registerLinks(links, key);
		}
	})();
</script>
