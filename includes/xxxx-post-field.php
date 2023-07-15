<style>
  .karma-fields .array .td.selected,
  .karma-fields .array .td.selecting,
  .karma-fields .array .td.selected .td,
  .karma-fields .array .td.selecting .td,
  .karma-fields .array .td.selected .th,
  .karma-fields .array .td.selecting .th {
    /* background-color: #f0f0f1; */
  }
  .karma-field-group {
    /* min-width: 0; */
  }
  .karma-tinymce .editor-header .toolbar {
    /* top: 3em; */
  }
  .karma-fields-post {
    color: var(--theme-color);
    --border-width: 1px;
    /* --static-text-weight: normal; */

  }


</style>
<div id="karma-fields-container-<?php echo $this->index; ?>" class="karma-fields karma-fields-post"></div>

<?php
	$action = "karma_field-action";
	$nonce = "karma_field-nonce";

	wp_nonce_field($action, $nonce, false, true);
 ?>
<script>

  // addEventListener("DOMContentLoaded", () => {

  	KarmaFieldsAlpha.embeds.push({
  		driver: "posts",
  		id: <?php echo $post_id; ?>,
  		...<?php echo json_encode($args); ?>,
      type: "postform",
  		index: "karma-fields-container-<?php echo $this->index; ?>"
  	});

    // console.log(KarmaFieldsAlpha.Embed.map);

  // });

	// document.addEventListener("karmaFieldsAlpha", function() {

  // addEventListener("DOMContentLoaded", () => {
  //   const index = <?php echo $this->index; ?>;
  //   let container = document.getElementById("karma-fields-container-<?php echo $this->index; ?>");
	// 	let resource = <?php echo json_encode($args); ?>;
	// 	let id = "<?php echo $post_id; ?>";
  //   let driver = "posts";
	//
  //   const postform = new KarmaFieldsAlpha.field.postform({
  //     driver: driver,
  //     id: id,
  //     ...resource,
  //     index: index,
  //     type: "postform",
	// 		uid: index.toString()
  //   });
	//
	// 	KarmaFieldsAlpha.build(postform.build(), container);
	// });
</script>
