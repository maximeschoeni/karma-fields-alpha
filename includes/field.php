<div id="karma-fields-field-<?php echo $index; ?>-container" class="karma-fields"></div>

<script>
	document.addEventListener("DOMContentLoaded", function() {
		let container = document.getElementById("karma-fields-field-<?php echo $index; ?>-container");
		let resource = <?php echo json_encode($args); ?>;
		// let domain = new KarmaFieldsAlpha.Domain();
		let field = KarmaFieldsAlpha.fields.field.create(resource);

		KarmaFieldsAlpha.build({
			child: field.build(),
		}, container);
	});
</script>
