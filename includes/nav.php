<div id="karma-fields-field-nav" class="karma-fields"></div>

<script>

	document.addEventListener("DOMContentLoaded", function() {
		var container = document.getElementById("karma-fields-field-nav");
		var resource = <?php echo json_encode($this->resource) ?>;
		var index = <?php echo $this->index; ?>;
		var field = new KarmaFieldsAlpha.field.saucer({
			...resource,
			index: index
		});


		// KarmaFieldsAlpha.resource = resource;
		KarmaFieldsAlpha.build(field.build(), container);
		KarmaFieldsAlpha.saucer = field;

		// document.dispatchEvent(new CustomEvent('karmaFieldsAlpha'));
	});
</script>
