<div id="karma-fields-table-<?php echo $index; ?>-container" class="karma-fields"></div>
<script>
	document.addEventListener("DOMContentLoaded", function() {
		let container = document.getElementById("karma-fields-table-<?php echo $index; ?>-container");
		let resource = <?php echo json_encode($args); ?>;
		let field = KarmaFieldsAlpha.Field(resource);

		window.table = field;

		KarmaFieldsAlpha.build(KarmaFieldsAlpha.fields[resource.type](field), container);
	});
</script>
