<?php



Class Karma_Fields_Alpha_Driver_Posts {


  /**
	 * is postfield
	 */
  public function is_postfield($key) {

    switch($key) {

      case 'post_name':
      case 'post_title':
      case 'post_content':
      case 'post_excerpt':
      case 'post_parent':
      case 'post_date':
      case 'post_status':
      case 'post_author':
      case 'post_type':
      case 'menu_order':
        return true;

    }

    return false;

    // return property_exists('WP_Post', $key);
  }

  /**
	 * get
	 */
  public function get($path) {

    $keys = explode('/', $path);

    if (count($keys) === 2) {

      $id = $keys[0];
      $key = $keys[1];
      // $index = $keys[2];

      $post = get_post($id);

      if ($post) {

        $check = apply_filters('karma_fields_posts_driver_get', null, $post, $key);

        if ($check !== null) {

          return $check;

        } else if ($this->is_postfield($key)) {

          return array($post->$key);

        } else if (taxonomy_exists($key)) {

          $terms = get_the_terms($post, $key);

          if ($terms && !is_wp_error($terms)) {

            return array_map(function($term) {
              return $term->term_id;
            }, $terms);

          } else {

            return array();

          }

        } else {

          // if (registered_meta_key_exists('post', $key)) {
          //
          //   $value = get_registered_metadata('post', $post->ID, $key);
          //
          // } else {

            $value = get_post_meta($post->ID, $key);

            // if (isset($index)) {
            //   $value = $value[$value];
            // }

          // }

          return apply_filters('karma_fields_posts_driver_get_meta', $value, $key, $post->ID);

        }

      }

    }

  }

  /**
	 * update
	 */
  public function update($data) {
    global $wpdb;

    foreach ($data as $id => $item) {

      $args = array();

      $id = intval($id);


      foreach ($item as $key => $value) {

        if (apply_filters('karma_fields_posts_driver_update', null, $value, $key, $id, $args) === null) {

          switch ($key) {

            case 'post_name':
            case 'post_title':
            case 'post_content':
            case 'post_excerpt':
            case 'post_date':
            case 'post_status':
            case 'post_type':
              $args[$key] = $value[0];
              break;

            case 'post_parent':
            case 'post_author':
            case 'menu_order':
              $args[$key] = intval($value[0]);
              break;

            default:

              if (taxonomy_exists($key)) { // -> taxonomy

                $value = array_filter(array_map('intval', $value));

                wp_set_post_terms($id, $value, $key);

              } else { // -> meta

                $value = apply_filters('karma_fields_posts_driver_update_meta', $value, $key, $id);

                $meta_ids = $wpdb->get_col( $wpdb->prepare( "SELECT meta_id FROM $wpdb->postmeta WHERE meta_key = %s AND post_id = %d", $key, $id ) );

                for ( $i = 0; $i < max(count($value), count($meta_ids)); $i++ ) {

                  if (isset($value[$i], $meta_ids[$i])) {

                    update_metadata_by_mid( 'post', $meta_ids[$i], $value[$i]);

                  } else if (isset($value[$i])) {

                    add_metadata( 'post', $id, $key, $value[$i] );

                  } else if (isset($meta_ids[$i])) {

                    delete_metadata_by_mid( 'post', $meta_ids[$i] );

                  }

                }

              }

          }

        }

      }

      if ($args) {

        $args['ID'] = $id;

        wp_insert_post($args);

      }

    }

    return true;
  }



  /**
	 * add
	 */
  public function add($item) {

    add_filter('wp_insert_post_empty_content', '__return_false', 10, 2);

    $id = wp_insert_post($item);

    // return $id;
    $item['id'] = $id;

    return $item;

  }

  // /**
	//  * fetch
	//  */
  // public function fetch($request, $params) {
  //
  //   switch($request) {
  //
  //     case 'querytable':
  //       return $this->query_table($params);
  //
  //     case 'querykey':
  //       return $this->query_key($params);
  //
  //     case 'queryfiles':
  //       return $this->query_files($params);
  //
  //   }
  //
  // }



  /**
	 * query
	 */
  public function query($params) {

    $output = array();

    $args = array();

    $args['post_status'] = array('publish', 'pending', 'draft', 'future');
    $args['post_type'] = 'posts';
    // $args['orderby'] = 'post_date';
    // $args['order'] = 'DESC';
    //
    // if (isset($params['page'])) {
    //
    //   $args['paged'] = $params['page'];
    //
    // }
    //
    // if (isset($params['ppp'])) {
    //
    //   $args['posts_per_page'] = $params['ppp'];
    //
    // }
    //
    // if (isset($params['orderby'])) {
    //
    //   if (isset($params['order'])) {
    //
    //     $order = $params['order'];
    //
    //   } else {
    //
    //     $order = 'ASC';
    //
    //   }
    //
    //   switch ($params['orderby']) {
    //     case 'post_name':
    //       $args['orderby'] = array('name' => $order, 'date' => 'DESC');
    //       break;
    //     case 'post_title':
    //       $args['orderby'] = array('title' => $order, 'date' => 'DESC');
    //       break;
    //     case 'post_date':
    //       $args['orderby'] = array('date' => $order, 'title' => 'ASC');
    //       break;
    //     case 'menu_order':
    //       $args['orderby'] = array('menu_order' => $order);
    //       break;
    //     case 'post_author':
    //       $args['orderby'] = array('author' => $order, 'title' => 'ASC', 'date' => 'DESC');
    //       break;
    //     default:
    //
    //
    //       // todo: handle numeric meta, taxonomies
    //       $args['orderby'] = array('metavalue' => $order, 'title' => 'ASC', 'date' => 'DESC');
    //       break;
    //
    //   }
    //
    //
    // }


    foreach ($params as $key => $value) {

      switch ($key) {
        case 'orderby':

          switch ($value) {
            case 'post_name':
              $args['orderby'] = array('name' => $params['order'], 'date' => 'DESC');
              break;

            case 'post_title':
              $args['orderby'] = array('title' => $params['order'], 'date' => 'DESC');
              break;

            case 'post_date':
              $args['orderby'] = array('date' => $params['order'], 'title' => 'ASC');
              break;

            case 'menu_order':
              $args['orderby'] = array('menu_order' => $params['order']);
              break;

            case 'post_author':
              $args['orderby'] = array('author' => $params['order'], 'title' => 'ASC', 'date' => 'DESC');
              break;

            default:
              // todo: handle numeric meta, taxonomies
              $args['orderby'] = array('metavalue' => $params['order'], 'title' => 'ASC', 'date' => 'DESC');
              break;

          }

          break;

        case 'order':
          break;

        case 'page':
          $args['paged'] = intval($value);
          break;

        case 'ppp':
          $args['posts_per_page'] = intval($value);
          break;

        case 'post_name':
          $args['name'] = $value;
          break;

        case 'post_date':
          $args['m'] = $value; // ex:201307
          break;

        case 'post_status':
        case 'post_type':
          $args[$key] = $value;
          break;

        case 'post_parent':
        case 'post_author':
          $args[$key] = intval($value);
          break;

        case 'search':
          $args['s'] = $value;
          break;

        default:

          if (taxonomy_exists($key)) {

            $args['tax_query'][] = array(
              'taxonomy' => $key,
              'field'    => 'term_id',
              'terms'    => intval($value)
            );

          }



          // todo: handle meta keys

      }

    }

    $args = apply_filters('karma_fields_posts_driver_query_table', $args, $params);


    $query = new WP_Query($args);

    // if (isset($params['columns'])) {
    //
    //   foreach ($params['columns'] as $column) {
    //
    //     if (isset($column['driver']) && $column['driver'] !== $this->name) {
    //
    //       $driver = $karma_fields->get_driver($driver_name);
    //
    //       if (method_exists($driver, 'column')) {
    //
    //         $driver->column($query->posts, $column);
    //
    //       }
    //
    //     }
    //
    //   }
    //
    // }



    $output['sql'] = $query->request;
    $output['items'] = $query->posts;
    $output['count'] = $query->found_posts;


    return $output;

  }




  /**
	 * fetch
	 */
  public function fetch($request, $params) {
    global $wpdb;

    $key = isset($params['key']) ? $params['key'] : null;

    // if ($key === 'post_status') {
    //
    //   return array(
    //     'items' => array(
    //       array(
    //         'key' => 'draft',
    //         'name' => 'Draft'
    //       ),
    //       array(
    //         'key' => 'publish',
    //         'name' => 'Publish'
    //       ),
    //       array(
    //         'key' => 'pending',
    //         'name' => 'Pending'
    //       ),
    //       array(
    //         'key' => 'trash',
    //         'name' => 'Trash'
    //       )
    //     )
    //   );
    //
    // } else

    // if (taxonomy_exists($key)) {
    //
    //   $args = array(
    //     'taxonomy' => $key,
    //     'hide_empty' => false,
    //   );
    //
    //   $args = apply_filters('karma_fields_query_key_taxonomy_args', $args, $params);
    //
    //   $terms = get_terms($args);
    //
    //   if ($terms && !is_wp_error($terms)) {
    //
    //     return array(
    //       'items' => array_map(function($term) {
    //         return array(
    //           'key' => $term->term_id,
    //           'name' => $term->name
    //         );
    //       }, $terms)
    //     );
    //
    //   }
    //
    // } else {

    $args = array(
      // 'post_type' => isset($params['post_type']) ? $params['post_type'] : 'any',
      'post_status' => 'publish',
      'posts_per_page' => -1,
      'orderby' => 'title',
      'order' => 'asc'
    );


    if (post_type_exists($key)) {

      $args['post_type'] = $key;

    } else if (isset($params['post_type']) && $params['post_type']) {

      $args['post_type'] = explode(',', $params['post_type']);

    }

    $args = apply_filters('karma_fields_driver_posts_query_key_args', $args, $params, $key);

    $query = new WP_Query($args);

    $results = array();

    while ($query->have_posts()) {

      $query->the_post();

      $results['items'][] = array(
        'key' => (string) $query->post->ID,
        'name' => get_the_title($query->post->ID)
      );

    }

    return apply_filters('karma_fields_driver_posts_query_key_results', $results, $query, $params, $key);

    // }

  }

  /**
	 * query_key
	 */
  public function query_files($params) {
    global $wpdb;




    if (isset($params['ids'])) {

      $ids = array_map('intval', explode(',', $params['ids']));

      $sql_ids = implode(',', $ids);

			$sql = "SELECT $wpdb->posts.* FROM $wpdb->posts WHERE ID IN ($sql_ids)";

			$attachments = $wpdb->get_results($sql);

			if ($attachments) {

				update_post_caches($attachments, 'any', false, true);

			}

      $images = array();

      foreach ($attachments as $attachment) {

        $attachment = get_post($attachment->ID);
        $thumb_src_data = wp_get_attachment_image_src($attachment->ID, 'thumbnail', true);

        $images[] = array(
          'id' => $attachment->ID,
          'title' => get_the_title($attachment),
          'caption' => wp_get_attachment_caption($attachment->ID), // = post_excerpt
          'type' => get_post_mime_type($attachment),
          'src' => $thumb_src_data[0],
          'width' => $thumb_src_data[1],
          'height' => $thumb_src_data[2]
        );

      }

      return $images;

    }

  }


  /**
	 * relations
	 */
  public function relations($params) {
    global $wpdb;

    $ids = implode(',', array_map('intval', explode(',', $params['ids'])));

    if ($ids) {

      $sql_meta = "SELECT
        pm.post_id AS 'id',
        pm.meta_value AS pm.meta_key
        FROM $wpdb->postmeta AS pm WHERE pm.post_id IN ($ids)";

      $sql_tax = "SELECT
        tr.object_id AS 'id',
        tr.term_taxonomy_id AS tt.taxonomy
        FROM $wpdb->term_relationships AS tr
        INNER JOIN $wpdb->term_taxonomy AS tt ON (tt.term_taxonomy_id = tr.term_taxonomy_id)
        WHERE tr.object_id IN ($ids)";


      return array_merge($wpdb->get_results($sql_meta), $wpdb->get_results($sql_tax));

    }

    return array();
  }


  /**
	 * relations
	 */
  public function relations2($params) {
    global $wpdb;

    $ids = implode(',', array_map('intval', explode(',', $params['ids'])));
    $key = esc_sql($params['key']);

    if ($ids && $key) {

      if (taxonomy_exists($key)) {

        $sql = "SELECT
          tr.object_id AS 'id',
          tr.term_taxonomy_id AS '$key'
          FROM $wpdb->term_relationships AS tr
          INNER JOIN $wpdb->term_taxonomy AS tt ON (tt.term_taxonomy_id = tr.term_taxonomy_id)
          WHERE tt.taxonomy = '$key' AND tr.object_id IN ($ids)";

      } else {

        $sql = "SELECT
          pm.post_id AS 'id',
          pm.meta_value AS '$key'
          FROM $wpdb->postmeta AS pm WHERE pm.meta_key = '$key' AND pm.post_id IN ($ids)";

      }

      return $wpdb->get_results($sql);

    }

    return array();

  }





  // function update_metadata_array( $meta_type, $object_id, $meta_key, $meta_array ) {
  //     global $wpdb;
  //
  //     if ( ! $meta_type || ! $meta_key || ! is_numeric( $object_id ) ) {
  //         return false;
  //     }
  //
  //     $object_id = absint( $object_id );
  //     if ( ! $object_id ) {
  //         return false;
  //     }
  //
  //     $table = _get_meta_table( $meta_type );
  //     if ( ! $table ) {
  //         return false;
  //     }
  //
  //     $meta_subtype = get_object_subtype( $meta_type, $object_id );
  //
  //     $column    = sanitize_key( $meta_type . '_id' );
  //     $id_column = ( 'user' === $meta_type ) ? 'umeta_id' : 'meta_id';
  //
  //     // expected_slashed ($meta_key)
  //     $raw_meta_key = $meta_key;
  //     $meta_key     = wp_unslash( $meta_key );
  //
  //     $meta_array = array_filter($meta_array, function($value) {
  //       return isset($value);
  //     });
  //
  //     $meta_values = array();
  //
  //     foreach ( $meta_array as $meta_value ) {
  //
  //       $meta_value = wp_unslash( $meta_value );
  //       $meta_value = sanitize_meta( $meta_key, $meta_value, $meta_type, $meta_subtype );
  //       $meta_values[] = $meta_value;
  //
  //     }
  //
  //
  //     /**
  //      * Short-circuits updating metadata array of a specific type.
  //      *
  //      * The dynamic portion of the hook, `$meta_type`, refers to the meta object type
  //      * (post, comment, term, user, or any other type with an associated meta table).
  //      * Returning a non-null value will effectively short-circuit the function.
  //      *
  //      * @since xxxx
  //      *
  //      * @param null|bool $check      Whether to allow updating metadata for the given type.
  //      * @param int       $object_id  ID of the object metadata is for.
  //      * @param string    $meta_key   Metadata key.
  //      * @param array     $meta_array Metadata values. Array of scalar or serializable items.
  //      */
  //     $check = apply_filters( "update_{$meta_type}_metadata_array", null, $object_id, $meta_key, $meta_array );
  //
  //     if ( null !== $check ) {
  //         return (bool) $check;
  //     }
  //
  //     // Compare existing value to new value if no prev value given and the key exists only once.
  //     // if ( empty( $prev_value ) ) {
  //     //     $old_value = get_metadata_raw( $meta_type, $object_id, $meta_key );
  //     //     if ( is_countable( $old_value ) && count( $old_value ) === 1 ) {
  //     //         if ( $old_value[0] === $meta_value ) {
  //     //             return false;
  //     //         }
  //     //     }
  //     // }
  //
  //     // $meta_ids = $wpdb->get_col( $wpdb->prepare( "SELECT $id_column FROM $table WHERE meta_key = %s AND $column = %d", $meta_key, $object_id ) );
  //     // if ( empty( $meta_ids ) ) {
  //     //     return add_metadata( $meta_type, $object_id, $raw_meta_key, $passed_value );
  //     // }
  //
  //     $meta_ids = $wpdb->get_col( $wpdb->prepare( "SELECT meta_id FROM $table WHERE meta_key = %s AND $column = %d", $meta_key, $object_id ) );
  //
  //     // maybe filter null values in $meta_array?
  //
  //
  //
  //
  //     for ( $i = 0; $i < max(count($meta_values), count($meta_ids)); $i++ ) {
  //
  //       if (isset($meta_values[$i], $meta_ids[$i])) {
  //
  //         update_metadata_by_mid( $meta_type, $meta_ids[$i], $meta_values[$i]);
  //
  //       } else if (isset($meta_array[$i])) {
  //
  //         add_metadata( $meta_type, $object_id, $raw_meta_key, $meta_array[$i] );
  //
  //       } else if (isset($current_values[$i])) {
  //
  //         $meta_id = $current_results[$i]->meta_id;
  //
  //         delete_metadata_by_mid( $meta_type, $meta_id );
  //
  //       }
  //
  //     }
  //
  //     return true;
  // }





}
