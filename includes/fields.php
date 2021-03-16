<div id="karma-fields-field-<?php echo $index; ?>-container" class="karma-fields"></div>
<input type="hidden" name="karma-fields-items[]" id="karma-fields-input-<?php echo $index; ?>">

<?php
	$action = "karma_field-action";
	$nonce = "karma_field-nonce";

	wp_nonce_field($action, $nonce, false, true);
 ?>
<script>
	document.addEventListener("DOMContentLoaded", function() {
		var container = document.getElementById("karma-fields-field-<?php echo $index; ?>-container");
		var input = document.getElementById("karma-fields-input-<?php echo $index; ?>");
		var resource = <?php echo json_encode($args); ?>;
		var id = <?php echo $id; ?>;
		var history = KarmaFields.History.createInstance();

		window.fieldHistory = history; // -> for debug

		var fieldManager = history.createFieldManager(resource);
		fieldManager.buffer = "input";
		fieldManager.outputBuffer = "output";
		fieldManager.uri = id;
		fieldManager.events.update = function() {
			var output = history.getValue(["output"]);
			input.value = JSON.stringify(output);
		};

		var fieldNode = KarmaFields.build({
			children: fieldManager.build()
		}, container);
		container.addEventListener("focusin", function() {
			KarmaFields.events.onUndo = function(event) {
				history.undo();
				fieldNode.render();
				event.preventDefault();
			}
			KarmaFields.events.onRedo = function(event) {
				history.redo();
				event.preventDefault();
			}
		});

	});
</script>
