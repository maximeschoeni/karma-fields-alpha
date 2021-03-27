<div id="karma-fields-post-<?php echo $post_id; ?>-field-<?php echo $index; ?>-container" class="karma-fields"></div>
<input type="hidden" name="karma-fields-items[]" id="karma-fields-post-<?php echo $post_id; ?>-input-<?php echo $index; ?>">

<?php
	$action = "karma_field-action";
	$nonce = "karma_field-nonce";

	wp_nonce_field($action, $nonce, false, true);
 ?>
<script>
	document.addEventListener("DOMContentLoaded", function() {
		let container = document.getElementById("karma-fields-post-<?php echo $post_id; ?>-field-<?php echo $index; ?>-container");
		let input = document.getElementById("karma-fields-post-<?php echo $post_id; ?>-input-<?php echo $index; ?>");
		let resource = <?php echo json_encode($args); ?>;
		let id = <?php echo $post_id; ?>;
		// let field = (!resource.type || resource.type === "group") && KarmaFieldsAlpha.Field(resource) || KarmaFieldsAlpha.Field({
		// 	children: [resource]
		// });
		let field = (resource.type === "form") && KarmaFieldsAlpha.createField(resource) || KarmaFieldsAlpha.createField({
			type: "form",
			key: id,
			driver: "posts",
			children: [resource]
		});

		// override form output event
		field.events.change = function(currentField) {
			currentField.history.save(); // -> should move on field level

			let values = {};
			values[field.resource.driver] = {};
			values[field.resource.driver][field.resource.key] = field.getModifiedValue() || {};

			input.value = JSON.stringify(values);

			return Promise.resolve(true);
		}






		//
		// field.events.change = function(currentField) {
		// 	currentField.history.save();
		// 	let values = {};
		// 	values[driver] = {};
		// 	values[driver][id] = {};
		// 	values[driver][id] = field.getModifiedValue() || {};
		// 	input.value = JSON.stringify(values);
		// };
		// field.events.init = function(currentField) {
		// 	if (currentField.resource.key) {
		// 		KarmaFieldsAlpha.Form.get(driver, id+"/"+currentField.resource.key).then(function(results) {
		// 			currentField.setValue(results, "set");
		// 		});
		// 	}
		// };
		// field.events.fetch = function(currentField) {
		// 	if (currentField.resource.key) {
		// 		return KarmaFieldsAlpha.Form.fetch(driver, "querykey", {
		// 			key: currentField.resource.key
		// 		}).then(function(results) {
		// 			return results;
		// 		});
		// 	}
		// };
		// field.events.files = function(ids) {
		// 	return KarmaFieldsAlpha.Form.fetch(driver, "queryfiles", {
		// 		ids: ids.join(",")
		// 	}).then(function(results) {
		// 		return results;
		// 	});
		// };

		KarmaFieldsAlpha.build({
			child: field.build(),
			// child: KarmaFieldsAlpha.fields[field.resource.type || "group"](field)
		}, container);
	});
</script>
