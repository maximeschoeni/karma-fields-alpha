<div id="karma-fields-embed-<?php echo $index; ?>" class="karma-fields"></div>
<script>

	// KarmaFieldsAlpha.embeds["karma-fields-embed-<?php echo $index; ?>"] = <?php echo json_encode($args); ?>;


	KarmaFieldsAlpha.instances.push({
		element: document.getElementById("karma-fields-embed-<?php echo $index; ?>"),
		// element: document.scriptElement.previousElementSibling,
		resource: <?php echo json_encode($args); ?>
	});

</script>
<?php

	if ($index === 1) {

		$action = "karma_field-action";
		$nonce = "karma_field-nonce";

		wp_nonce_field($action, $nonce, false, true);

	}

?>
