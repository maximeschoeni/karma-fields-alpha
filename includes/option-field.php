<div id="karma-fields-option-field-<?php echo $this->index; ?>-container" class="karma-fields karma-fields-option"></div>

<?php
	$action = "karma_field-action";
	$nonce = "karma_field-nonce";

	wp_nonce_field($action, $nonce, false, true);
?>
<style>
  .karma-fields .array .td.selected,
  .karma-fields .array .td.selecting,
  .karma-fields .array .td.selected .td,
  .karma-fields .array .td.selecting .td,
  .karma-fields .array .td.selected .th,
  .karma-fields .array .td.selecting .th {
    background-color: #f0f0f1;
  }
  .karma-field-group {
    min-width: 0;
  }
  .karma-tinymce .editor-header .toolbar {
    top: 3em;
  }
</style>
<script>
	document.addEventListener("DOMContentLoaded", function() {
		const container = document.getElementById("karma-fields-option-field-<?php echo $this->index; ?>-container");
		const resource = <?php echo json_encode($args); ?>;
		const index = <?php echo $this->index; ?>;

    const postform = new KarmaFieldsAlpha.field.postform({
    	driver: "options",
      ...resource,
      index: index,
      type: "postform"
    });

		KarmaFieldsAlpha.build(postform.build(), container);
	});
</script>
