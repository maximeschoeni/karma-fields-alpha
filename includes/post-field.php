<div id="karma-fields-post-<?php echo $post_id; ?>-field-<?php echo $index; ?>-container" class="karma-fields karma-fields-post"></div>
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
		let id = "<?php echo $post_id; ?>";

		// let form = new KarmaFieldsAlpha.fields.form({
		// 	type: "form",
		// 	driver: "posts",
		// 	children: [
		// 		{
		// 			type: "field",
		// 			key: id,
		// 			children: [resource]
		// 		}
		// 	]
		// });
		//
		// form.buffer.getObject = function() {
		// 	return JSON.parse(input.value || "{}");
		// };
		// form.buffer.setObject = function(delta) {
		// 	input.value = JSON.stringify(delta);
		// }

		// let gateway = new KarmaFieldsAlpha.fields.gateway({
		// 	driver: "posts",
		// 	children: [
		// 		{
		// 			id: "form",
		// 			type: "form",
		// 			children: [
		// 				{
		// 					type: "field",
		// 					key: id,
		// 					children: [
		// 						{
		// 							type: "group",
		// 							children: [resource]
		// 						}
		// 					]
		// 				}
		// 			]
		// 		}
		// 	]
		// });

		// let gateway = new KarmaFieldsAlpha.fields.gateway({
		// 	driver: "posts",
		// 	children: [
		// 		{
		// 			id: "form",
		// 			key: id,
		// 			type: "form",
		// 			// children: [
		// 			// 	{
		// 			// 		type: "field",
		// 			// 		key: id,
		// 					children: [resource]
		// 			// 	}
		// 			// ]
		// 		}
		// 	]
		// });

		let gateway = new KarmaFieldsAlpha.fields.gateway({
			driver: "posts",
		});
		let form = gateway.createChild({
			id: "form",
			key: id,
			type: "form",
			children: [resource]
			// children: [
			// 	{
			// 		type: "field",
			// 		key: id,
			// 		children: [resource]
			// 	}
			// ]
		});

		form.buffer.getObject = function() {
			return JSON.parse(input.value || "{}");
		};
		form.buffer.setObject = function(delta) {
			input.value = JSON.stringify(delta);
		}

		// gateway.buffer.getObject = function() {
		// 	return JSON.parse(input.value || "{}");
		// };
		// gateway.buffer.setObject = function(delta) {
		// 	console.log(delta);
		// 	// input.value = JSON.stringify(delta.form);
		// }

		KarmaFieldsAlpha.build({
			child: form.build()
		}, container);
	});
</script>
