<div id="karma-fields-post-<?php echo $post_id; ?>-field-<?php echo $index; ?>-container" class="karma-fields"></div>
<input type="hidden" name="karma-fields-items[]" id="karma-fields-post-<?php echo $post_id; ?>-input-<?php echo $index; ?>">

<?php
	$action = "karma_field-action";
	$nonce = "karma_field-nonce";

	wp_nonce_field($action, $nonce, false, true);
 ?>
<script>
	document.addEventListener("DOMContentLoaded", function() {
		let container = document.getElementById("karma-fields-post-<?php echo $post_id; ?>-field-<?php echo $index; ?>-container");
		let input = document.getElementById("karma-fields-post-<?php echo $post_id; ?>-input-<?php echo $index; ?>");
		let resource = <?php echo json_encode($args); ?>;
		let id = <?php echo $post_id; ?>;


		// let field = new KarmaFieldsAlpha.fields.form({
		// 	type: "form",
		// 	key: id,
		// 	driver: "posts",
		// 	children: [resource]
		// });
		let field = new KarmaFieldsAlpha.fields.form({
			type: "form",
			driver: "posts",
			children: [
				{
					type: "group",
					key: id,
					children: [resource]
				}
			]
		});

		// input.form.addEventListener("submit", function() {
		// 	field.getDeltaPathes().forEach(path => {
		// 		localStorage.removeItem(path);
		// 	});
		// });

		window.karma_field = field; // -> debug

		// override form output event
		// field.events.change = function(currentField) {
		//
		// 	// let values = {};
		// 	// values[field.resource.driver] = {};
		// 	// values[field.resource.driver][id] = field.getModifiedValue() || {};
		//
		// 	let values = {};
		// 	values[field.resource.driver] = field.getModifiedValue() || {};
		//
		// 	input.value = JSON.stringify(values);
		// }

		// field.edit = function() {
		// 	let values = {};
		// 	values[field.resource.driver] = field.getModifiedValue() || {};
		// 	input.value = JSON.stringify(values);
		// }

		field.getDeltaValue = function(path) {
			const delta = this.getDeltaObject();
			return delta[path];
		}
		field.setDeltaValue = function(value, path) {
			const delta = this.getDeltaObject();
			if (this.original[path] !== value && value !== undefined) {
				delta[path] = value;
			} else {
				delete delta[path];
			}
			this.setDeltaObject(delta);
		}
		field.removeDeltaValue = function(path) {
			this.setDeltaValue(undefined, path);
		}
		field.getDeltaObject = function() {
			if (!this.deltaCache) {
				const deepObject = JSON.parse(input.value || "{}");
				const flatObject = KarmaFieldsAlpha.FlatObject.fromDeep(deepObject);
				this.deltaCache = this.sanitizeObject(flatObject);
			}
			return this.deltaCache;
		}
		field.setDeltaObject = function(flatObject) {
			flatObject = this.parseObject(flatObject);
			const deepObject = KarmaFieldsAlpha.FlatObject.toDeep(flatObject);
			input.value = JSON.stringify(deepObject);
			this.deltaCache = null;
		}
		field.emptyDelta = function() {
			input.value = "";
		}
		field.hasDelta = function() {
			// not sure if actually used...
			const delta = this.getDeltaObject();
			return Object.values(delta).length > 0;
		}


		KarmaFieldsAlpha.build({
			child: field.build(),
		}, container);
	});
</script>
