<div id="karma-fields-field-<?php echo $index; ?>-container" class="karma-fields"></div>
<input type="hidden" name="karma-fields-items[]" id="karma-fields-input-<?php echo $index; ?>">

<?php
	$action = "karma_field-action";
	$nonce = "karma_field-nonce";

	wp_nonce_field($action, $nonce, false, true);
 ?>
<script>
	document.addEventListener("DOMContentLoaded", function() {
		var container = document.getElementById("karma-fields-field-<?php echo $index; ?>-container");
		var input = document.getElementById("karma-fields-input-<?php echo $index; ?>");
		let resource = <?php echo json_encode($args); ?>;
		let id = <?php echo $post->ID; ?>;

		let field = KarmaFields.Field({
			key: id,
			driver: "posts",
			children: [resource]
		}, {
			change: function(field) {
				field.history.save();
				input.value = JSON.stringify(form.getModifiedValue() || {});
			}
		});

		// form.events.init = function(field) {
		// 	// field.fetch();
		//
		// 	field.data.loading = true;
		// 	field.trigger("update");
		// 	form.trigger("get", field).then(function(value) {
		// 		field.data.loading = false;
		// 		field.setValue(value);
		// 	});
		// }
		// form.events.change = function(field) {
		// 	field.history.save();
		// 	// form.trigger("save");
		//
		// 	input.value = JSON.stringify(form.getModifiedValue() || {});
		// }

		KarmaFields.build({
			update: function(item) {
				this.child = KarmaFields.Fields.form(field);
			}
		}, container);


	});
</script>
