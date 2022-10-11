<div id="karma-fields-option-field-<?php echo $index; ?>-container" class="karma-fields karma-fields-option"></div>
<input type="hidden" name="karma-fields-items[]" id="karma-fields-option-input-<?php echo $index; ?>">

<?php
	$action = "karma_field-action";
	$nonce = "karma_field-nonce";

	wp_nonce_field($action, $nonce, false, true);
 ?>
<script>
	document.addEventListener("DOMContentLoaded", function() {
		let container = document.getElementById("karma-fields-option-field-<?php echo $index; ?>-container");
		let input = document.getElementById("karma-fields-option-input-<?php echo $index; ?>");
		let resource = <?php echo json_encode($args); ?>;


		let field = new KarmaFieldsAlpha.fields.form({
			type: "form",
			driver: "options",
			children: [resource]
		});

		field.delta = {
			getObject: function() {
				// let delta = JSON.parse(input.value || "{}");
				// delta = KarmaFieldsAlpha.Type.sanitizeObject(delta);
				// return delta;
				return JSON.parse(input.value || "{}");
			},
			setObject: function(delta) {
				// delta = KarmaFieldsAlpha.Type.parseObject(delta);
				input.value = JSON.stringify(delta);
			},
			get: function(...path) {
				return KarmaFieldsAlpha.DeepObject.get(this.getObject(), ...path);
			},
			set: function(value, ...path) {
				const delta = this.getObject();
				KarmaFieldsAlpha.DeepObject.assign(delta, value, ...path);
				this.setObject(delta);
			},
			remove: function(value, ...path) {
				const delta = this.getObject();
				if (delta) {
					KarmaFieldsAlpha.DeepObject.remove(delta, ...path);
					this.setObject(delta);
				}
			}
		}

		KarmaFieldsAlpha.build({
			child: field.build(),
		}, container);
	});
</script>
