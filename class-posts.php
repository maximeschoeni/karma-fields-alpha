<?php



Class Karma_Fields_Alpha_Posts {

	public function __construct() {

    add_action('karma_fields_init', array($this, 'karma_fields_init'));

  }

	/**
	 * @hook karma_fields_init
	 */
	public function karma_fields_init($karma_fields) {

		$karma_fields->register_menu_item('karma=posts', 'edit.php');

		$karma_fields->register_table(array(

			'driver' => 'posts?post_type=post',
			'id' => 'posts',
			'type' => 'table',
			'joins' => array(
				'taxonomy',
				'postmeta'
				// array('driver' => 'taxonomy', 'on' => 'id'),
				// array('driver' => 'postmeta', 'on' => 'id')
				// array('driver' => 'taxonomy?taxonomy=category'),
				// array('driver' => 'taxonomy?taxonomy=post_tag')
			),
			'ppp' => 30,
			'index' => array(
				'title' => '#',
				'width' => 'auto'
			),
			'style' => 'flex: 1 1 0;',
			'orderby' => 'post_title',
			'autosave' => false,
			'title' => 'Posts',
			'header' => array(
				'children' => array(
					'title',
					'count',
					'pagination',
					'close'
				)
			),

			'children' => array(


				array(
					'label' => 'Title',
					'sortable' => true,
					'order' => 'asc',
					'width' => '1fr',
					// 'value' => '{{post_title}}',
					// 'value' => ['<>', 'post_title'],
					'value' => ['get', 'post_title'],
					'type' => 'text'
				),
				array(
					'label' => 'AA',
					'sortable' => true,
					'order' => 'asc',
					'type' => 'input',
					'key' => 'aa',
				),
				array(
					'label' => 'Category',
					'sortable' => true,
					'width' => 'auto',
					// 'value' => '{{category}}',
					'type' => 'dropdown',
					'key' => 'category',
					// 'driver' => 'taxonomy',
					// 'options' => array(
					// 	array('id' => '', 'name' => '-')
					// ),
					'default' => '1',
					'driver' => 'taxonomy?taxonomy=category'
					// 'params' => array('taxonomy' => 'category')
				),
				array(
					'label' => 'Status',
					'sortable' => true,
					'width' => 'auto',
					// 'value' => '{{post_status}}',
					// 'value' => ['<>', 'post_status'],
					'value' => ['get', 'post_status'],
					'type' => 'text'
				),
				array(
					'label' => 'Type',
					'sortable' => true,
					'width' => 'auto',
					// 'value' => '{{post_type}}',
					// 'value' => ['<>', 'post_type'],
					'value' => ['get', 'post_type'],
					'type' => 'text'
				),

				array(
					'label' => 'Date',
					'sortable' => true,
					'width' => 'auto',
					// 'value' => '{{date::post_date::DD/MM/YYYY}}',
					// 'value' => ['<>', ['post_date', 'date', 'DD/MM/YYYY']],
					'value' => ['date', ['get', 'post_date'], 'DD/MM/YYYY'],
					'type' => 'text'
				)
			),

			'filters' => array(
				'type' => 'group',
				'display' => 'flex',
				'children' => array(
					array(
						'type' => 'dropdown',
						'label' => 'Category',
						'key' => 'category',
						// 'driver' => 'taxonomy',
						// 'params' => array('taxonomy' => 'category'),
						// 'empty' => '',
						// 'style' => 'flex:1'
						'options' => array(
							array('id' => '', 'name' => '-')
						),

						'driver' => 'taxonomy?taxonomy=category&field=name',
					),
					array(
						'type' => 'dropdown',
						'label' => 'Status',
						'key' => 'post_status',
						'options' => array(
							array('id' => '', 'name' => 'All'),
							array('id' => 'publish', 'name' => 'Publish'),
							array('id' => 'pending', 'name' => 'Pending'),
							array('id' => 'draft', 'name' => 'Draft'),
							array('id' => 'future', 'name' => 'Future'),
							array('id' => 'trash', 'name' => 'Trash')
						),
						'style' => 'flex:1'
					),
					array(
						'type' => 'dropdown',
						'label' => 'AA',
						'key' => 'aa',
						'driver' => 'postmeta?meta_key=aa',
						'options' => array(
							array('id' => '', 'name' => '-')
						),
						// 'params' => array('meta_key' => 'aa'),
						// 'map' => array('id' => 'meta_value', 'name' => 'meta_value'),
						// 'empty' => '',
						'style' => 'flex:1'
					),

					array(
						'type' => 'input',
						'label' => 'Recherche',
						'value' => '',
						'key' => 'search',
						'style' => 'flex:1'
					)
				)
			)


		));

	}


}

new Karma_Fields_Alpha_Posts;
