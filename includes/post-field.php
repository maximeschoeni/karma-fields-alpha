<div id="karma-fields-post-<?php echo $post_id; ?>-field-<?php echo $index; ?>-container" class="karma-fields karma-fields-post"></div>
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


		window.karma_field = field; // -> debug

		// field.buffer = {
		// 	get: function(path) {
		// 		const delta = this.getObject();
		// 		const value = KarmaFieldsAlpha.DeepObject.get(delta, path.split("/"));
		// 		return KarmaFieldsAlpha.Type.sanitize(value, path);
		// 	},
		// 	set: function(path, value) {
		// 		const delta = this.getObject();
		// 		value = KarmaFieldsAlpha.Type.parse(value, path);
		// 		KarmaFieldsAlpha.DeepObject.assign(delta, path.split("/"), value);
		// 		this.setObject(delta);
		// 	},
		// 	removeValue: function(path) {
		// 		this.set(path);
		// 	},
		// 	getObject: function() {
		// 		return JSON.parse(input.value || "{}");
		// 	},
		// 	setObject: function(deepObject) {
		// 		input.value = JSON.stringify(deepObject);
		// 	},
		// 	getEntries: function() {
		// 		const deepObject = this.getObject();
		// 		let flatObject = KarmaFieldsAlpha.FlatObject.fromDeep(deepObject);
		// 		flatObject = KarmaFieldsAlpha.Type.sanitizeObject(flatObject);
		// 		return flatObject;
		// 	}
		// 	empty: function() {
		// 		input.value = "";
		// 	},
		// 	hasEntry: function() {
		// 		return Object.values(this.getObject()).length > 0;
		// 	}
		// };
		//
		// field.getBuffer = function() {
		// 	return this.buffer;
		// }

		// field.getDelta = function() {
		// 	let delta = JSON.parse(input.value || "{}");
		// 	delta = KarmaFieldsAlpha.Type.sanitizeObject(delta, "posts");
		// 	return delta;
		// }
		// field.setDelta = function(delta) {
		// 	delta = KarmaFieldsAlpha.Type.parseObject(delta, "posts");
		// 	input.value = JSON.stringify(delta);
		// }


		field.delta = {
			getObject: function() {
				let delta = JSON.parse(input.value || "{}");
				delta = KarmaFieldsAlpha.Type.sanitizeObject(delta);
				return delta;
			},
			setObject: function(delta) {
				delta = KarmaFieldsAlpha.Type.parseObject(delta);
				input.value = JSON.stringify(delta);
			},
			get: function(...path) {
				// let delta = JSON.parse(input.value || "{}");
				// delta = KarmaFieldsAlpha.Type.sanitizeObject(delta, "posts");
				// return KarmaFieldsAlpha.DeepObject.get3(delta, ...path);

				return KarmaFieldsAlpha.DeepObject.get3(this.getObject(), ...path);
			},
			set: function(value, ...path) {
				// console.log(value, path);
				// console.trace();
				// const delta = this.get();
				// KarmaFieldsAlpha.DeepObject.assign3(delta, value, ...path);
				// delta = KarmaFieldsAlpha.Type.parseObject(delta, "posts");
				// input.value = JSON.stringify(delta);

				const delta = this.getObject();
				KarmaFieldsAlpha.DeepObject.assign3(delta, value, ...path);
				this.setObject(delta);
			},
			remove: function(value, ...path) {
				const delta = this.getObject();
				if (delta) {
					KarmaFieldsAlpha.DeepObject.remove(delta, ...path);
					this.setObject(delta);
				}
			}
		}

		KarmaFieldsAlpha.build({
			child: field.build(),
		}, container);
	});
</script>
