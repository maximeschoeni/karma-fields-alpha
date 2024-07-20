<tr class="form-field">
	<th scope="row"><label for="start"><?php echo $label; ?></label></th>
	<td>
		<?php
			// $this->print_embed('taxonomy', $term_id, $args);

			$this->print_embed_table(array(
				'driver' => 'taxonomy',
				'params' => array(
					'id' => $term_id
				),
			  'type' => "postform",
				'class' => "embed-form",
				'body' => $args
			));
		?>
	</td>
</tr>


<?php /*

<div id="karma-fields-term-<?php echo $term_id; ?>-field-<?php echo $this->index; ?>-container" class="karma-fields karma-fields-term"></div>

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
 		const container = document.getElementById("karma-fields-term-<?php echo $term_id; ?>-field-<?php echo $this->index; ?>-container");
 		const resource = <?php echo json_encode($args); ?>;
 		const index = <?php echo $this->index; ?>;
		const id = "<?php echo $term_id; ?>";

    const postform = new KarmaFieldsAlpha.field.postform({
			driver: "taxonomy",
			id: id,
			...resource,
			index: index,
			type: "postform"
    });

 		KarmaFieldsAlpha.build(postform.build(), container);
 	});
</script>
*/
