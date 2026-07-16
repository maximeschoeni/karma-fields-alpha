<div id="karma-fields-embed-<?php echo $index; ?>" class="karma-fields container-field"></div>
<script>

	// const container = document.getElementById("karma-fields-embed-<?php echo $index; ?>");
	// const resource = <?php //echo json_encode($args); ?>;

	// KarmaFieldsAlpha.instances.push({
	// 	element: document.getElementById("karma-fields-embed-<?php echo $index; ?>"),
	// 	// element: document.scriptElement.previousElementSibling,
	// 	resource: <?php // echo json_encode($args); ?>
	// });

	addEventListener("DOMContentLoaded", () => {

		const root = new KarmaFieldsAlpha.field({}, "root");

		// todo: should be able to create a new Field without parent

		const container = root.createChild({
			clipboard: <?php echo $index; ?> === 1, // just once!
			...<?php echo json_encode($args); ?>
		}, "form");

		container.element = document.getElementById("karma-fields-embed-<?php echo $index; ?>");

		container.render();

		// KarmaFieldsAlpha.field.prototype.createChild({
		// 	clipboard: true,
		// 	...<?php echo json_encode($args); ?>
		// }, "root");

		// root.element = document.getElementById("karma-fields-embed-<?php echo $index; ?>");

		// root.render();

	});


	// const saucer = new KarmaFieldsAlpha.field.saucer({
	// 	children: [resource]
	// }, "saucer");

	// abduct(container, root.build());



</script>
<?php

	if ($index === 1) {

		$action = "karma_field-action";
		$nonce = "karma_field-nonce";

		wp_nonce_field($action, $nonce, false, true);

	}

?>
