<style>

</style>

<div id="karma-fields-embed-<?php echo $this->index; ?>" class="karma-fields"></div>

<?php
	$action = "karma_field-action";
	$nonce = "karma_field-nonce";

	wp_nonce_field($action, $nonce, false, true);
?>

<script>

	KarmaFieldsAlpha.embeds.push({
		driver: "<?php echo $driver; ?>",
		id: "<?php echo $id; ?>",
		...<?php echo json_encode($args); ?>,
    type: "postform",
		index: "karma-fields-embed-<?php echo $this->index; ?>"
	});

</script>
