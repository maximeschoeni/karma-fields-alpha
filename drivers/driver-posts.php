<?php



Class Karma_Fields_Driver_Posts {


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

      $post = get_post($id);

      if ($post) {

        if ($this->is_postfield($key)) {

          return $post->$key;

        } else if (taxonomy_exists($key)) {

          $terms = get_the_terms();

          if ($terms && !is_wp_error($terms)) {

            return array_map(function($term) {
              return $term->term_id;
            }, $terms);

          }

        } else {

          $meta = get_post_meta($post->ID, $key);

          if (count($meta) === 1) {

            return $meta[0];

          } else if (count($meta) > 1) {

            return $meta;

          } else {

            return '';

          }

        }

      }

    }

  }

  /**
	 * update
	 */
  public function update($data) {

    foreach ($data as $id => $item) {

      $args = array();

      $id = intval($id);

      foreach ($item as $key => $value) {

        switch ($key) {

          case 'post_name':
          case 'post_title':
          case 'post_content':
          case 'post_excerpt':
          case 'post_date':
          case 'post_status':
          case 'post_type':
            $args[$key] = $value;
            break;

          case 'post_parent':
          case 'post_author':
          case 'menu_order':
            $args[$key] = intval($value);
            break;

          default:

            if (taxonomy_exists($key) && is_array($value)) {

              $value = array_filter(array_map('intval', $value));

              wp_set_post_terms($id, $value, $key);

            } else {

              if (is_array($value) && array_filter($value, 'intval')) {

                $current_value = get_post_meta($id, $key);

                $to_delete = array_diff($current_value, $value);

                $to_add = array_diff($value, $current_value);

                foreach ($to_delete as $val) {

                  delete_post_meta($id, $key, $val);

                }

                foreach ($to_add as $val) {

                  add_post_meta($id, $key, $val);

                }

              } else {

                update_post_meta($id, $key, $value);

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

    return $id;

  }

  /**
	 * fetch
	 */
  public function fetch($request, $params) {

    switch($request) {

      'querytable':
        return $this->query_table($params);

      'querykey':
        return $this->query_key($params);

      'queryfiles':
        return $this->query_files($params);

    }

  }



  /**
	 * query
	 */
  public function query_table($params) {

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
	 * query_key
	 */
  public function query_key($params) {
    global $wpdb;

    $key = isset($params['key']) ? $params['key'] : null;

    if ($key === 'post_status') {

      return array(
        'items' => array(
          array(
            'key' => 'draft',
            'name' => 'Draft'
          ),
          array(
            'key' => 'publish',
            'name' => 'Publish'
          ),
          array(
            'key' => 'pending',
            'name' => 'Pending'
          ),
          array(
            'key' => 'trash',
            'name' => 'Trash'
          )
        )
      );

    } else if (taxonomy_exists($key)) {

      $args = array(
        'taxonomy' => $key,
        'hide_empty' => false,
      );

      $args = apply_filters('karma_fields_query_key_taxonomy_args', $args, $params);

      $terms = get_terms($args);

      if ($terms && !is_wp_error($terms)) {

        return array(
          'items' => array_map(function($term) {
            return array(
              'key' => $term->term_id,
              'name' => $term->name
            );
          }, $terms)
        );

      }

    } else {

      do_action('karma_fields_query_key', $key, $params);

    }

  }

  /**
	 * query_key
	 */
  public function query_files($params) {
    global $wpdb;

    $ids = isset($params['ids']) ? $params['ids'] : array;

    if ($ids) {

      $sql_ids = implode(",", array_map('intval', $ids));

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






}
