<?php



Class Karma_Fields_Alpha {

	public $version = '47';

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
			add_action('karma_fields_term_field', array($this, 'print_term_field'), 10, 2);

			add_action('karma_fields_option_field', array($this, 'print_option_field'));


			add_action('admin_head', array($this, 'print_footer'));

			add_action('adminmenu', array($this, 'adminmenu'));
			add_action('admin_footer', array($this, 'print_nav'));


			add_action('save_post', array($this, 'save'), 10, 3);
			add_action('edit_term', array($this, 'save_term'), 10, 3);


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

			if (false) {

				// wp_enqueue_script('karma-fields', $plugin_url . '/js/media.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-alpha', $plugin_url . '/js/all.js', array('karma-fields'), $this->version, true);

			} else {



				wp_enqueue_script('karma-fields-alpha-media', $plugin_url . '/js/media.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-build', $plugin_url . '/js/build-v7.7.js', array('karma-fields-alpha-media'), $this->version, true);

				// fields
				wp_enqueue_script('karma-fields-alpha-field', $plugin_url . '/js/fields/field.js', array('karma-fields-alpha-build'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-container', $plugin_url . '/js/fields/container.js', array('karma-fields-alpha-field'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-group', $plugin_url . '/js/fields/group.js', array('karma-fields-alpha-container'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-form', $plugin_url . '/js/fields/form.js', array('karma-fields-alpha-container'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-input', $plugin_url . '/js/fields/input.js', array('karma-fields-alpha-field'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-date', $plugin_url . '/js/fields/date.js', array('karma-fields-alpha-input', 'moment'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-dropdown', $plugin_url . '/js/fields/dropdown.js', array('karma-fields-alpha-input'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-dropdown-group', $plugin_url . '/js/fields/dropdown-group.js', array('karma-fields-alpha-dropdown'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-checkboxes', $plugin_url . '/js/fields/checkboxes.js', array('karma-fields-alpha-field'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-checkbox', $plugin_url . '/js/fields/checkbox.js', array('karma-fields-alpha-input'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-textarea', $plugin_url . '/js/fields/textarea.js', array('karma-fields-alpha-input'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-editor', $plugin_url . '/js/fields/editor.js', array('karma-fields-alpha-field'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-text', $plugin_url . '/js/fields/text.js', array('karma-fields-alpha-field'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-button', $plugin_url . '/js/fields/button.js', array('karma-fields-alpha-text'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-submit', $plugin_url . '/js/fields/submit.js', array('karma-fields-alpha-button'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-array', $plugin_url . '/js/fields/array.js', array('karma-fields-alpha-field'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-link', $plugin_url . '/js/fields/link.js', array('karma-fields-alpha-text'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-separator', $plugin_url . '/js/fields/separator.js', array('karma-fields-alpha-field'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-clipboard', $plugin_url . '/js/fields/clipboard.js', array('karma-fields-alpha-field'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-tags', $plugin_url . '/js/fields/tags.js', array('karma-fields-alpha-field'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-tag-links', $plugin_url . '/js/fields/tag-links.js', array('karma-fields-alpha-field'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-gallery', $plugin_url . '/js/fields/gallery.js', array('karma-fields-alpha-field'), $this->version, true);

				// beta
				wp_enqueue_script('karma-fields-alpha-tinymce', $plugin_url . '/js/fields/tinymce.js', array('karma-fields-alpha-input'), $this->version, true);

				// table
				wp_enqueue_script('karma-fields-alpha-layout', $plugin_url . '/js/tables/layout.js', array('karma-fields-alpha-field'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-layout-navigation', $plugin_url . '/js/tables/navigation.js', array('karma-fields-alpha-layout', 'karma-fields-alpha-group'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-layout-controls', $plugin_url . '/js/tables/controls.js', array('karma-fields-alpha-layout', 'karma-fields-alpha-group'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-layout-header', $plugin_url . '/js/tables/header.js', array('karma-fields-alpha-layout', 'karma-fields-alpha-group'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-layout-modal', $plugin_url . '/js/tables/modal.js', array('karma-fields-alpha-layout', 'karma-fields-alpha-group'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-table', $plugin_url . '/js/tables/table.js', array('karma-fields-alpha-layout', 'karma-fields-alpha-form'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-table-row', $plugin_url . '/js/tables/table-row.js', array('karma-fields-alpha-table'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-table-modal', $plugin_url . '/js/tables/table-modal.js', array('karma-fields-alpha-table'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-collection', $plugin_url . '/js/tables/collection.js', array('karma-fields-alpha-table', 'karma-fields-alpha-table-row', 'karma-fields-alpha-table-modal'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-arrangement', $plugin_url . '/js/tables/arrangement.js', array('karma-fields-alpha-collection'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-medias', $plugin_url . '/js/tables/medias.js', array('karma-fields-alpha-collection'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-medias-description', $plugin_url . '/js/tables/medias-description.js', array('karma-fields-alpha-medias'), $this->version, true);
				// wp_enqueue_script('karma-fields-alpha-medias-row', $plugin_url . '/js/tables/medias-row.js', array('karma-fields-alpha-medias', 'karma-fields-alpha-table-row'), $this->version, true);

				// layout fields
				wp_enqueue_script('karma-fields-alpha-directory-dropdown', $plugin_url . '/js/tables/directory-dropdown.js', array('karma-fields-alpha-layout', 'karma-fields-alpha-dropdown'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-breadcrumb', $plugin_url . '/js/tables/breadcrumb.js', array('karma-fields-alpha-directory-dropdown'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-upload', $plugin_url . '/js/tables/upload.js', array('karma-fields-alpha-layout', 'karma-fields-alpha-button'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-changefile', $plugin_url . '/js/tables/changefile.js', array('karma-fields-alpha-upload'), $this->version, true);

				// utils
				wp_enqueue_script('karma-fields-utils-deep-object', $plugin_url . '/js/utils/deep-object.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-nav', $plugin_url . '/js/utils/nav.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-gateway', $plugin_url . '/js/utils/gateway.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-rect', $plugin_url . '/js/utils/rect.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-segment', $plugin_url . '/js/utils/segment.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-buffer', $plugin_url . '/js/utils/buffer.js', array('karma-fields-utils-deep-object'), $this->version, true);
				wp_enqueue_script('karma-fields-utils-params', $plugin_url . '/js/utils/params.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-expression', $plugin_url . '/js/utils/expression.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-type', $plugin_url . '/js/utils/type.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-history', $plugin_url . '/js/utils/history.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-clipboard', $plugin_url . '/js/utils/clipboard.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-selection-manager', $plugin_url . '/js/utils/manager-selection.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-utils-sorter-manager', $plugin_url . '/js/utils/manager-selection-sorter.js', array('karma-fields-utils-selection-manager'), $this->version, true);
				wp_enqueue_script('karma-fields-utils-cells-manager', $plugin_url . '/js/utils/manager-selection-cells.js', array('karma-fields-utils-selection-manager'), $this->version, true);

				wp_enqueue_script('karma-fields-alpha-tracker', $plugin_url . '/js/utils/tracker.js', array(), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-tracker-selector', $plugin_url . '/js/utils/tracker-selector.js', array('karma-fields-alpha-tracker'), $this->version, true);
				wp_enqueue_script('karma-fields-alpha-tracker-sorter', $plugin_url . '/js/utils/tracker-sorter.js', array('karma-fields-alpha-tracker-selector'), $this->version, true);

				wp_enqueue_script('karma-fields-utils-selection', $plugin_url . '/js/utils/selection.js', array('karma-fields-utils-segment', 'karma-fields-utils-buffer'), $this->version, true);
				wp_enqueue_script('karma-fields-utils-tree', $plugin_url . '/js/utils/tree.js', array(), $this->version, true);


				// external dependancies
				wp_enqueue_script('papaparse', $plugin_url . '/js/vendor/papaparse.min.js', array(), $this->version, true);


				wp_enqueue_script('karma-fields-alpha', $plugin_url . '/js/noop.js', array(), $this->version, true);

			}

		}

		/**
		 * @hook admin_header
		 */
		public function print_footer() {
			// global $karma_cache;

			$karma_fields = array(
				// 'ajax_url' => admin_url('admin-ajax.php'),
				// 'icons_url' => plugin_dir_url(__FILE__).'dashicons',
				'restURL' => rest_url().'karma-fields-alpha/v1',
				'uploadURL' => wp_get_upload_dir()['baseurl'],
				// 'getURL' => rest_url().'karma-fields/v1/get',
				// 'getURL' => apply_filters('karma_cache_url', rest_url().'karma-fields/v1/get'), // -> apply_filters('karma_fields_get')
				// 'cacheURL' => apply_filters('karma_cache_url', false),
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



	}

	/**
	 *  Save term meta
   *	@hook edit_term
   */
	public function save_term($term_id, $tt_id, $taxonomy) {

		if (current_user_can('manage_categories')) {

			$action = "karma_field-action";
			$nonce = "karma_field-nonce";

	    if (isset($_REQUEST[$nonce]) && wp_verify_nonce($_POST[$nonce], $action)) {

				if (isset($_REQUEST['karma-fields-items']) && $_REQUEST['karma-fields-items']) {

					foreach ($_REQUEST['karma-fields-items'] as $encoded_input) {

						if ($encoded_input) {

							$encoded_input = stripslashes($encoded_input);
							$input = json_decode($encoded_input, false);

							if ($input) {

								$driver = $this->get_driver('taxonomy');

								if (method_exists($driver, 'update')) {

									$driver->update($input, $term_id);

								}

							}

						}

					}

				}

			}

		}

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

							// var_dump($input); die();

							if ($input) {

								$driver = $this->get_driver('posts');

								// -> should verify permissions here

								if (method_exists($driver, 'update')) {

									$driver->update($input, $post_id);

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

		register_rest_route('karma-fields-alpha/v1', '/get/(?P<driver>[^/]+)/(?P<id>\d+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_get'),
			'permission_callback' => '__return_true',
			'args' => array(
				'driver' => array(
					'required' => true
				),
				'id' => array(
					'required' => true
				)
	    )
		));

		register_rest_route('karma-fields-alpha/v1', '/update/(?P<driver>[^/]+)/(?P<id>[^/]+)/?', array(
			'methods' => 'POST',
			'callback' => array($this, 'rest_update'),
			'permission_callback' => '__return_true',
			'args' => array(
				'driver' => array(
					'required' => true
				),
				'id' => array(
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

    // -> "relations" road is meant to replace "joins"
    register_rest_route('karma-fields-alpha/v1', '/relations/(?P<driver>[^/]+)/(?P<relation>[^/?]+)', array(
			'methods' => 'GET',
			'callback' => array($this, 'rest_relations'),
			'permission_callback' => '__return_true',
			'args' => array(
				'driver' => array(
					'required' => true
				),
        'relation' => array(
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

	/**
	 *	@rest 'wp-json/karma-fields/v1/get/'
	 */
	public function rest_get($request) {

		$driver_name = $request->get_param('driver');
		$id = $request->get_param('id');

		$driver = $this->get_driver($driver_name);

		if ($driver) {

			if (method_exists($driver, 'get')) {

				return $driver->get($id);

			} else {

				return "karma fields error: driver has no method 'get'";

			}

		} else {

			return "karma fields error: driver not found";

		}

	}


	/**
	 *	@rest 'wp-json/karma-fields/v1/update/{middleware}'
	 */
	public function rest_update($request) {

		$driver_name = $request->get_param('driver');
		$id = $request->get_param('id');
		$data = $request->get_param('data');
		$driver = $this->get_driver($driver_name);

		if ($driver) {

			if (method_exists($driver, 'update')) {

				return $driver->update($data, $id);

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
	 *	@rest 'wp-json/karma-fields/v1/relations/{driver}{relation}?ids={ids}'
	 */
	public function rest_relations($request) {

		$driver_name = $request->get_param('driver');
    $relation_name = $request->get_param('relation');

		$driver = $this->get_driver($driver_name);

		if (method_exists($driver, $relation_name)) {

      $params = $request->get_params();

			return $driver->$relation_name($params);

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
	 *	@hook karma_fields_term_field
	 */
	public function print_term_field($term_id, $args) {
		static $index = 0;

		$index++;

		if (isset($args['label']) ) {

			$label = $args['label'];
			unset($args['label']);

		} else {

			$label = "karma-fields";

		}

		?>
		<tr class="form-field">
		  <th scope="row"><label for="start"><?php echo $label; ?></label></th>
		  <td>
		    <?php include plugin_dir_path(__FILE__) . 'includes/term-field.php'; ?>
		  </td>
		</tr>
		<?php

	}

	/**
	 *	@hook karma_fields_option_field
	 */
	public function print_option_field($args) {
		static $index = 0;
	
		$index++;
	
		include plugin_dir_path(__FILE__) . 'includes/option-field.php';
	
	}

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
