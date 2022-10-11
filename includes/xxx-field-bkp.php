<div id="karma-fields-field-<?php echo $index; ?>-container" class="karma-fields"></div>

<script>
	document.addEventListener("DOMContentLoaded", function() {
		let container = document.getElementById("karma-fields-field-<?php echo $index; ?>-container");
		let resource = <?php echo json_encode($args); ?>;
		let driver = "<?php echo $driver; ?>";
		let field = KarmaFieldsAlpha.Field({
			type: "form",
			children: [resource]
		});

		KarmaFieldsAlpha.build({
			update: function(item) {
				this.child = KarmaFieldsAlpha.Fields.form(field);
			}
		}, container);

	});
</script>
