<?php



class Karma_Fields_Alpha_Driver_Posts {

  public function __construct() {

    add_filter('karma_fields_posts_meta_format', 'maybe_unserialize');

    do_action('karma_fields_posts_init', $this);

  }



  // /**
	//  * is postfield
	//  */
  // public function is_postfield($key) {
  //
  //   switch($key) {
  //
  //     case 'post_name':
  //     case 'post_title':
  //     case 'post_content':
  //     case 'post_excerpt':
  //     case 'post_parent':
  //     case 'post_date':
  //     case 'post_status':
  //     case 'post_author':
  //     case 'post_type':
  //     case 'menu_order':
  //     case 'post_mime_type':
  //       return true;
  //
  //   }
  //
  //   return false;
  //
  //   // return property_exists('WP_Post', $key);
  // }

  /**
	 * get
	 */
  public function get($id) {

    $post = get_post($id);

    if ($post) {

      return array(
        'id' => $post->ID,
        'name' => $post->post_title,
        'post_name' => $post->post_name,
        'post_title' => $post->post_title,
        'post_content' => $post->post_content,
        'post_excerpt' => $post->post_excerpt,
        'post_parent' => $post->post_parent,
        'post_date' => $post->post_date,
        'post_status' => $post->post_status,
        'post_author' => $post->post_author,
        'post_type' => $post->post_type
      );

    }

  }


  /**
	 * update
	 */
  public function update($data, $id) {
    global $wpdb;

    // foreach ($data as $id => $item) {

    if (!current_user_can('edit_post', $id)) {

      return false;

    }




      $args = array();

      $id = intval($id);

      $post_arr = get_post($id, ARRAY_A);

      if (!$post_arr) {
        die('Post not found!');
      }

      $data = (array) $data;

      foreach ($data as $key => $value) {

        if (apply_filters('karma_fields_posts_driver_update', null, $value, $key, $id, $args, $data) === null) {

          switch ($key) {

            case 'post_content':

              $args[$key] = $value[0];

              // $args[$key] = '';
              // if (isset($value[0]) && $value[0]) {
              //
              //   // var_dump($value[0]);
              //   if (is_array($value[0]) && isset($value[0]['children'])) {
              //     $wp_blocks = $this->render_wp_blocks($value[0]['children']);
              //
              //
              //     $args[$key] = '';
              //     foreach ($wp_blocks as $wp_block) {
              //       $args[$key] .= render_block($wp_block);
              //     }
              //     var_dump($args[$key]);
              //   } else if (is_string($value[0])) {
              //     $args[$key] = $value[0];
              //   }
              // }
              //
              // die();


              break;

            case 'post_name':
            case 'post_title':
            case 'post_content':
            case 'post_excerpt':
            case 'post_date':
            case 'post_status':
              $args[$key] = $value[0];
              break;

            case 'post_parent':
            case 'post_author':
            case 'menu_order':
              $args[$key] = intval($value[0]);
              break;

            case 'post_mime_type':
            case 'post_type':
              break;

            default:

              if (taxonomy_exists($key)) { // -> taxonomy

                $value = array_filter(array_map('intval', $value));



                // var_dump($id, $value, $key);

                wp_set_post_terms(intval($id), $value, $key);


                // $r = wp_set_object_terms(3836, array(2), 'category');
                //
                // // $r = wp_set_object_terms(intval($id), $value, $key);
                //
                // var_dump($r);

              } else { // -> meta



                $value = apply_filters('karma_fields_posts_driver_update_meta', $value, $key, $id);

                $value = array_map(function($value) {
                  if ($value === null) return '';
                  else return $value;
                }, $value);



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

      if (isset($data['post_type']) || isset($data['trash'])) {

        $post_type = get_post_type($id);
        $trash = false;

        if (strpos($post_type, 'trashed-') === 0) {

          $trash = true;
          $post_type = substr($post_type, strlen('trashed-'));

        }

        if (isset($data['post_type'][0])) {

          $post_type = $data['post_type'][0];

        }

        if (isset($data['trash'])) {

          $trash = $data['trash'] && $data['trash'][0] === '1';

        }

        if ($trash) {

          $args['post_type'] = 'trashed-'.$post_type;

          $wpdb->update($wpdb->posts, array(
            'post_parent' => '0'
          ), array(
            'post_parent' => $id
          ), array('%d'), array('%d'));

        } else {

          $args['post_type'] = $post_type;

        }

      }



      if ($args) {

        $args = array_merge($post_arr, $args);

        remove_action( 'post_updated', 'wp_save_post_revision' );
        // remove_action('pre_post_update', 'wp_save_post_revision');// stop revisions

        wp_insert_post($args);

      }


    return true;
  }



  /**
	 * add
	 */
  public function add($data) {
    global $wpdb;

    if (!current_user_can('edit_posts')) {

      return false;

    }


    add_filter('wp_insert_post_empty_content', '__return_false', 10, 2);

    $args = array();



    foreach ($data as $key => $value) {

      switch ($key) {

        case 'post_type':
        case 'post_status':
          $args[$key] = $value;
          break;

        case 'post_parent':
          $args[$key] = intval($value);
          break;

      }

    }



    if (empty($args['post_type'])) {

      $args['post_type'] = 'post';

    }


    $args = apply_filters("karma_fields_posts_driver_add", $args, $data);

    $id = wp_insert_post($args);

    return $id;


    // // return $id;
    // // $item['id'] = $id;
    // //
    // // return $item;
    //
    // return $output;

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
  public function get_query_args($params) {

    $args = array(
      'post_status' => array('publish', 'pending', 'draft', 'future', 'inherit'),
      'post_type' => 'any',
      'posts_per_page' => -1,
      'cache_results' => false,
      'update_post_term_cache' => false,
      'update_post_meta_cache' => false,
      'ignore_sticky_posts' => 1
    );

    foreach ($params as $key => $value) {

      if (has_filter("karma_fields_posts_driver_query_param-$key")) {

        $args = apply_filters("karma_fields_posts_driver_query_param-$key", $args, $value, $key, $params);

        continue;

      }

      switch ($key) {

        case 'driver':
        case 'karma':
          break; // compat

        case 'orderby':

          $order = isset($params['order']) ? $params['order'] : 'ASC';

          switch ($value) {

            case 'post_name':
            case 'name':
              $args['orderby'] = array('name' => $order, 'date' => 'DESC');
              break;

            case 'post_title':
            case 'title':
              $args['orderby'] = array('title' => $order, 'date' => 'DESC');
              break;

            case 'post_date':
            case 'date':
              $args['orderby'] = array('date' => $order, 'title' => 'ASC');
              break;

            case 'post_author':
            case 'author':
              $args['orderby'] = array('author' => $order, 'title' => 'ASC', 'date' => 'DESC');
              break;

            case 'meta_value':
              $args['orderby'] = array('meta_value' => $order);
              break;

            case 'menu_order':
              $args['orderby'] = array('menu_order' => $order);
              break;




            // case 'post_type': // -> for medias
            //   $args['orderby'] = array('post_type' => 'DESC', 'date' => 'DESC');
            //   break;

            default:
              // todo: handle numeric meta, taxonomies
              $args['orderby'] = array('meta_value' => $params['order'], 'title' => 'ASC', 'date' => 'DESC');
              $args['meta_key'] = $value;


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

        case 'id':
        case 'ID':
          // $args['p'] = intval($value);
          // break;

        case 'ids':
          $args['post__in'] = array_map('intval', explode(',', $value));
          break;

        // case 'post_date':
        //   $args['m'] = $value; // ex:201307
        //   break;

        case 'post_date_year':
          $args['year'] = intval($value);
          break;

        case 'post_mime_type':
          $args[$key] = $value;
          break;

        case 'post_status':
        case 'post_type':
          $value = explode(',', $value);
          $args[$key] = $value;
          break;

        case 'post_parent':
          $args['post_parent__in'] = array_map('intval', explode(',', $value));
          break;

        case 'post_author':
          // $args[$key] = intval($value);
          $args['post_author__in'] = array_map('intval', explode(',', $value));
          break;

        case 'search':
          $args['s'] = $value;
          break;

        case 'post_name':
          break;

        case 'meta_key':
          $args['meta_key'] = $value;
          break;

        case 'parent':
          // todo parse alias before sending
          $args['post_parent'] = $value;
          break;

        default:

          if (taxonomy_exists($key)) {

            $args['tax_query'][] = array(
              'taxonomy' => $key,
              'field'    => 'term_id',
              'terms'    => intval($value)
            );

          } else {

            $args['meta_query'][] = array(
              'key' => $key,
              'value' => $value
            );

          }
          break;

      }

    }

    $args = apply_filters('karma_fields_posts_driver_query_args', $args, $params);

    return $args;

  }


  /**
	 * query
	 */
  public function query($params) {

    $args = $this->get_query_args($params);



    $args['no_found_rows'] = true;

    // var_dump($args); die();

// global $wpdb;
//
// die();

// unset($args['post_type']);
//
//     add_filter('query', function($sql) {
//       var_dump($sql);
//       return $sql;
//     });

    $query = new WP_Query($args);

    // var_dump($query); die();

    $output = array_map(function($post) {
      return array(
        'id' => (string) $post->ID,
        'name' => $post->post_title,
        'ID' => (string) $post->ID,
        'post_title' => $post->post_title,
        'post_excerpt' => $post->post_excerpt,
        'post_name' => $post->post_name,
        'post_parent' => (string) $post->post_parent,
        'post_status' => $post->post_status,
        'post_type' => $post->post_type,
        'post_date' => $post->post_date,
        'menu_order' => (string) $post->menu_order,
        'post_mime_type' => $post->post_mime_type
      );
    }, $query->posts);



    return apply_filters('karma_fields_posts_driver_query_output', $output, $query, $args);

  }

  /**
   * count
   */
  public function count($params) {

    $args = $this->get_query_args($params);

    $args['paged'] = 1;
    $args['posts_per_page'] = 1;

    // unset($args['orderby']);

    $args['fields'] = 'ids';
    $query = new WP_Query($args);

    return apply_filters('karma_fields_posts_driver_query_count', $query->found_posts, $query, $args);

  }




  //
  // /**
	//  * query
	//  */
  // public function query($params) {
  //
  //   $output = array();
  //
  //   $args = array();
  //
  //   $args['post_status'] = array('publish', 'pending', 'draft', 'future');
  //   $args['post_type'] = 'posts';
  //
  //   foreach ($params as $key => $value) {
  //
  //     switch ($key) {
  //       case 'orderby':
  //
  //         switch ($value) {
  //           case 'post_name':
  //             $args['orderby'] = array('name' => $params['order'], 'date' => 'DESC');
  //             break;
  //
  //           case 'post_title':
  //             $args['orderby'] = array('title' => $params['order'], 'date' => 'DESC');
  //             break;
  //
  //           case 'post_date':
  //             $args['orderby'] = array('date' => $params['order'], 'title' => 'ASC');
  //             break;
  //
  //           case 'menu_order':
  //             $args['orderby'] = array('menu_order' => $params['order']);
  //             break;
  //
  //           case 'post_author':
  //             $args['orderby'] = array('author' => $params['order'], 'title' => 'ASC', 'date' => 'DESC');
  //             break;
  //
  //           default:
  //             // todo: handle numeric meta, taxonomies
  //             $args['orderby'] = array('metavalue' => $params['order'], 'title' => 'ASC', 'date' => 'DESC');
  //             break;
  //
  //         }
  //
  //         break;
  //
  //       case 'order':
  //         break;
  //
  //       case 'page':
  //         $args['paged'] = intval($value);
  //         break;
  //
  //       case 'ppp':
  //         $args['posts_per_page'] = intval($value);
  //         break;
  //
  //       case 'post_name':
  //         $args['name'] = $value;
  //         break;
  //
  //       case 'post_date':
  //         $args['m'] = $value; // ex:201307
  //         break;
  //
  //       case 'post_status':
  //       case 'post_type':
  //         $args[$key] = $value;
  //         break;
  //
  //       case 'post_parent':
  //       case 'post_author':
  //         $args[$key] = intval($value);
  //         break;
  //
  //       case 'search':
  //         $args['s'] = $value;
  //         break;
  //
  //       default:
  //
  //         if (taxonomy_exists($key)) {
  //
  //           $args['tax_query'][] = array(
  //             'taxonomy' => $key,
  //             'field'    => 'term_id',
  //             'terms'    => intval($value)
  //           );
  //
  //         }
  //
  //
  //
  //         // todo: handle meta keys
  //
  //     }
  //
  //   }
  //
  //   $args = apply_filters('karma_fields_posts_driver_query_table', $args, $params);
  //
  //
  //   $query = new WP_Query($args);
  //
  //   // if (isset($params['columns'])) {
  //   //
  //   //   foreach ($params['columns'] as $column) {
  //   //
  //   //     if (isset($column['driver']) && $column['driver'] !== $this->name) {
  //   //
  //   //       $driver = $karma_fields->get_driver($driver_name);
  //   //
  //   //       if (method_exists($driver, 'column')) {
  //   //
  //   //         $driver->column($query->posts, $column);
  //   //
  //   //       }
  //   //
  //   //     }
  //   //
  //   //   }
  //   //
  //   // }
  //
  //
  //
  //   $output['sql'] = $query->request;
  //   $output['items'] = $query->posts;
  //   $output['count'] = $query->found_posts;
  //
  //
  //   return $output;
  //
  // }
  //
  //

  //
  // /**
	//  * fetch
	//  */
  // public function fetch($request, $params) {
  //   global $wpdb;
  //
  //   $key = isset($params['key']) ? $params['key'] : null;
  //
  //   // if ($key === 'post_status') {
  //   //
  //   //   return array(
  //   //     'items' => array(
  //   //       array(
  //   //         'key' => 'draft',
  //   //         'name' => 'Draft'
  //   //       ),
  //   //       array(
  //   //         'key' => 'publish',
  //   //         'name' => 'Publish'
  //   //       ),
  //   //       array(
  //   //         'key' => 'pending',
  //   //         'name' => 'Pending'
  //   //       ),
  //   //       array(
  //   //         'key' => 'trash',
  //   //         'name' => 'Trash'
  //   //       )
  //   //     )
  //   //   );
  //   //
  //   // } else
  //
  //   // if (taxonomy_exists($key)) {
  //   //
  //   //   $args = array(
  //   //     'taxonomy' => $key,
  //   //     'hide_empty' => false,
  //   //   );
  //   //
  //   //   $args = apply_filters('karma_fields_query_key_taxonomy_args', $args, $params);
  //   //
  //   //   $terms = get_terms($args);
  //   //
  //   //   if ($terms && !is_wp_error($terms)) {
  //   //
  //   //     return array(
  //   //       'items' => array_map(function($term) {
  //   //         return array(
  //   //           'key' => $term->term_id,
  //   //           'name' => $term->name
  //   //         );
  //   //       }, $terms)
  //   //     );
  //   //
  //   //   }
  //   //
  //   // } else {
  //
  //   $args = array(
  //     // 'post_type' => isset($params['post_type']) ? $params['post_type'] : 'any',
  //     'post_status' => 'publish',
  //     'posts_per_page' => -1,
  //     'orderby' => 'title',
  //     'order' => 'asc'
  //   );
  //
  //
  //   if (post_type_exists($key)) {
  //
  //     $args['post_type'] = $key;
  //
  //   } else if (isset($params['post_type']) && $params['post_type']) {
  //
  //     $args['post_type'] = explode(',', $params['post_type']);
  //
  //   }
  //
  //   $args = apply_filters('karma_fields_driver_posts_query_key_args', $args, $params, $key);
  //
  //   $query = new WP_Query($args);
  //
  //   $results = array();
  //
  //   while ($query->have_posts()) {
  //
  //     $query->the_post();
  //
  //     $results['items'][] = array(
  //       'key' => (string) $query->post->ID,
  //       'name' => get_the_title($query->post->ID)
  //     );
  //
  //   }
  //
  //   return apply_filters('karma_fields_driver_posts_query_key_results', $results, $query, $params, $key);
  //
  //   // }
  //
  // }

  // /**
	//  * query_key
	//  */
  // public function query_files($params) {
  //   global $wpdb;
  //
  //
  //
  //
  //   if (isset($params['ids'])) {
  //
  //     $ids = array_map('intval', explode(',', $params['ids']));
  //
  //     $sql_ids = implode(',', $ids);
  //
	// 		$sql = "SELECT $wpdb->posts.* FROM $wpdb->posts WHERE ID IN ($sql_ids)";
  //
	// 		$attachments = $wpdb->get_results($sql);
  //
	// 		if ($attachments) {
  //
	// 			update_post_caches($attachments, 'any', false, true);
  //
	// 		}
  //
  //     $images = array();
  //
  //     foreach ($attachments as $attachment) {
  //
  //       $attachment = get_post($attachment->ID);
  //       $thumb_src_data = wp_get_attachment_image_src($attachment->ID, 'thumbnail', true);
  //
  //       $images[] = array(
  //         'id' => $attachment->ID,
  //         'title' => get_the_title($attachment),
  //         'caption' => wp_get_attachment_caption($attachment->ID), // = post_excerpt
  //         'type' => get_post_mime_type($attachment),
  //         'src' => $thumb_src_data[0],
  //         'width' => $thumb_src_data[1],
  //         'height' => $thumb_src_data[2]
  //       );
  //
  //     }
  //
  //     return $images;
  //
  //   }
  //
  // }


  /** DEPRECATED
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


  /** DEPRECATED
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



  /**
	 * meta relations
	 */
  public function meta($params) {
    global $wpdb;

    $ids = explode(',', $params['ids']);
    $ids = array_filter($ids);

    if ($ids) {

      $ids = array_map('intval', $ids);
      $ids_string = implode(',', $ids);

      $sql = "SELECT
        meta_value AS 'value',
        meta_key AS 'key',
        post_id AS 'id'
        FROM $wpdb->postmeta
        WHERE post_id IN ($ids_string) AND meta_key NOT LIKE '\_%' AND meta_key != 'trash'";

      $sql = apply_filters('karma_fields_posts_meta_sql', $sql, $ids, $ids_string);

			$results = $wpdb->get_results($sql);

      foreach ($results as $result) {

        // $result->value = maybe_unserialize($result->value);
        $result->value = apply_filters('karma_fields_posts_meta_format', $result->value, $result->key, $result->id);

        $result->value = apply_filters('karma_fields_posts_driver_join_meta', $result->value, $result->key, $result->id); // deprecated


      }

      $results = apply_filters('karma_fields_posts_driver_meta_results', $results, $ids);

      return $results;

    } else {

      return array();

    }

  }

  /**
	 * taxonomy relations
	 */
  public function taxonomy($params) {
    global $wpdb;

    $ids = explode(',', $params['ids']);
    $ids = array_filter($ids);

    if ($ids) {

      $ids = array_map('intval', $ids);
      $ids = implode(',', $ids);

      $sql = "SELECT
        tt.taxonomy AS 'key',
        tt.term_id AS 'value',
        tr.object_id AS 'id'
        FROM $wpdb->term_relationships AS tr
        INNER JOIN $wpdb->term_taxonomy AS tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
        WHERE tr.object_id IN ($ids)";

			$results = $wpdb->get_results($sql);

      return $results;

    } else {

      return array();

    }

  }


  // /**
	//  * relations mimetype
	//  */
  // public function mimetype($params) {
  //   global $wpdb;

  //   $ids = explode(',', $params['ids']);
  //   $ids = array_filter($ids);

  //   if ($ids) {

  //     $ids = array_map('intval', $ids);
  //     $ids = implode(',', $ids);

	// 		return $wpdb->get_results("SELECT
  //       post_mime_type AS 'value',
  //       'mimetype' AS 'key',
  //       ID AS 'id'
  //       FROM $wpdb->posts
  //       WHERE ID IN ($ids)");

  //   } else {

  //     return array();

  //   }

  // }


  /**
	 * filemeta relations
	 */
  public function filemeta($params) {
    global $wpdb;

    $ids = explode(',', $params['ids']);
    $ids = array_filter($ids);

    $output = array();

    if ($ids) {

      $ids = array_map('intval', $ids);
      $ids = implode(',', $ids);

      $sql = "SELECT
        meta_value AS 'value',
        meta_key AS 'key',
        post_id AS 'id'
        FROM $wpdb->postmeta
        WHERE post_id IN ($ids) AND meta_key = '_wp_attachment_metadata'";

			$results = $wpdb->get_results($sql);


      foreach ($results as $result) {

        $meta = maybe_unserialize($result->value);

        $file = $meta['file'];

        $dir = dirname($file);

        foreach ($meta['sizes'] as $key => $size) {

          $output[] = array(
            'id' => $result->id,
            'key' => 'sizes',
            'value' => array(
              'name' => $key,
              'file' => "$dir/{$size['file']}",
              'width' => $size['width'],
              'height' => $size['height']
            )
          );

        }

        $output[] = array(
          'id' => $result->id,
          'key' => 'file',
          'value' => $file
        );

        $output[] = array(
          'id' => $result->id,
          'key' => 'filename',
          'value' => basename($file)
        );

        $output[] = array(
          'id' => $result->id,
          'key' => 'width',
          'value' => $meta['width']
        );

        $output[] = array(
          'id' => $result->id,
          'key' => 'height',
          'value' => $meta['height']
        );

        $output[] = array(
          'id' => $result->id,
          'key' => 'image_meta',
          'value' => $meta['image_meta']
        );

      }

    }

    return $output;

  }



  /**
	 * content relations
	 */
  public function content($params) {
    global $wpdb;

    $ids = explode(',', $params['ids']);
    $ids = array_filter($ids);

    if ($ids) {

      $ids = array_map('intval', $ids);
      $ids = implode(',', $ids);

      $sql = "SELECT
        post_content AS 'value',
        'post_content' AS 'key',
        ID AS 'id'
        FROM $wpdb->posts
        WHERE ID IN ($ids) AND post_type NOT LIKE 'trashed-%'";

			$results = $wpdb->get_results($sql);

      foreach ($results as $result) {

        // -> parse blocks

        // if (has_blocks($result->value)) {
        //
        //   $wp_blocks = parse_blocks($result->value);
        //
        //   $blocks = $this->parse_wp_blocks($wp_blocks);
        //
        //   $result->value = array('children' => $blocks);
        //
        // }

        $result->value = apply_filters('karma_fields_posts_driver_join_content', $result->value, $result->key, $result->id);

      }

      $results = apply_filters('karma_fields_posts_driver_content_results', $results, $ids);

      return $results;

    } else {

      return array();

    }

  }



  /**
   * parse wp block
   */
  public function parse_wp_block($wp_block) {

    $block = array();

    switch ($wp_block['blockName']) {

      case 'core/paragraph':
      case 'core/quote':
      case 'core/classic':
        $block['type'] = 'blockTinymce';
        if (isset($wp_block['innerHTML'])) {
          $block['content'] = $wp_block['innerHTML'];
        }
        break;

      case 'core/image':

        $block_content = new WP_HTML_Tag_Processor($wp_block['innerHTML']);

        while ($block_content->next_tag()) {
          var_dump($block_content->get_tag());
            // if (
            //      ( 'DIV' === $tags->get_tag() || 'SPAN' === $tags->get_tag() ) &&
            //      'jazzy' === $tags->get_attribute( 'data-style' )
            // ) {
            //     $tags->add_class( 'theme-style-everest-jazz' );
            //     $remaining_count--;
            // }
        }


      die();

        $block['type'] = 'blockGallery';
        if (isset($wp_block['attrs']['id']) && $wp_block['attrs']['id']) {
          $block['files'] = array($wp_block['attrs']['id']);
        }
        break;

      case 'core/columns':
        $block['type'] = 'columns';
        if (isset($wp_block['innerBlocks']) && $wp_block['innerBlocks']) {
          $block['children'] = $this->parse_wp_blocks($wp_block['innerBlocks']);
        }
        break;

      case "core/column":
        $block['type'] = 'column';
        if (isset($wp_block['innerBlocks']) && $wp_block['innerBlocks']) {
          $block['children'] = $this->parse_wp_blocks($wp_block['innerBlocks']);
        }
        break;

    }

    return $block;

  }

  /**
   * parse wp blocks array
   */
  public function parse_wp_blocks($wp_blocks) {

    $blocks = array();

    foreach($wp_blocks as $wp_block) {

      $block = $this->parse_wp_block($wp_block);

      if ($block) {

        $blocks[] = $block;

      }

    }

    return $blocks;

  }

  /**
   * render wp block
   */
  public function render_wp_block($block) {

    $wp_block = array();

    switch ($block['type']) {

      case 'blockTinymce':
        $wp_block['blockName'] = "core/classic";
        $wp_block['attrs'] = array();
        $wp_block['innerBlocks'] = array();
        $wp_block['innerHTML'] = isset($block['content']) ? $block['content'] : '';
        $wp_block['innerContent'] = array($wp_block['innerHTML']);
        break;

      case 'blockGallery':
        $wp_block['blockName'] = 'core/image';
        $wp_block['innerBlocks'] = array();
        if (isset($block['files'][0])) {
          $id = $block['files'][0];
          $src = wp_get_attachment_image_src($id, 'large');
          $img = wp_get_attachment_image($id, 'large');
          $wp_block['attrs'] = array(
            'id' => $id,
            'width' => $src[1],
            'height' => $src[2],
            'sizeSlug' => 'large',
            'linkDestination' => 'custom',
            'className' => "is-style-default"
          );
          $wp_block['innerHTML'] = $img;
          $wp_block['innerContent'] = array($img);
        }
        break;

      case 'columns':
        $wp_block['blockName'] = 'core/columns';
        $wp_block['attrs'] = array();
        $wp_block['innerBlocks'] = array();
        $wp_block['innerContent'] = array();
        $wp_block['innerContent'][] = '<div class="wp-block-columns">';
        if (isset($block['children'])) {
          $wp_block['innerBlocks'] = $this->render_wp_blocks($block['children']);
          foreach ($wp_block['innerBlocks'] as $wp_column) {
            $wp_block['innerContent'][] = $wp_column['innerHTML'];
          }
        }
        $wp_block['innerContent'][] = '</div>';
        $wp_block['innerHTML'] = implode('', $wp_block['innerContent']);
        break;

      case 'column':
        $wp_block['blockName'] = 'core/column';
        $wp_block['attrs'] = array();
        // $wp_block['innerBlocks'] = array();
        // if (isset($block['children'])) {
        //   $wp_block['innerBlocks'] = $this->render_wp_blocks($block['children']);
        // }
        // $wp_block['innerHTML'] = '<div class="wp-block-column"></div>';
        // $wp_block['innerContent'] = array();
        // $wp_block['innerContent'][] = '<div class="wp-block-column">';
        // foreach ($wp_block['innerBlocks'] as $child) {
        //   $wp_block['innerContent'][] = '';
        // }
        // $wp_block['innerContent'][] = '</div>';

        $wp_block['innerBlocks'] = array();
        $wp_block['innerContent'] = array();
        $wp_block['innerContent'][] = '<div class="wp-block-column">';
        if (isset($block['children'])) {
          $wp_block['innerBlocks'] = $this->render_wp_blocks($block['children']);
          foreach ($wp_block['innerBlocks'] as $wp_column) {
            $wp_block['innerContent'][] = $wp_column['innerHTML'];
          }
        }
        $wp_block['innerContent'][] = '</div>';
        $wp_block['innerHTML'] = implode('', $wp_block['innerContent']);

        break;

    }

    return $wp_block;

  }

  /**
   * render wp blocks array
   */
  public function render_wp_blocks($blocks) {

    $wp_blocks = array();

    foreach ($blocks as $block) {

      $wp_block = $this->render_wp_block($block);

      if ($wp_block) {

        $wp_blocks[] = $wp_block;

      }

    }

    return $wp_blocks;

  }


}
