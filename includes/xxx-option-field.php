<div id="karma-fields-option-field-<?php echo $this->index; ?>-container" class="karma-fields karma-fields-option"></div>

<?php
	$action = "karma_field-action";
	$nonce = "karma_field-nonce";

	wp_nonce_field($action, $nonce, false, true);
?>
<style>
  /* .karma-fields .array .td.selected,
  .karma-fields .array .td.selected .td,
  .karma-fields .array .td.selected .th {
    background-color: #fff;
  }
  .karma-field-group {
    min-width: 0;
  }
  .karma-tinymce .editor-header .toolbar {
    top: 3em;
  }
	.karma-field-frame {
    align-items: flex-start;
	} */
</style>

<script>

	KarmaFieldsAlpha.embeds.push({
		driver: "options",
		id: <?php echo $option_name; ?>,
		...<?php echo json_encode($args); ?>,
    type: "postform",
		index: "karma-fields-option-field-<?php echo $this->index; ?>-container"
	});

</script>


<?php /*
<script>
	document.addEventListener("DOMContentLoaded", function() {
		const container = document.getElementById("karma-fields-option-field-<?php echo $this->index; ?>-container");
		const resource = <?php echo json_encode($args); ?>;
		const index = <?php echo $this->index; ?>;

    const postform = new KarmaFieldsAlpha.field.postform({
    	driver: "options",
			style: "margin-right: 1em",
      ...resource,
      index: index,
      type: "postform",
			uid: index.toString()
    });

		KarmaFieldsAlpha.build(postform.build(), container);
	});
</script>
*/
