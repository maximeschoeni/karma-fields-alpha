<?php



Class Karma_Fields_Alpha {

	public $version = '40';

	public $middlewares = array();
	public $drivers = array();
	public $keys = array();


	public $menu_items = array();
	// public $tables = array();
	public $resource = array();


	/**
	 *	constructor
	 */
	public function __construct() {

		require KARMA_FIELDS_ALPHA_PATH . '/class-posts.php';
		require KARMA_FIELDS_ALPHA_PATH . '/class-medias.php';
		require KARMA_FIELDS_ALPHA_PATH . '/class-postmeta.php';

		add_action('init', array($this, 'init'));


		// -> fix bug: https://core.trac.wordpress.org/ticket/54568
		add_action('admin_init', function() {
			remove_action( 'admin_head', 'wp_admin_canonical_url' );
		});



		add_action('rest_api_init', array($this, 'rest_api_init'));

		if (is_admin()) {

			add_action('admin_enqueue_scripts', array($this, 'enqueue_styles'));

			// add_action('karma_field_print_grid', array($this, 'print_grid_compat'));
			// add_action('karma_fields_print_field', array($this, 'print_field_compat'), 10, 2);

			// add_action('karma_fields_alpha', array($this, 'print_field'));

			add_action('karma_fields_post_field', array($this, 'print_post_field'), 10, 2);
			// add_action('karma_fields_option_field', array($this, 'print_option_field'));


			add_action('admin_head', array($this, 'print_footer'));

			add_action('adminmenu', array($this, 'adminmenu'));
			add_action('admin_footer', array($this, 'print_nav'));


			// -> prevent wp_admin_canonical_url() to delete history state... Dunno if theres side effects!
			// add_filter('removable_query_args', function() {
			// 	return array();
			// });


    // Function to be called on plugin initialisation


		}


	}


		/**
		 * Hook for 'admin_enqueue_scripts'
		 */
		public function enqueue_styles() {

			$plugin_url = trim(plugin_dir_url(__FILE__), '/');

			wp_dequeue_script('wp-emoji-release'); // wp-emoji-release.min.js?ver=6.0

			// wp_enqueue_style('karma-styles-date-field', $plugin_url . '/css/date-field.css', array(), $this->version);
			// wp_enqueue_style('multimedia-styles', $plugin_url . '/css/multimedia.css', array(), $this->version);
			// wp_enqueue_style('karma-styles-alpha-grid', $plugin_url . '/css/grid.css', array(), $this->version);
			// wp_enqueue_style('karma-styles-alpha-array', $plugin_url . '/css/array.css', array(), $this->version);
			// wp_enqueue_style('karma-styles-alpha-toolbar', $plugin_url . '/css/toolbar.css', array(), $this->version);
			// wp_enqueue_style('karma-styles-alpha-input', $plugin_url . '/css/input.css', array(), $this->version);
			// wp_enqueue_style('karma-styles-alpha-dropdown', $plugin_url . '/css/dropdown.css', array(), $this->version);
			// wp_enqueue_style('karma-styles-alpha-submit', $plugin_url . '/css/submit.css', array(), $this->version);
			// wp_enqueue_style('karma-fields-alpha-checkbox', $plugin_url . '/css/checkbox.css', array(), $this->version);
			// wp_enqueue_style('karma-fields-alpha-modal', $plugin_url . '/css/modal.css', array(), $this->version);
			//
			// wp_enqueue_style('karma-fields-alpha-tinymce', $plugin_url . '/css/tinymce.css', array(), $this->version);
			//
			// wp_enqueue_style('karma-fields-alpha-navigation', $plugin_url . '/css/navigation.css', array(), $this->version);

			wp_enqueue_style('karma-fields-alpha-styles', $plugin_url . '/css/karma-fields.css', array(), $this->version);

			wp_enqueue_media();


			// var_dump($plugin_path.'/js/all.min.js', file_exists($plugin_path));
			// die('asdf');

			if (false && file_exists($plugin_path.'/js/all.min.js')) {

				// wp_enqueue_script('karma-fields', $plugin_url . '/js/media.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-alpha', $plugin_url . '/js/all.js', array('karma-fields'), $this->version, true);

			} else {



				wp_enqueue_script('karma-fields-alpha-media', $plugin_url . '/js/media.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-build', $plugin_url . '/js/build-v7.7.js', array('karma-fields-alpha-media'), $this->version, true);

				// fields
				wp_enqueue_script('karma-fields-alpha-field', $plugin_url . '/js/fields/field.js', array('karma-fields-alpha-build'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-group', $plugin_url . '/js/fields/group.js', array('karma-fields-alpha-field'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-form', $plugin_url . '/js/fields/form.js', array('karma-fields-alpha-group'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-input', $plugin_url . '/js/fields/input.js', array('karma-fields-alpha-field'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-date', $plugin_url . '/js/fields/date.js', array('karma-fields-alpha-input', 'moment'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-file', $plugin_url . '/js/fields/file.js', array('karma-fields-alpha-field'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-files', $plugin_url . '/js/fields/files.js', array('karma-fields-alpha-field'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-dropdown', $plugin_url . '/js/fields/dropdown.js', array('karma-fields-alpha-input'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-checkboxes', $plugin_url . '/js/fields/checkboxes.js', array('karma-fields-alpha-field'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-checkbox', $plugin_url . '/js/fields/checkbox.js', array('karma-fields-alpha-input'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-textarea', $plugin_url . '/js/fields/textarea.js', array('karma-fields-alpha-input'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-editor', $plugin_url . '/js/fields/editor.js', array('karma-fields-alpha-field'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-text', $plugin_url . '/js/fields/text.js', array('karma-fields-alpha-field'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-button', $plugin_url . '/js/fields/button.js', array('karma-fields-alpha-text'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-submit', $plugin_url . '/js/fields/submit.js', array('karma-fields-alpha-button'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-array', $plugin_url . '/js/fields/array.js', array('karma-fields-alpha-field'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-link', $plugin_url . '/js/fields/link.js', array('karma-fields-alpha-text'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-modal', $plugin_url . '/js/fields/modal.js', array('karma-fields-alpha-link'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-gateway', $plugin_url . '/js/fields/gateway.js', array('karma-fields-alpha-group'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-separator', $plugin_url . '/js/fields/separator.js', array('karma-fields-alpha-field'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-breadcrumb', $plugin_url . '/js/fields/breadcrumb.js', array('karma-fields-alpha-field'), $this->version, true);


				// beta
				wp_enqueue_script('karma-fields-alpha-tinymce', $plugin_url . '/js/fields/tinymce.js', array('karma-fields-alpha-input'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-gallery', $plugin_url . '/js/fields/gallery.js', array('karma-fields-alpha-field'), $this->version, true);

				// table
				wp_enqueue_script('karma-fields-alpha-table', $plugin_url . '/js/fields/table.js', array('karma-fields-alpha-field'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-table-grid', $plugin_url . '/js/fields/table-grid.js', array('karma-fields-alpha-table'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-table-medias', $plugin_url . '/js/fields/table-medias.js', array('karma-fields-alpha-table'), $this->version, true);

				// wp_enqueue_script('karma-fields-alpha-table-gateway', $plugin_url . '/js/fields/table-gateway.js', array('karma-fields-alpha-gateway'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-table-grid', $plugin_url . '/js/fields/table-grid.js', array('karma-fields-alpha-form-history'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-table-options', $plugin_url . '/js/fields/table-options.js', array('karma-fields-alpha-text'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-table-row', $plugin_url . '/js/fields/table-row.js', array('karma-fields-alpha-text'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-tables', $plugin_url . '/js/fields/tables.js', array(
					'karma-fields-alpha-field'
					// 'karma-fields-alpha-table',
					// 'karma-fields-alpha-table-content',
					// 'karma-fields-alpha-table-grid',
					// 'karma-fields-alpha-table-options',
					// 'karma-fields-alpha-table-row'
				), $this->version, true);

				// presets
				// wp_enqueue_script('karma-fields-alpha-field-presets', $plugin_url . '/js/fields/presets.js', array(), $this->version, true);


				// utils
				wp_enqueue_script('karma-fields-utils-deep-object', $plugin_url . '/js/utils/deep-object.js', array(), $this->version, true);
				// wp_enqueue_script('karma-fields-utils-deep-object-async', $plugin_url . '/js/utils/deep-object-async.js', array('karma-fields-utils-deep-object'), $this->version, true);
				wp_enqueue_script('karma-fields-utils-nav', $plugin_url . '/js/utils/nav.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-gateway', $plugin_url . '/js/utils/gateway.js', array(), $this->version, true);
				// wp_enqueue_script('karma-fields-utils-grid', $plugin_url . '/js/utils/grid.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-rect', $plugin_url . '/js/utils/rect.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-segment', $plugin_url . '/js/utils/segment.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-buffer', $plugin_url . '/js/utils/buffer.js', array('karma-fields-utils-deep-object'), $this->version, true);

				wp_enqueue_script('karma-fields-utils-local-storage', $plugin_url . '/js/utils/local-storage.js', array('karma-fields-utils-deep-object'), $this->version, true);
				wp_enqueue_script('karma-fields-utils-session-storage', $plugin_url . '/js/utils/session-storage.js', array('karma-fields-utils-deep-object'), $this->version, true);
				// wp_enqueue_script('karma-fields-utils-event', $plugin_url . '/js/utils/event.js', array(), $this->version, true);
				// wp_enqueue_script('karma-fields-utils-resource', $plugin_url . '/js/utils/resource.js', array(), $this->version, true);
				// wp_enqueue_script('karma-fields-utils-params', $plugin_url . '/js/utils/params.js', array(), $this->version, true);
				// wp_enqueue_script('karma-fields-utils-query', $plugin_url . '/js/utils/query.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-expression', $plugin_url . '/js/utils/expression.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-type', $plugin_url . '/js/utils/type.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-history', $plugin_url . '/js/utils/history.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-store', $plugin_url . '/js/utils/store.js', array(), $this->version, true);
				// wp_enqueue_script('karma-fields-utils-deepmap', $plugin_url . '/js/utils/deepmap.js', array(), $this->version, true);
				// wp_enqueue_script('karma-fields-utils-buffermap', $plugin_url . '/js/utils/buffermap.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-selection', $plugin_url . '/js/utils/selection.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-cell-selection', $plugin_url . '/js/utils/cell-selection.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-sorter', $plugin_url . '/js/utils/sorter.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-clipboard', $plugin_url . '/js/utils/clipboard.js', array(), $this->version, true);


				// external dependancies
				wp_enqueue_script('papaparse', $plugin_url . '/js/vendor/papaparse.min.js', array(), $this->version, true);


				wp_enqueue_script('karma-fields-alpha', $plugin_url . '/js/noop.js', array(
					'karma-fields-alpha-field',
					'karma-fields-alpha-date',
					'karma-fields-alpha-dropdown',
					'karma-fields-alpha-checkboxes',
					'karma-fields-alpha-textarea',
					'karma-fields-alpha-tinymce',
					'karma-fields-alpha-submit',
					'karma-fields-alpha-array',
					'karma-fields-alpha-tables',
					'karma-fields-alpha-table',
					'karma-fields-utils-buffer',
					'karma-fields-utils-local-storage',
					'karma-fields-utils-session-storage',
					'karma-fields-utils-nav',
					'karma-fields-utils-gateway'
				), $this->version, true);

			}

		}

		/**
		 * @hook admin_header
		 */
		public function print_footer() {
			// global $karma_cache;

			$karma_fields = array(
				// 'ajax_url' => admin_url('admin-ajax.php'),
				'icons_url' => plugin_dir_url(__FILE__).'dashicons',
				'restURL' => rest_url().'karma-fields-alpha/v1',
				// 'getURL' => rest_url().'karma-fields/v1/get',
				// 'getURL' => apply_filters('karma_cache_url', rest_url().'karma-fields/v1/get'), // -> apply_filters('karma_fields_get')
				'cacheURL' => apply_filters('karma_cache_url', false),
				// 'queryURL' => rest_url().'karma-fields/v1/query',
				// 'saveURL' => rest_url().'karma-fields/v1/update',
				// 'fetchURL' => rest_url().'karma-fields/v1/fetch',
				// 'defaultURL' => rest_url().'karma-fields/v1/default'


				// 'addURL' => rest_url().'karma-fields/v1/add',
				// 'removeURL' => rest_url().'karma-fields/v1/remove'
				// 'queryTermsURL' => rest_url().'karma-fields/v1/taxonomy',
				// 'user_edit' => home_url('wp-content/karma-fields/users/'.get_current_user_id().'.json'),
				'nonce' => wp_create_nonce( 'wp_rest' ),
				'locale' => str_replace('_', '-', get_locale())
			);


			// if (isset($karma_cache)) {
			//
			// 	$karma_fields['getPostURL'] = home_url().'/'.$karma_cache->path;
			//
			// }

			echo '<script>KarmaFieldsAlpha = '.json_encode($karma_fields).';</script>';

			// foreach ($drivers as $driver) {
			//
			// }

		}

	/**
	 * @hook init
	 */
	public function init() {

		do_action('karma_fields_init', $this);

		$this->register_driver(
			'posts',
			KARMA_FIELDS_ALPHA_PATH.'/drivers/driver-posts.php',
			'Karma_Fields_Alpha_Driver_Posts'
		);

		$this->register_driver(
			'postmeta',
			KARMA_FIELDS_ALPHA_PATH.'/drivers/driver-postmeta.php',
			'Karma_Fields_Alpha_Driver_Postmeta'
		);

		$this->register_driver(
			'postdate',
			KARMA_FIELDS_ALPHA_PATH.'/drivers/driver-postdate.php',
			'Karma_Fields_Alpha_Driver_Postdate'
		);

		$this->register_driver(
			'postcontent',
			KARMA_FIELDS_ALPHA_PATH.'/drivers/driver-postcontent.php',
			'Karma_Fields_Alpha_Driver_Postcontent'
		);

		$this->register_driver(
			'taxonomy',
			KARMA_FIELDS_ALPHA_PATH.'/drivers/driver-taxonomy.php',
			'Karma_Fields_Alpha_Driver_Taxonomy'
		);

		$this->register_driver(
			'termmeta',
			KARMA_FIELDS_ALPHA_PATH.'/drivers/driver-termmeta.php',
			'Karma_Fields_Alpha_Driver_Termmeta'
		);

		// $this->register_driver(
		// 	'attachment',
		// 	KARMA_FIELDS_ALPHA_PATH.'/drivers/driver-attachment.php',
		// 	'Karma_Fields_Alpha_Driver_Attachment'
		// );

		$this->register_driver(
			'options',
			KARMA_FIELDS_ALPHA_PATH.'/drivers/driver-options.php',
			'Karma_Fields_Alpha_Driver_Options'
		);

		// $this->register_driver(
		// 	'postmeta',
		// 	KARMA_FIELDS_PATH.'/drivers/driver-postmeta.php',
		// 	'Karma_Fields_Driver_Postmeta'
		// );
		// $this->register_driver(
		// 	'postmetaobject',
		// 	KARMA_FIELDS_PATH.'/drivers/driver-postmeta-object.php',
		// 	'Karma_Fields_Driver_Postmeta_Object'
		// );
		// $this->register_driver(
		// 	'postmetafile',
		// 	KARMA_FIELDS_PATH.'/drivers/driver-postmeta-file.php',
		// 	'Karma_Fields_Driver_Postmeta_File'
		// );
		// $this->register_driver(
		// 	'postmetafiles',
		// 	KARMA_FIELDS_PATH.'/drivers/driver-postmeta-files.php',
		// 	'Karma_Fields_Driver_Postmeta_Files'
		// );
		// $this->register_driver(
		// 	'taxonomy',
		// 	KARMA_FIELDS_PATH.'/drivers/driver-taxonomy.php',
		// 	'Karma_Fields_Driver_Taxonomy'
		// );

		add_action('save_post', array($this, 'save'), 10, 3);

	}

	/**
	 * Save meta boxes
	 *
	 * @hook 'save_post'
	 */
	public function save($post_id, $post, $update) {



		if (current_user_can('edit_post', $post_id) && (!defined( 'DOING_AUTOSAVE' ) || !DOING_AUTOSAVE )) {

			$action = "karma_field-action";
			$nonce = "karma_field-nonce";

			if (isset($_REQUEST[$nonce]) && wp_verify_nonce($_POST[$nonce], $action)) {

				if (isset($_REQUEST['karma-fields-items']) && $_REQUEST['karma-fields-items']) {

					foreach ($_REQUEST['karma-fields-items'] as $encoded_input) {

						if ($encoded_input) {

							$encoded_input = stripslashes($encoded_input);
							$input = json_decode($encoded_input, false);

							if ($input) {

								// foreach ($input as $driver_name => $data) {
								//
								// 	$driver = $this->get_driver($driver_name);
								//
								// 	// -> should verify permissions here
								//
								// 	if (method_exists($driver, 'update')) {
								//
								// 		$driver->update($data);
								//
								// 	}
								//
								// }

								// echo '<pre>';
								// var_dump($input);
								// die();

								$driver = $this->get_driver('posts');

								// -> should verify permissions here

								if (method_exists($driver, 'update')) {

									$driver->update(array(
										$post_id => $input
									));

								}


							}

						}

					}

				}

			}

		}

	}


	/**
	 *	@hook 'rest_api_init'
	 */
	public function rest_api_init() {

		// register_rest_route('karma-fields-alpha/v1', '/get/(?P<driver>[^/]+)/(?P<path>.+)', array(
		// 	'methods' => 'GET',
		// 	'callback' => array($this, 'rest_get'),
		// 	'permission_callback' => '__return_true',
		// 	'args' => array(
		// 		'driver' => array(
		// 			'required' => true
		// 		),
		// 		'path' => array(
		// 			'required' => true
		// 		)
	  //   )
		// ));

		register_rest_route('karma-fields-alpha/v1', '/update/(?P<driver>[^/]+)', array(
			'methods' => 'POST',
			'callback' => array($this, 'rest_update'),
			'permission_callback' => '__return_true',
			'args' => array(
				'driver' => array(
					'required' => true
				),
				'data' => array(
					'required' => true
				)
	    )
		));

		register_rest_route('karma-fields-alpha/v1', '/add/(?P<driver>[^/]+)/?', array(
			'methods' => 'POST',
			'callback' => array($this, 'rest_add'),
			'permission_callback' => '__return_true',
			'args' => array(
				'driver' => array(
					'required' => true
				)
	    )
		));

		// register_rest_route('karma-fields-alpha/v1', '/fetch/(?P<driver>[^/]+)', array(
		// 	'methods' => 'GET',
		// 	'callback' => array($this, 'rest_fetch'),
		// 	'permission_callback' => '__return_true',
		// 	'args' => array(
		// 		'driver' => array(
		// 			'required' => true
		// 		)
	  //   )
		// ));

		register_rest_route('karma-fields-alpha/v1', '/query/(?P<driver>[^/?]+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_query'),
			'permission_callback' => '__return_true',
			'args' => array(
				'driver' => array(
					'required' => true
				)
	    )
		));

		// register_rest_route('karma-fields-alpha/v1', '/relations/(?P<driver>[^/?]+)', array(
		// 	'methods' => 'GET',
		// 	'callback' => array($this, 'rest_relations'),
		// 	'permission_callback' => '__return_true',
		// 	'args' => array(
		// 		'driver' => array(
		// 			'required' => true
		// 		),
		// 		'ids' => array(
		// 			'required' => true
		// 		)
	  //   )
		// ));

		register_rest_route('karma-fields-alpha/v1', '/count/(?P<driver>[^/?]+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_count'),
			'permission_callback' => '__return_true',
			'args' => array(
				'driver' => array(
					'required' => true
				)
	    )
		));

		register_rest_route('karma-fields-alpha/v1', '/join/(?P<driver>[^/?]+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_join'),
			'permission_callback' => '__return_true',
			'args' => array(
				'driver' => array(
					'required' => true
				),
				'ids' => array(
					'required' => true
				)
	    )
		));

		register_rest_route('karma-fields-alpha/v1', '/upload/?', array(
			'methods' => 'POST',
			'callback' => array($this, 'rest_upload'),
			'permission_callback' => '__return_true'
		));



	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/query/[driver]'
	 */
	public function rest_query($request) {

		$driver_name = $request->get_param('driver');
		$params = $request->get_params();

		$driver = $this->get_driver($driver_name);

		if ($driver) {

			if (method_exists($driver, 'query')) {

				return $driver->query($params);

			} else {

				return "karma fields error: driver has no method 'query'";

			}

		} else {

			return "karma fields error: driver not found";

		}

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/count/[driver]'
	 */
	public function rest_count($request) {

		$driver_name = $request->get_param('driver');
		$params = $request->get_params();

		$driver = $this->get_driver($driver_name);

		if ($driver) {

			if (method_exists($driver, 'count')) {

				return $driver->count($params);

			} else {

				return "karma fields error: driver has no method 'count'";

			}

		} else {

			return "karma fields error: driver not found";

		}

	}


	// /**
	//  *	@rest 'wp-json/karma-fields/v1/filter/[object]/[filter]'
	//  */
	// public function rest_fetch($request) {
	//
	// 	$driver_name = $request->get_param('driver');
	//
	// 	$params = $request->get_params();
	//
	// 	$driver = $this->get_driver($driver_name);
	//
	// 	if ($driver) {
	//
	// 		if (method_exists($driver, 'fetch')) {
	//
	// 			return $driver->fetch($params, $params); // -> compat
	//
	// 		} else {
	//
	// 			return "karma fields error: driver has no method 'fetch'";
	//
	// 		}
	//
	// 	} else {
	//
	// 		return "karma fields error: driver not found";
	//
	// 	}
	//
	// }

	// /**
	//  *	@rest 'wp-json/karma-fields/v1/get/'
	//  */
	// public function rest_get($request) {
	//
	// 	$driver_name = $request->get_param('driver');
	// 	$path = $request->get_param('path');
	//
	// 	$driver = $this->get_driver($driver_name);
	//
	// 	if ($driver) {
	//
	// 		if (method_exists($driver, 'get')) {
	//
	// 			return $driver->get($path);
	//
	// 		} else {
	//
	// 			return "karma fields error: driver has no method 'get'";
	//
	// 		}
	//
	// 	} else {
	//
	// 		return "karma fields error: driver not found";
	//
	// 	}
	//
	// }


	/**
	 *	@rest 'wp-json/karma-fields/v1/update/{middleware}'
	 */
	public function rest_update($request) {

		$driver_name = $request->get_param('driver');
		$data = $request->get_param('data');
		$driver = $this->get_driver($driver_name);

		if ($driver) {

			if (method_exists($driver, 'update')) {

				return $driver->update($data);

			} else {

				return "karma fields error: driver ($driver_name) has no method 'update'";

			}

		} else {

			return "karma fields error: driver not found";

		}

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/add/{driver}'
	 */
	public function rest_add($request) {

		$driver_name = $request->get_param('driver');
		$data = $request->get_param('data');
		// $num = $request->has_param('num') ? $request->get_param('num') : 1;
		$driver = $this->get_driver($driver_name);

		if (method_exists($driver, 'add')) {

			return $driver->add($data, $request->get_param('num'));

		} else {

			return "karma fields error: driver has no method 'add'";

		}

	}

	// /**
	//  *	@rest 'wp-json/karma-fields/v1/relations/{driver}?ids={ids}'
	//  */
	// public function rest_relations($request) {
	//
	// 	$driver_name = $request->get_param('driver');
	//
	// 	$params = $request->get_params();
	//
	// 	$driver = $this->get_driver($driver_name);
	//
	// 	if (method_exists($driver, 'relations')) {
	//
	// 		return $driver->relations($params);
	//
	// 	}
	//
	// 	return array();
	//
	// }

	/**
	 *	@rest 'wp-json/karma-fields/v1/join/{driver}?ids={ids}'
	 */
	public function rest_join($request) {

		$driver_name = $request->get_param('driver');

		$params = $request->get_params();
		$ids = $request->get_param('ids');

		$driver = $this->get_driver($driver_name);

		if (method_exists($driver, 'join')) {

			return $driver->join($params, $ids);

		}

		return array();

	}

	/**
	 *	@rest 'wp-json/karma-fields/v1/upload'
	 */
	public function rest_upload($request) {

		// $driver_name = $request->get_param('driver');
		$driver_name = 'files';

		$driver = $this->get_driver($driver_name);

		if (method_exists($driver, 'upload')) {

			return $driver->upload($request);

		} else {

			return "karma fields error: driver has no method 'upload'";

		}

	}

	/**
	 *	register_driver
	 */
	public function register_driver($name, $path, $class) {

		$this->drivers[$name] = array(
			'path' => $path,
			'class' => $class
		);

	}

	/**
	 * Find driver by middleware/key
	 */
	public function get_driver($driver_name) {

		if (isset($this->drivers[$driver_name])) {

			require_once $this->drivers[$driver_name]['path'];

			$driver = new $this->drivers[$driver_name]['class'];
			$driver->name = $driver_name;

			return $driver;

		}

	}


	/**
	 *	@hook karma_fields_alpha
	 */
	// public function print_field($args) {
	// 	static $index = 0;
	//
	// 	$index++;
	//
	// 	// if (empty($args['type']) || $args['type'] !== 'form') {
	// 	//
	// 	// 	trigger_error('Root field must be of type "form"');
	// 	//
	// 	// }
	//
	// 	include plugin_dir_path(__FILE__) . 'includes/field.php';
	//
	// }

	/**
	 *	@hook karma_fields_post_field
	 */
	public function print_post_field($post_id, $args) {
		static $index = 0;

		$index++;

		include plugin_dir_path(__FILE__) . 'includes/post-field.php';

	}

	/**
	 *	@hook karma_fields_option_field
	 */
	// public function print_option_field($args) {
	// 	static $index = 0;
	//
	// 	$index++;
	//
	// 	include plugin_dir_path(__FILE__) . 'includes/option-field.php';
	//
	// }

	// /**
	//  *	parse_object
	//  */
	// public function parse_param($path, $value, &$results) {
	//
	// 	$key = array_shift($path);
	//
	// 	if (count($path)) {
	//
	// 		if (empty($results[$key])) {
	//
	// 			$results[$key] = array();
	//
	// 		}
	//
	// 		$this->parse_param($path, $value, $results[$key]);
	//
	// 	} else {
	//
	// 		$results[$key] = $value;
	//
	// 	}
	//
	// }
	//
	// /**
	//  *	parse_object
	//  */
	// public function parse_query_object($object) {
	//
	// 	$results = array();
	//
	// 	foreach ($object as $key => $value) {
	//
	// 		$path = explode('/', $key);
	//
	// 		$this->parse_param($path, $value, $results);
	//
	// 	}
	//
	// 	return $results;
	// }
	//




	/**
	 *	register_menu_item()
	 */
	public function register_menu_item($name, $url_search) {

		$this->menu_items[$name] = $url_search;

	}

	/**
	 *	register_table()
	 */
	public function register_table($resource) {

		$this->resource['tables'][] = $resource;

	}

	/**
	 *	register_navigation()
	 */
	public function register_navigation($resource) {

		$this->resource['navigation'] = $resource;

	}

	/**
	 * @hook 'adminmenu'
	 */
	public function adminmenu() {

		include plugin_dir_path(__FILE__) . 'includes/menu.php';

	}

	/**
	 * @hook 'print_footer'
	 */
	public function print_nav() {

		include plugin_dir_path(__FILE__) . 'includes/nav.php';

	}


}

global $karma_fields;
$karma_fields = new Karma_Fields_Alpha;




add_action( 'admin_print_footer_scripts', function() {
	if ( ! class_exists( '_WP_Editors', false ) ) {
	    require( ABSPATH . WPINC . '/class-wp-editor.php' );
	}
	_WP_Editors::print_default_editor_scripts();
} );


add_action('admin_init', function() {
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
});
