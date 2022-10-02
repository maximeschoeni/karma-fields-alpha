<div id="karma-fields-field-nav" class="karma-fields"></div>

<script>

	document.addEventListener("DOMContentLoaded", function() {
		var container = document.getElementById("karma-fields-field-nav");
		var resource = <?php echo json_encode($this->resource) ?>;
		var field = new KarmaFieldsAlpha.field.tables(resource);

		KarmaFieldsAlpha.resource = resource;
		KarmaFieldsAlpha.build(field.build(), container);
		KarmaFieldsAlpha.tables = field;

		document.dispatchEvent(new CustomEvent('karmaFieldsAlpha'));
	});
</script>
