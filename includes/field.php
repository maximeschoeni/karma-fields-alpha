<div id="karma-fields-field-<?php echo $index; ?>-container" class="karma-fields"></div>

<script>
	document.addEventListener("DOMContentLoaded", function() {
		let container = document.getElementById("karma-fields-field-<?php echo $index; ?>-container");
		let resource = <?php echo json_encode($args); ?>;
		let driver = "<?php echo $driver; ?>";
		let field = KarmaFields.Field({
			type: "form",
			children: [resource]
		});

		KarmaFields.build({
			update: function(item) {
				this.child = KarmaFields.Fields.form(field);
			}
		}, container);

	});
</script>
