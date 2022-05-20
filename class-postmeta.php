<?php



Class Karma_Fields_Alpha_Postmeta {

	public function __construct() {

    add_action('karma_fields_init', array($this, 'karma_fields_init'));

  }

	/**
	 * @hook karma_fields_init
	 */
	public function karma_fields_init($karma_fields) {

		// $karma_fields->register_menu_item('karma=posts', '?post_type=page');
		//
		// $karma_fields->register_table(array(
		//
		// 	'driver' => 'posts',
		// 	'id' => 'posts',
		// 	'type' => 'table',
		// 	'join' => array(
		// 		array('driver' => 'taxonomy'),
		// 		array('driver' => 'postmeta'),
		// 		// array('driver' => 'taxonomy?taxonomy=category'),
		// 		// array('driver' => 'taxonomy?taxonomy=post_tag')
		// 	),
		// 	'ppp' => 20,
		// 	'index' => array(
		// 		'title' => '#',
		// 		'width' => 'auto'
		// 	),
		// 	'style' => 'flex: 1 1 0;',
		// 	'orderby' => 'post_title',
		// 	'autosave' => false,
		// 	'title' => 'Posts',
		// 	'header' => array(
		// 		'children' => array(
		// 			'title',
		// 			'count',
		// 			'pagination',
		// 			'close'
		// 		)
		// 	),
		//
		// 	'children' => array(
		//
		//
		// 		array(
		// 			'label' => 'Title',
		// 			'sortable' => true,
		// 			'order' => 'asc',
		// 			'width' => '1fr',
		// 			'value' => '{{post_title}}',
		// 			'type' => 'text'
		// 		),
		// 		array(
		// 			'label' => 'Category',
		// 			'sortable' => true,
		// 			'width' => 'auto',
		// 			// 'value' => '{{category}}',
		// 			'type' => 'dropdown',
		// 			'key' => 'category',
		// 			'driver' => 'taxonomy',
		// 			'params' => array('taxonomy' => 'category')
		// 		),
		// 		array(
		// 			'label' => 'Status',
		// 			'sortable' => true,
		// 			'width' => 'auto',
		// 			'value' => '{{post_status}}',
		// 			'type' => 'text'
		// 		),
		// 		array(
		// 			'label' => 'Type',
		// 			'sortable' => true,
		// 			'width' => 'auto',
		// 			'value' => '{{post_type}}',
		// 			'type' => 'text'
		// 		),
		//
		// 		array(
		// 			'label' => 'Date',
		// 			'sortable' => true,
		// 			'width' => 'auto',
		// 			'value' => '{{date::post_date::DD/MM/YYYY}}',
		// 			'type' => 'text'
		// 		)
		// 	),
		//
		// 	'filters' => array(
		// 		'type' => 'group',
		// 		'display' => 'flex',
		// 		'children' => array(
		// 			array(
		// 				'type' => 'input',
		// 				'label' => 'Recherche',
		// 				'value' => '',
		// 				'key' => 'search',
		// 				'style' => 'flex:1'
		// 			)
		// 		)
		// 	)
		//
		//
		// ));

	}


}

new Karma_Fields_Alpha_Postmeta;
