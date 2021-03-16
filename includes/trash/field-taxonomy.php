<?php
	if (!is_array($value)) {
		$value = array();
	}
 ?>
<input type="hidden" id="karma_field-<?php echo $meta_key; ?>" name="karma_field-<?php echo $meta_key; ?>">
<input type="hidden" name="karma_field_datatype[<?php echo $meta_key; ?>]" value="json">
<input type="hidden" name="karma_field_taxonomy[<?php echo $meta_key; ?>]" value="<?php echo $args['taxonomy']; ?>">
<div id="karma-field-taxonomy-<?php echo $meta_key; ?>-container"></div>

<script>
	document.addEventListener("DOMContentLoaded", function() {
		var container = document.getElementById("karma-field-taxonomy-<?php echo $meta_key; ?>-container");
		var hiddenInput = document.getElementById("karma_field-<?php echo $meta_key; ?>");
		var options = <?php echo json_encode($args); ?>;
		var values = <?php echo json_encode($value); ?>;
		container.appendChild(
			KarmaFieldMedia.fields.taxonomy(options, values, function(values) {
				hiddenInput.value = JSON.stringify(values);
			})
		);
	});
</script>
