<script>
	const resource = <?php echo json_encode($this->resource) ?>;
	KarmaFieldsAlpha.saucer = new KarmaFieldsAlpha.field.saucer(resource, "saucer");
	KarmaFieldsAlpha.tables = resource.tables || {};
</script>
