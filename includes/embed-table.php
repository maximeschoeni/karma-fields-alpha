<style>

</style>

<div id="karma-fields-embed-<?php echo $index; ?>" class="karma-fields"></div>

<?php

	if ($index === 1) {

		$action = "karma_field-action";
		$nonce = "karma_field-nonce";

		wp_nonce_field($action, $nonce, false, true);

	}

?>

<script>


	KarmaFieldsAlpha.embeds["karma-fields-embed-<?php echo $index; ?>"] = <?php echo json_encode($args); ?>;


</script>
