<div id="karma-fields-field-nav" class="karma-fields"></div>

<script>
	document.addEventListener("DOMContentLoaded", function() {
		var container = document.getElementById("karma-fields-field-nav");
		var tables = <?php echo json_encode($this->tables); ?>;
		var field = new KarmaFieldsAlpha.fields.navigation({
			children: tables
		});
		KarmaFieldsAlpha.build(field.build(), container);
	});
</script>
