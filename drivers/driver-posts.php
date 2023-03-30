<?php



Class Karma_Fields_Alpha_Driver_Posts {

  // public function __construct() {

  //   add_filter('karma_fields_posts_driver_join_meta', function($value, $key, $id) {

  //     if ($key === '_wp_attachment_metadata') {
    
  //       $dir = dirname($value['file']);
    
  //       foreach ($value['sizes'] as $key => $size) {
    
  //         $value['sizes'][$key]['file'] = "$dir/{$value['sizes'][$key]['file']}";
    
  //       }
    
  //     }
    
  //   }, 10, 3);

  //   return $value;
  // }



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

      $args = array();

      $id = intval($id);

      $post_arr = get_post($id, ARRAY_A);

      if (!$post_arr) {
        die('Post not found!');
      }


      foreach ($data as $key => $value) {

        if (apply_filters('karma_fields_posts_driver_update', null, $value, $key, $id, $args, $data) === null) {

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

            case 'post_mime_type':
              break;

            case 'trash':
              if (intval($value[0])) {
                $post_type = get_post_type($id);
                update_post_meta($id, 'trash-post_type', $post_type);
                $args['post_type'] = 'karma-trash';
                // $wpdb->update($wpdb->posts, array('post_type' => 'karma-trash'), array('ID' => $id), array('%s'), array('%d'));

                // if ($post_type === 'attachment') {
                //   $rel_path = get_post_meta($id, '_wp_attached_file', true);
                //   $wp_upload_dir = wp_upload_dir();
                //   $dir = $wp_upload_dir['basedir'];
                //   $trash_dir = $dir.'/karma-trash';
                //   $path = get_attached_file($id);
                //   if (!file_exists($trash_dir)) {
                //     mkdir($trash_dir);
                //   }
                //   rename($path, $trash_dir.'/'.$rel_path);
                //   $meta = wp_get_attachment_metadata($id);
                //   $backup_sizes = get_post_meta($id, '_wp_attachment_backup_sizes', true);
                //   wp_delete_attachment_files($id, $meta, $backup_sizes, $path);
                // }
              } else {
                $post_type = get_post_meta($id, 'trash-post_type', true);
                if ($post_type) {
                  $args['post_type'] = $post_type;
                  // $wpdb->update($wpdb->posts, array('post_type' => $post_type), array('ID' => $id), array('%s'), array('%d'));
                  delete_post_meta($id, 'trash-post_type');
                  // if ($post_type === 'attachment') {
                  //   $rel_path = get_post_meta($id, '_wp_attached_file', true);
                  //   $wp_upload_dir = wp_upload_dir();
                  //   $dir = $wp_upload_dir['basedir'];
                  //   $trash_dir = $dir.'/karma-trash';
                  //   rename($trash_dir.'/'.$rel_path, $dir.'/'.$rel_path);
                  //   if (!function_exists('wp_generate_attachment_metadata')) {
                  //     include ABSPATH . 'wp-admin/includes/image.php';
                  //   }
                  //   $path = $dir.'/'.$rel_path;
                  //   $metadata = wp_generate_attachment_metadata($id, $path);
                  //   wp_update_attachment_metadata($id,  $metadata);
                  // }
                }
              }
              break;

            default:

              if (taxonomy_exists($key)) { // -> taxonomy

                $value = array_filter(array_map('intval', $value));

                wp_set_post_terms($id, $value, $key);

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

      if ($args) {
      //
      //   $args['ID'] = $id;
      //
      //   if (empty($args['post_type'])) {
      //
      //     $args['post_type'] = $post->post_type; // -> for attachments
      //     $args['post_mime_type'] = $post->post_mime_type; // -> for attachments
      //
      //   }
      //
      //   if (empty($args['post_status'])) {
      //
      //     $args['post_status'] = $post->post_status; // -> for folders
      //
      //   }


        $args = array_merge($post_arr, $args);

        wp_insert_post($args);

      }


    return true;
  }



  /**
	 * add
	 */
  public function add($data, $deprecatednum = 1) {

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


    // var_dump($args, $data);

    return wp_insert_post($args);


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
      'update_post_meta_cache' => false
    );

    foreach ($params as $key => $value) {

      switch ($key) {

        case 'driver':
        case 'karma':
          break;

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

            case 'post_author':
              $args['orderby'] = array('author' => $params['order'], 'title' => 'ASC', 'date' => 'DESC');
              break;

            case 'meta_value':
              $args['orderby'] = array('meta_value' => $params['order']);
              break;

            // case 'post_type': // -> for medias
            //   $args['orderby'] = array('post_type' => 'DESC', 'date' => 'DESC');
            //   break;

            default:
              // todo: handle numeric meta, taxonomies
              $args['orderby'] = array('metavalue' => $params['order'], 'title' => 'ASC', 'date' => 'DESC');
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
          $args['p'] = intval($value);
          break;

        case 'ids':
          $args['post__in'] = array_map('intval', explode(',', $value));
          break;

        case 'post_date':
          $args['m'] = $value; // ex:201307
          break;

        case 'post_mime_type':
          $args[$key] = $value;
          break;

        case 'post_status':
        case 'post_type':
          if (!is_array($value)) {
            $value = explode(',', $value);
          }
          $args[$key] = $value;
          break;

        case 'post_parent':
        case 'post_author':
          $args[$key] = intval($value);
          break;

        case 'search':
          $args['s'] = $value;
          break;

        case 'post_name':
          break;

        case 'meta_key': 
          $args['meta_key'] = $value;
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

    $query = new WP_Query($args);

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



  /**
	 * meta relations
	 */
  public function meta($params) {
    global $wpdb;

    $ids = explode(',', $params['ids']);
    $ids = array_filter($ids);

    if ($ids) {

      $ids = array_map('intval', $ids);
      $ids = implode(',', $ids);

      $sql = "SELECT
        meta_value AS 'value',
        meta_key AS 'key',
        post_id AS 'id'
        FROM $wpdb->postmeta
        WHERE post_id IN ($ids) AND meta_key != '_wp_attachment_metadata'";

			$results = $wpdb->get_results($sql);

      foreach ($results as $result) {

        $result->value = maybe_unserialize($result->value);

        $result->value = apply_filters('karma_fields_posts_driver_join_meta', $result->value, $result->key, $result->id);

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

}
