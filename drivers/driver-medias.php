<?php

// https://stackoverflow.com/a/38088630/2086505
// https://developer.wordpress.org/reference/functions/wp_generate_attachment_metadata/

Class Karma_Fields_Alpha_Driver_Medias {

  /**
	 * get
	 */
  public function get($path) {
    global $wpdb;

    list($id, $key) = explode('/', $path);

    $key = esc_sql($key);
    $id = intval($id);

    $thumb_src_data = wp_get_attachment_image_src($id, 'thumbnail', true);
    $filename = get_attached_file($id);

    switch($key) {

      case 'title':
        return get_the_title($id);
      case 'caption':
        return wp_get_attachment_caption($id);
      case 'type':
        return get_post_mime_type($id);
      case 'src':
        return $thumb_src_data[0];
      case 'width':
        return $thumb_src_data[1];
      case 'height':
        return $thumb_src_data[2];
      case 'original_src':
        return wp_get_attachment_url($id);
      case 'relative_path':
        return get_post_meta($id, '_wp_attached_file', true);
      case 'size':
        return getimagesize($filename);
      case 'sources':
        return $this->get_image_source($id);
      case 'metadata':
        return wp_get_attachment_metadata($id);
      case 'filename':
        return $filename;
      default:
        return get_post_meta($id, $key);

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

        if (apply_filters('karma_fields_attachments_driver_update', null, $value, $key, $id, $args) === null) {

          switch ($key) {

            case 'filename':
              break;

            case 'trash':
              $args['post_type'] = intval($value[0]) ? 'karma-trash' : 'attachment';
              break;

            case 'post_title':
            case 'post_content':
            case 'post_excerpt':
              $args[$key] = $value[0];
              break;

            default:

              if (taxonomy_exists($key)) { // -> taxonomy

                $value = array_filter(array_map('intval', $value));

                wp_set_post_terms($id, $value, $key);

              } else { // -> meta

                $value = apply_filters('karma_fields_attachments_driver_update_meta', $value, $key, $id);

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
	 * query
	 */
  public function get_query_args($params) {

    $output = array();

    $args = array();

    $args['post_status'] = array('publish', 'pending', 'draft', 'future');
    $args['post_type'] = 'posts';



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

            case 'filename':
              $args['orderby'] = array('metavalue' => $params['order'], 'date' => 'DESC');
              $args['meta_key'] = '_wp_attached_file';
              break;

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

        case 'post_date':
          $args['m'] = $value; // ex:201307
          break;

        case 'search':
          $args['s'] = $value;
          break;

        case 'post_name':
        case 'post_status':
        case 'post_type':
        case 'post_parent':
        case 'post_author':
          break;

        case 'mimetype':
          break;

        case 'directory':
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

      }

    }

    $args['post_status'] = 'inherit';
    $args['post_type'] = 'attachment';

    $args = apply_filters('karma_fields_attachments_driver_query_table', $args, $params);

    // var_dump($args, $params);


    // $query = new WP_Query($args);
    //
    // $output['sql'] = $query->request;
    // $output['items'] = $query->posts;
    // $output['count'] = $query->found_posts;
    //
    //
    // return $query->posts;

    return $args;

  }

  /**
	 * query
	 */
  public function query($params) {

    $args = $this->get_query_args($params);
    $args['no_found_rows'] = true;
    $query = new WP_Query($args);

    return array_map(function($post) {
      return array(
        'id' => $post->ID,
        'post_title' => $post->post_title,
        'post_status' => $post->post_status,
        'post_date' => $post->post_date
      );
    }, $query->posts);

  }

  /**
	 * count
	 */
  public function count($params) {

    $args = $this->get_query_args($params);
    $args['fields'] = 'ids';
    $query = new WP_Query($args);

    return $query->found_posts;

  }



  /**
	 * relations
	 */
  public function relations($params) {
    global $wpdb;

    $ids = array_map('intval', explode(',', $params['ids']));

    if ($ids) {

      $sql_ids = implode(',', $ids);

			$sql = "SELECT $wpdb->posts.* FROM $wpdb->posts WHERE ID IN ($sql_ids)";

			$attachments = $wpdb->get_results($sql);

			if ($attachments) {

				update_post_caches($attachments, 'any', false, true);

			}

      $images = array();

      foreach ($attachments as $attachment) {

        $attachment = get_post($attachment->ID);
        // $thumb_src_data = wp_get_attachment_image_src($attachment->ID, 'thumbnail', true);
        $filename = get_attached_file($attachment->ID);
        $metadata = wp_get_attachment_metadata($attachment->ID);
        $file_url = wp_get_attachment_url($attachment->ID);


        $image = array(
          'id' => $attachment->ID,
          'title' => get_the_title($attachment),
          'caption' => wp_get_attachment_caption($attachment->ID), // = post_excerpt
          'type' => get_post_mime_type($attachment),
          // 'src' => $thumb_src_data[0],
          // 'width' => $thumb_src_data[1],
          // 'height' => $thumb_src_data[2],
          'src' => $file_url,
          'width' => $metadata['width'],
          'height' => $metadata['height'],
          'thumb_src' => dirname($file_url).'/'.$metadata['sizes']['thumbnail']['file'],
          'thumb_width' => $metadata['sizes']['thumbnail']['width'],
          'thumb_height' => $metadata['sizes']['thumbnail']['height'],
          'filename' => get_post_meta($attachment->ID, '_wp_attached_file', true),
          'size' => intval(filesize($filename)/1000).' KB'
          // 'metadata' => $metadata
        );

        // if (isset($params['sources']) && $params['sources']) {
        //
        //   $img_sizes = is_array($params['sources']) ? $params['sources'] : array(
        //     'medium',
        //     'medium_large',
        //     'large',
        //     '1536x1536',
        //     '2048x2048'
        //   );
        //
        //   $img_sizes = apply_filters('karma_fields_attachment_driver_image_sizes', $img_sizes, $image, $params);
        //
        //   $image['sources'] = $this->get_image_source($attachment->ID, $img_sizes);
        //
        // }

        $images[] = $image;

      }

      return $images;

    } else {

      return array();

    }




  }



  /**
	 * fetch
	 */
  public function fetch($request, $params) {
    global $wpdb;

    if (isset($params['ids'])) {


      $ids = explode(',', $params['ids']);
      $ids = array_map('intval', $ids);
      $ids = array_filter($ids);

      if ($ids) {

        $ids = implode(',', $ids);

  			$sql = "SELECT $wpdb->posts.* FROM $wpdb->posts WHERE ID IN ($ids)";

  			$attachments = $wpdb->get_results($sql);

  			if ($attachments) {

  				update_post_caches($attachments, 'any', false, true);

  			}

        $images = array();

        foreach ($attachments as $attachment) {

          $attachment = get_post($attachment->ID);
          $thumb_src_data = wp_get_attachment_image_src($attachment->ID, 'thumbnail', true);

          $image = array(
            'id' => $attachment->ID,
            'title' => get_the_title($attachment),
            'caption' => wp_get_attachment_caption($attachment->ID), // = post_excerpt
            'type' => get_post_mime_type($attachment),
            'src' => $thumb_src_data[0],
            'width' => $thumb_src_data[1],
            'height' => $thumb_src_data[2],
            'original_src' => wp_get_attachment_url($attachment->ID)
          );

          if (isset($params['sources']) && $params['sources']) {

            $img_sizes = is_array($params['sources']) ? $params['sources'] : array(
              'medium',
              'medium_large',
              'large',
              '1536x1536',
              '2048x2048'
            );

            $img_sizes = apply_filters('karma_fields_attachment_driver_image_sizes', $img_sizes, $image, $params);

            $image['sources'] = $this->get_image_source($attachment->ID, $img_sizes);

          }

          $images[] = $image;

        }

        return $images;

      } else {

        return array();

      }


    }

  }


  /**
	 * Get image sources
	 */
	public function get_image_source($img_id, $img_sizes = null, $type = null) {
		static $baseurl;

		if (!isset($baseurl)) {

			$uploads = wp_get_upload_dir();
			$baseurl = $uploads['baseurl'] . '/';

		}

		$sources = array();

		$metadata = wp_get_attachment_metadata($img_id);
		$path = '';
		$file = get_post_meta($img_id, '_wp_attached_file', true);

    if (!isset($type)) {

      $type = get_post_mime_type($img_id);

    }

		if ($type === 'image/jpeg' || $type === 'image/jpg' || $type === 'image/png') {

			if (!$img_sizes) {

				$img_sizes = get_intermediate_image_sizes();

			}

			$basename = basename($file);
			$path = str_replace($basename, '', $file);

			foreach ($img_sizes as $img_size) {

				if (isset($metadata['sizes'][$img_size])) {

					$sources[] = array(
						'src' => $baseurl . $path . $metadata['sizes'][$img_size]['file'],
						'width' => $metadata['sizes'][$img_size]['width'],
						'height' => $metadata['sizes'][$img_size]['height']
					);

				}

			}

		  // full ->
			$sources[] = array(
				'src' => $baseurl . $file,
				'width' => $metadata['width'],
				'height' => $metadata['height']
			);

		}

		return $sources;

	}




}
