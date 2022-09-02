<?php

// https://stackoverflow.com/a/38088630/2086505
// https://developer.wordpress.org/reference/functions/wp_generate_attachment_metadata/

include_once KARMA_FIELDS_ALPHA_PATH.'/drivers/driver-posts.php';

Class Karma_Fields_Alpha_Driver_Medias extends Karma_Fields_Alpha_Driver_Posts {

  /**
	 * get
	 */
  public function get($id) {

    $post = get_post($id);

    if ($post) {

      if ($post->post_type === 'attachment') {

        $name = get_post_meta($post->ID, '_wp_attached_file', true);

      } else {

        $name = $post->post_title;

      }

      return array(
        'id' => (string) $post->ID,
        'name' => $name,
        'date' => $post->post_date,
        'parent' => (string) $post->post_parent
      );

    }

  }

  /**
	 * update
	 */
  public function update($data, $id) {

    // foreach ($data as $id => $row) {

      if (isset($data['parent'])) {

        $data['post_parent'] = $data['parent'];

      }

      if (isset($data['date'])) {

        $data['post_dte'] = $data['date'];

      }

    // }

    parent::update($data, $id);

  }


  /**
	 * query
	 */
  public function get_query_args($params) {

    // if (isset($params['orderby']) && $params['orderby'] === 'date') {
    //
    //   $params['orderby'] === 'post_date';
    //
    // }
    //
    // if (isset($params['parent'])) {
    //
    //   $params['post_parent'] === $params['parent'];
    //
    // }
    //
    // $args = parent::get_query_args($params);
    //
    // return $args;

    // $params['post_type'] = array('attachment', 'karma-folder');
    // $params['post_status'] = array('inherit');
    // $params['orderby'] = $params['orderby'] ?? 'post_type';

    if (isset($params['parent'])) {

      $args = array(
        'orderby' => array('post_type' => 'DESC', 'date' => 'DESC'),
        'post_status' => array('inherit'),
        'post_type' => array('attachment', 'karma-folder'),
        'posts_per_page' => -1,
        'cache_results' => false,
        'update_post_term_cache' => false,
        'update_post_meta_cache' => false
      );

      foreach ($params as $key => $value) {

        switch ($key) {

          case 'driver':
          case 'table':
          case 'post_name':
          case 'post_content':
          case 'post_status':
          case 'post_title':
          case 'post_type':
          case 'order':
            break;

          case 'orderby':

            switch ($value) {

              case 'post_type':
                $args['orderby'] = array('post_type' => 'DESC', 'date' => 'DESC');
                break;

              case "name":
                $args['orderby'] = array('metavalue' => $params['order'], 'date' => 'DESC');
                $args['meta_key'] = '_wp_attached_file';
                break;

              default:
                // -> assume metakey
                // -> table should not request default orderby !
                // $args['orderby'] = array('metavalue' => $params['order'], 'date' => 'DESC');
                // $args['meta_key'] = $value;
                // break;

            }

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

          case 'date':
            $args['m'] = $value; // ex:201307
            break;

          case 'mime_type':
            $args['post_mime_type'] = $value;
            break;

          case 'parent':
            $args['post_parent'] = intval($value);
            break;

          case 'search':
            $args['s'] = $value;
            break;

          case 'post_excerpt':
          case 'caption':
            $args['post_excerpt'] = $value;
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

      $args = apply_filters('karma_fields_medias_driver_query_args', $args, $params);

      return $args;

    } else {

      $params['post_type'] = 'attachment';
      $params['post_status'] = 'inherit';

      return parent::get_query_args($params);

    }

  }

  /**
	 * query
	 */
  public function query($params) {

    // posts?post_type=attachment,karma-folder&post_status=inherit&orderby=post_type
    //
    // if (isset($params['parent'])) {
    //
    //   $params['post_parent'] === $params['parent'];
    //
    //   $params['post_type'] = array('attachment', 'karma-folder');
    //
    //
    //
    // }
    //
    // $params['post_type'] = array('attachment', 'karma-folder');
    // $params['post_status'] = array('inherit');
    // $params['orderby'] = $params['orderby'] ?? 'post_type';

    $results = parent::query($params);

    return array_map(function($post) {
      return array(
        'id' => (string) $post['id'],
        'date' => $post['post_date'],
        'parent' => (string) $post['post_parent']
      );
    }, $results);


  }



}
