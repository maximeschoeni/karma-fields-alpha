<?php



class Karma_Fields_Alpha_Driver_Taxonomy {

  /**
	 * update
	 */
  public function update($data, $id) {
    global $wpdb;

    // foreach ($data as $id => $item) {
                        //
                        //
    										// var_dump($id, get_current_user_id(), current_user_can('edit_term', $id));
    										// die();


    if (!current_user_can('edit_term', $id)) {

      return false;

    }

    // var_dump(current_user_can('edit_term', $id)); die();

    // var_dump(current_user_can('manage_categories')); die();
//
    // if (!current_user_can('edit_posts')) {
    //
    //   return false;
    //
    // }


    $trash_prefix = '_trashed_';




    if (isset($data['trash'])) {

      if ($data['trash'] && $data['trash'][0] === '1') {

        $term = get_term($id);

        if ($term) {

          $wpdb->update($wpdb->term_taxonomy, array('taxonomy' => "$trash_prefix$term->taxonomy"), array('term_id' => $id), array('%s'), array('%d'));

        } // else term is probably already trashed...

        return true;

      } else {

        $id = intval($id);
        $trashed_taxonomy = $wpdb->get_var("SELECT taxonomy FROM $wpdb->term_taxonomy WHERE term_id = $id AND taxonomy LIKE '$trash_prefix%'");

        if ($trashed_taxonomy) {

          $taxonomy = substr($trashed_taxonomy, strlen($trash_prefix));

          $wpdb->update($wpdb->term_taxonomy, array('taxonomy' => $taxonomy), array('term_id' => $id), array('%s'), array('%d'));

        }

      }

    }



      $args = array();

      $id = intval($id);

      $term = get_term($id);




      foreach ($data as $key => $value) {

        if (apply_filters('karma_fields_taxonomy_driver_update', null, $value, $key, $id, $args) === null) {

          switch ($key) {

            case 'trash':
              break;

            case 'parent':
            case 'name':
            case 'slug':
            case 'description':
              $args[$key] = $value[0];
              break;

            default:

              $value = apply_filters('karma_fields_taxonomy_driver_update_meta', $value, $key, $id);

              $meta_ids = $wpdb->get_col( $wpdb->prepare( "SELECT meta_id FROM $wpdb->termmeta WHERE meta_key = %s AND term_id = %d", $key, $id ) );

              for ( $i = 0; $i < max(count($value), count($meta_ids)); $i++ ) {

                if (isset($value[$i], $meta_ids[$i])) {

                  update_metadata_by_mid( 'term', $meta_ids[$i], $value[$i]);

                } else if (isset($value[$i])) {

                  add_metadata( 'term', $id, $key, $value[$i] );

                } else if (isset($meta_ids[$i])) {

                  delete_metadata_by_mid( 'term', $meta_ids[$i] );

                }

              }

          }

        }

      }

      if ($args) {

        $r = wp_update_term($id, $term->taxonomy, $args);

      }

    // wp_update_term() doesn't work if this is placed before !
    if (isset($data['taxonomy'][0])) {

      $r = $wpdb->update($wpdb->term_taxonomy, array('taxonomy' => $data['taxonomy'][0]), array('term_id' => $id), array('%s'), array('%d'));

    }

    return true;
  }

  /**
	 * add
	 */
  public function add($data) {
    global $wpdb;

    if (!current_user_can('manage_categories')) {

      return false;

    }

    // $uid = uniqid();
    // $name = "[new term $uid]";
    $taxonomy = 'post_tag';


    // $results = wp_insert_term($name, $taxonomy);



    $wpdb->insert($wpdb->terms, array('name' => ''), array('%s'));

    $term_id = (int) $wpdb->insert_id;

    $wpdb->insert($wpdb->term_taxonomy, array('taxonomy' => $taxonomy, 'term_id' => $term_id), array('%s', '%d'));

    return $term_id;
		// return new WP_Error( 'db_insert_error', __( 'Could not insert term into the database.' ), $wpdb->last_error );

    // return $results['term_id'];

  }



  // /** DEPRECATED
	//  * join
	//  */
  // public function join($params) {
  //   global $wpdb;
  //
  //   $ids = explode(',', $params['ids']);
  //   $ids = array_filter($ids);
  //
  //   if ($ids) {
  //
  //     $ids = array_map('intval', $ids);
  //     $sql_ids = implode(',', $ids);
  //
  //     $sql = "SELECT
  //       tt.taxonomy AS 'key',
  //       tt.term_id AS 'value',
  //       tr.object_id AS 'id'
  //       FROM $wpdb->term_relationships AS tr
  //       INNER JOIN $wpdb->term_taxonomy AS tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
  //       WHERE tr.object_id IN ($sql_ids)";
  //
	// 		$results = $wpdb->get_results($sql);
  //
  //     return $results;
  //
  //   } else {
  //
  //     return array();
  //
  //   }
  //
  //
  //
  //
  // }


  //
  // /**
	//  * query
	//  */
  // public function query($params) {
  //
  //   $params = apply_filters('karma_fields_driver_taxonomy_query_params', $params);
  //
  //   $args = array(
  //     'hide_empty' => false
  //   );
  //
  //   foreach ($params as $key => $value) {
  //
  //     switch ($key) {
  //
  //       case 'taxonomy':
  //         $args['taxonomy'] = $value;
  //         break;
  //
  //       case 'ppp':
  //         $args['number'] = intval($value);
  //         break;
  //
  //       case 'page':
  //         $args['offset'] = isset($params['ppp']) ? (intval($value)-1)*intval($params['ppp']) : '0';
  //         break;
  //
  //       case 'order':
  //         $args['order'] = $value === 'desc' ? 'desc' : 'asc';
  //         break;
  //
  //       case 'orderby':
  //         switch ($value) {
  //           case 'name':
  //           case 'slug':
  //           case 'id':
  //             $args['orderby'] = $value;
  //             break;
  //
  //           default:
  //             $args['orderby'] = 'meta_value';
  //             $args['meta_key'] = $value;
  //             break;
  //
  //         }
  //         break;
  //
  //       default:
  //         $args['meta_query'] = array(
  //           array(
  //            'key'       => $key,
  //            'value'     => $value,
  //            'compare'   => '='
  //           )
  //         );
  //         break;
  //
  //
  //
  //
  //
  //     }
  //
  //   }
  //
  //   $terms = get_terms($args);
  //
  //   $output = array();
  //
  //   if ($terms && !is_wp_error($terms)) {
  //
  //     foreach ($terms as $term) {
  //
  //       $output[] = array(
  //         'id' => (string) $term->term_id,
  //         'slug' => $term->slug,
  //         'name' => $term->name,
  //         'description' => $term->description,
  //         'taxonomy' => $term->taxonomy
  //       );
  //
  //     }
  //
  //   }
  //
  //   $output = apply_filters('karma_fields_driver_taxonomy_query_results', $output, $terms, $params);
  //
  //   return $output;
  //
  // }


  /**
	 * get args
	 */
  public function get_args($params) {

    $params = apply_filters('karma_fields_driver_taxonomy_query_params', $params);

    $args = array(
      'hide_empty' => false
    );

    foreach ($params as $key => $value) {

      switch ($key) {

        case 'driver':
          break;

        case 'taxonomy':
          $args['taxonomy'] = $value;
          break;

        case 'ppp':
          $args['number'] = intval($value);
          break;

        case 'page':
          $args['offset'] = isset($params['ppp']) ? (intval($value)-1)*intval($params['ppp']) : '0';
          break;

        case 'order':
          $args['order'] = $value === 'desc' ? 'desc' : 'asc';
          break;

        case 'orderby':
          switch ($value) {
            case 'name':
            case 'slug':
            case 'id':
              $args['orderby'] = $value;
              break;

            default:
              $args['orderby'] = 'meta_value';
              $args['meta_key'] = $value;
              break;

          }
          break;

        case 'search':
          $args['search'] = $value;
          break;

        case 'ids':
        case 'id':
          $args['include'] = explode(',', $value);
          break;

        default:
          $args['meta_query'] = array(
            array(
             'key'       => $key,
             'value'     => $value,
             'compare'   => '='
            )
          );
          break;





      }

    }

    return $args;

  }

  /**
	 * query
	 */
  public function query($params) {

    $args = $this->get_args($params);

    // $args['update_term_meta_cache'] = false;






    $terms = get_terms($args);

    // $attachment_terms = get_attachment_taxonomies($args);
    //
    // var_dump($args, $attachment_terms);

    $output = array();

    if ($terms && !is_wp_error($terms)) {

      foreach ($terms as $term) {

        $output[] = array(
          'id' => (string) $term->term_id, // -> compat
          'term_id' => (string) $term->term_id,
          'slug' => $term->slug,
          'name' => $term->name,
          'description' => $term->description,
          'taxonomy' => $term->taxonomy
        );

      }

    }

    $output = apply_filters('karma_fields_driver_taxonomy_query_results', $output, $terms, $params);

    return $output;

  }

  /**
	 * query
	 */
  public function count($params) {

    $args = $this->get_args($params);

    $args['update_term_meta_cache'] = false;
    $args['fields'] = 'tt_ids';
    $args['number'] = '';
    $args['offset'] = '0';

    $terms = get_terms($args);
    //
    // var_dump($terms);
    // die();

    return count($terms);

  }





  /** DEPRECATED
	 * fetch
	 */
  // public function fetch($params) {

  //   if (isset($params['key']) || isset($params['taxonomy'])) {

  //     $taxonomy = $params['key'] ?? $params['taxonomy'];

  //     $terms = get_terms(array(
  //       'taxonomy' => $taxonomy,
  //       'hide_empty' => false
  //     ));



  //     $results = array();
  //     $results['items'] = array();

  //     if (is_wp_error($terms)) {

  //       $results['error'] = $terms;
  //       $results['taxonomy'] = $taxonomy;

  //     } else if ($terms) {

  //       foreach ($terms as $term) {

  //         $results['items'][] = array(
  //           'key' => $term->term_id,
  //           'name' => $term->name
  //         );

  //       }

  //       $results = apply_filters('karma_fields_driver_taxonomy_query_key_results', $results, $terms, $taxonomy, $params);

  //     }

  //     return $results;
  //   }


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
        tm.meta_value AS 'value',
        tm.meta_key AS 'key',
        tm.term_id AS 'id'
        FROM $wpdb->termmeta AS tm
        WHERE tm.term_id IN ($ids)";

			$results = $wpdb->get_results($sql);

      return $results;

    } else {

      return array();

    }


  }




}
