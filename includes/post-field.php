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



		// let field = new KarmaFieldsAlpha.fields.form({
		// 	type: "form",
		// 	key: id,
		// 	driver: "posts",
		// 	children: [resource]
		// });
		let field = new KarmaFieldsAlpha.fields.form({
			type: "form",
			driver: "posts",
			children: [
				{
					type: "group",
					key: id,
					children: [resource]
				}
			]
		});

		input.form.addEventListener("submit", function() {
			field.getDeltaPathes().forEach(path => {
				localStorage.removeItem(path);
			});
		});

		window.karma_field = field; // -> debug

		// override form output event
		// field.events.change = function(currentField) {
		//
		// 	// let values = {};
		// 	// values[field.resource.driver] = {};
		// 	// values[field.resource.driver][id] = field.getModifiedValue() || {};
		//
		// 	let values = {};
		// 	values[field.resource.driver] = field.getModifiedValue() || {};
		//
		// 	input.value = JSON.stringify(values);
		// }

		field.edit = function() {

			let values = {};
			values[field.resource.driver] = field.getModifiedValue() || {};

			input.value = JSON.stringify(values);
		}

		KarmaFieldsAlpha.build({
			child: field.build(),
		}, container);
	});
</script>
