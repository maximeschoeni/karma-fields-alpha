<style></style>

<div id="karma-fields-embed-<?php echo $index; ?>" class="karma-fields"></div>

<script>

	KarmaFieldsAlpha.embeds.push({
		driver: "<?php echo $driver; ?>",
		id: "<?php echo $id; ?>",
		...<?php echo json_encode($args); ?>,
	  type: "form",
		index: "karma-fields-embed-<?php echo $index; ?>"
	});

</script>
