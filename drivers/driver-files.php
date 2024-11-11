<?php

// https://stackoverflow.com/a/38088630/2086505
// https://developer.wordpress.org/reference/functions/wp_generate_attachment_metadata/

class Karma_Fields_Alpha_Driver_Files {

  // /**
	//  * get
	//  */
  // public function get($path) {
  //   global $wpdb;
  //
  //   list($id, $key) = explode('/', $path);
  //
  //   $key = esc_sql($key);
  //   $id = intval($id);
  //
  //   $thumb_src_data = wp_get_attachment_image_src($id, 'thumbnail', true);
  //   $filename = get_attached_file($id);
  //
  //   switch($key) {
  //
  //     case 'title':
  //       return get_the_title($id);
  //     case 'caption':
  //       return wp_get_attachment_caption($id);
  //     case 'type':
  //       return get_post_mime_type($id);
  //     case 'src':
  //       return $thumb_src_data[0];
  //     case 'width':
  //       return $thumb_src_data[1];
  //     case 'height':
  //       return $thumb_src_data[2];
  //     case 'original_src':
  //       return wp_get_attachment_url($id);
  //     case 'relative_path':
  //       return get_post_meta($id, '_wp_attached_file', true);
  //     case 'size':
  //       return getimagesize($filename);
  //     case 'sources':
  //       return $this->get_image_source($id);
  //     case 'metadata':
  //       return wp_get_attachment_metadata($id);
  //     case 'filename':
  //       return $filename;
  //     default:
  //       return get_post_meta($id, $key);
  //
  //   }
  //
  //
  // }
  //
  // /**
	//  * update
	//  */
  // public function update($data) {
  //   global $wpdb;
  //
  //   foreach ($data as $id => $item) {
  //
  //     $args = array();
  //
  //     $id = intval($id);
  //
  //     foreach ($item as $key => $value) {
  //
  //       if (apply_filters('karma_fields_attachments_driver_update', null, $value, $key, $id, $args) === null) {
  //
  //         switch ($key) {
  //
  //           case 'filename':
  //             break;
  //
  //           case 'trash':
  //             $args['post_type'] = intval($value[0]) ? 'karma-trash' : 'attachment';
  //             break;
  //
  //           case 'post_title':
  //           case 'post_content':
  //           case 'post_excerpt':
  //             $args[$key] = $value[0];
  //             break;
  //
  //           default:
  //
  //             if (taxonomy_exists($key)) { // -> taxonomy
  //
  //               $value = array_filter(array_map('intval', $value));
  //
  //               wp_set_post_terms($id, $value, $key);
  //
  //             } else { // -> meta
  //
  //               $value = apply_filters('karma_fields_attachments_driver_update_meta', $value, $key, $id);
  //
  //               $meta_ids = $wpdb->get_col( $wpdb->prepare( "SELECT meta_id FROM $wpdb->postmeta WHERE meta_key = %s AND post_id = %d", $key, $id ) );
  //
  //               for ( $i = 0; $i < max(count($value), count($meta_ids)); $i++ ) {
  //
  //                 if (isset($value[$i], $meta_ids[$i])) {
  //
  //                   update_metadata_by_mid( 'post', $meta_ids[$i], $value[$i]);
  //
  //                 } else if (isset($value[$i])) {
  //
  //                   add_metadata( 'post', $id, $key, $value[$i] );
  //
  //                 } else if (isset($meta_ids[$i])) {
  //
  //                   delete_metadata_by_mid( 'post', $meta_ids[$i] );
  //
  //                 }
  //
  //               }
  //
  //             }
  //
  //         }
  //
  //       }
  //
  //     }
  //
  //     if ($args) {
  //
  //       $args['ID'] = $id;
  //
  //       wp_insert_post($args);
  //
  //     }
  //
  //   }
  //
  //   return true;
  // }
  //
  //
  // /**
	//  * query
	//  */
  // public function get_query_args($params) {
  //
  //   $output = array();
  //
  //   $args = array();
  //
  //   $args['post_status'] = array('publish', 'pending', 'draft', 'future');
  //   $args['post_type'] = 'posts';
  //
  //
  //
  //   foreach ($params as $key => $value) {
  //
  //     switch ($key) {
  //
  //       case 'driver':
  //       case 'karma':
  //         break;
  //
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
  //           case 'filename':
  //             $args['orderby'] = array('metavalue' => $params['order'], 'date' => 'DESC');
  //             $args['meta_key'] = '_wp_attached_file';
  //             break;
  //
  //           default:
  //             // todo: handle numeric meta, taxonomies
  //             $args['orderby'] = array('metavalue' => $params['order'], 'title' => 'ASC', 'date' => 'DESC');
  //             $args['meta_key'] = $value;
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
  //       case 'post_date':
  //         $args['m'] = $value; // ex:201307
  //         break;
  //
  //       case 'search':
  //         $args['s'] = $value;
  //         break;
  //
  //       case 'post_name':
  //       case 'post_status':
  //       case 'post_type':
  //       case 'post_parent':
  //       case 'post_author':
  //         break;
  //
  //       case 'mimetype':
  //         break;
  //
  //       case 'directory':
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
  //         } else {
  //
  //           $args['meta_query'][] = array(
  //             'key' => $key,
  //             'value' => $value
  //           );
  //
  //         }
  //
  //     }
  //
  //   }
  //
  //   $args['post_status'] = 'inherit';
  //   $args['post_type'] = 'attachment';
  //
  //   $args = apply_filters('karma_fields_attachments_driver_query_table', $args, $params);
  //
  //   // var_dump($args, $params);
  //
  //
  //   // $query = new WP_Query($args);
  //   //
  //   // $output['sql'] = $query->request;
  //   // $output['items'] = $query->posts;
  //   // $output['count'] = $query->found_posts;
  //   //
  //   //
  //   // return $query->posts;
  //
  //   return $args;
  //
  // }
  //
  // /**
	//  * query
	//  */
  // public function query($params) {
  //
  //   $args = $this->get_query_args($params);
  //   $args['no_found_rows'] = true;
  //   $query = new WP_Query($args);
  //
  //   return array_map(function($post) {
  //     return array(
  //       'id' => $post->ID,
  //       'post_title' => $post->post_title,
  //       'post_status' => $post->post_status,
  //       'post_date' => $post->post_date
  //     );
  //   }, $query->posts);
  //
  // }
  //
  // /**
	//  * count
	//  */
  // public function count($params) {
  //
  //   $args = $this->get_query_args($params);
  //   $args['fields'] = 'ids';
  //   $query = new WP_Query($args);
  //
  //   return $query->found_posts;
  //
  // }

  /**
	 * relations
	 */
  public function join($params) {
    global $wpdb;

    $results = array();

    $ids = array_map('intval', explode(',', $params['ids']));

    if ($ids) {

      $sql_ids = implode(',', $ids);

			$sql = "SELECT $wpdb->posts.* FROM $wpdb->posts WHERE ID IN ($sql_ids)";

			$attachments = $wpdb->get_results($sql);

			if ($attachments) {

				update_post_caches($attachments, 'any', false, true);

			}

      $upload_dir = wp_get_upload_dir()['basedir'];

      foreach ($attachments as $attachment) {

        $attachment = get_post($attachment->ID);

        if ($attachment->post_type === 'attachment') {

          // $filename = get_attached_file($attachment->ID);
          $filename = get_post_meta($attachment->ID, '_wp_attached_file', true);
          $metadata = wp_get_attachment_metadata($attachment->ID);

          $file = $upload_dir.'/'.$filename; // -> just for size
          // $file_url = wp_get_attachment_url($attachment->ID);
          // $thumb_data = wp_get_attachment_image_src($attachment->ID, 'thumbnail', true);

          if (isset($metadata['sizes']) && $metadata['sizes']) {

            $dir = dirname($filename);

            foreach ($metadata['sizes'] as $key => $size) {

              $results[] = array(
                'id' => $attachment->ID,
                'key' => 'sizes',
                'value' => array(
                  'key' => $key,
                  'filename' => $dir.'/'.$size['file'],
                  'width' => $size['width'],
                  'height' => $size['height']
                )
              );

            }

            $results[] = array(
              'id' => $attachment->ID,
              'key' => 'thumb',
              'value' => array(
                'key' => 'thumb',
                'filename' => $dir.'/'.$metadata['sizes']['thumbnail']['file'],
                'width' => $metadata['sizes']['thumbnail']['width'],
                'height' => $metadata['sizes']['thumbnail']['height']
              )
            );

          }



          // $results[] = array(
          //   'id' => $attachment->ID,
          //   'key' => 'sizes',
          //   'value' => $sizes
          // );



          $results[] = array(
            'id' => $attachment->ID,
            'key' => 'type',
            'value' => get_post_mime_type($attachment)
          );
          // $results[] = array(
          //   'id' => $attachment->ID,
          //   'key' => 'src',
          //   'value' => $file_url
          // );
          $results[] = array(
            'id' => $attachment->ID,
            'key' => 'width',
            'value' => $metadata['width']
          );
          $results[] = array(
            'id' => $attachment->ID,
            'key' => 'height',
            'value' => $metadata['height']
          );
          // $results[] = array(
          //   'id' => $attachment->ID,
          //   'key' => 'thumb_src',
          //   'value' => $thumb_data[0]
          // );
          // $results[] = array(
          //   'id' => $attachment->ID,
          //   'key' => 'thumb_width',
          //   'value' => $thumb_data[1]
          // );
          // $results[] = array(
          //   'id' => $attachment->ID,
          //   'key' => 'thumb_height',
          //   'value' => $thumb_data[2]
          // );
          $results[] = array(
            'id' => $attachment->ID,
            'key' => 'size',
            'value' => filesize($file) //intval(filesize($filename)/1000).' KB'
          );
          $results[] = array(
            'id' => $attachment->ID,
            'key' => 'name',
            'value' => basename($filename)
          );
          $results[] = array(
            'id' => $attachment->ID,
            'key' => 'filename',
            'value' => $filename
          );
          $results[] = array(
            'id' => $attachment->ID,
            'key' => 'filetype',
            'value' => 'file'
          );

        } else {

          $results[] = array(
            'id' => $attachment->ID,
            'key' => 'type',
            'value' => ''
          );
          // $results[] = array(
          //   'id' => $attachment->ID,
          //   'key' => 'src',
          //   'value' => ''
          // );
          $results[] = array(
            'id' => $attachment->ID,
            'key' => 'width',
            'value' => ''
          );
          $results[] = array(
            'id' => $attachment->ID,
            'key' => 'height',
            'value' => ''
          );
          // $results[] = array(
          //   'id' => $attachment->ID,
          //   'key' => 'thumb_src',
          //   'value' => ''
          // );
          // $results[] = array(
          //   'id' => $attachment->ID,
          //   'key' => 'thumb_width',
          //   'value' => ''
          // );
          // $results[] = array(
          //   'id' => $attachment->ID,
          //   'key' => 'thumb_height',
          //   'value' => ''
          // );
          $results[] = array(
            'id' => $attachment->ID,
            'key' => 'size',
            'value' => '0'
          );
          $results[] = array(
            'id' => $attachment->ID,
            'key' => 'name',
            'value' => $attachment->post_title
          );
          $results[] = array(
            'id' => $attachment->ID,
            'key' => 'filename',
            'value' => $attachment->post_title
          );
          $results[] = array(
            'id' => $attachment->ID,
            'key' => 'filetype',
            'value' => 'folder'
          );

        }

        $results[] = array(
          'id' => $attachment->ID,
          'key' => 'parent',
          'value' => $attachment->post_parent
        );
        $results[] = array(
          'id' => $attachment->ID,
          'key' => 'date',
          'value' => $attachment->post_date
        );

      }



    }

    return $results;

  }

  public function upload($request) {

    $files = $request->get_file_params();
    $chunk = $request->get_param('chunk');
    $chunks = $request->get_param('chunks');
    $file_name = $request->get_param('name');
    $type = $request->get_param('type');



    $path_parts = pathinfo($file_name);

    // $ext = pathinfo($file_name, PATHINFO_EXTENSION);
    // $name = wp_basename($file_name, ".$ext");
    // $title = sanitize_text_field($name);

    // $file_name = sanitize_title($path_parts['filename']).'.'.$path_parts['extension'];



    $wp_upload_dir = wp_upload_dir();
    $dir = $wp_upload_dir['basedir'] ;

    if (!file_exists($dir)) {
      mkdir($dir);
    }


    $file_path = "$dir/$file_name";

    // Open temp file
    $out = @fopen("{$file_path}.part", $chunk == 0 ? "wb" : "ab");

    if ($out) {
      // Read binary input stream and append it to temp file
      $in = @fopen($files['file']['tmp_name'], "rb");

      if ($in) {
        while ($buff = fread($in, 4096)) {
          fwrite($out, $buff);
        }
      } else {
        return array('error' => 'Failed to open input stream.');
      }

      @fclose($in);
      @fclose($out);

      @unlink($files['file']['tmp_name']);

   } else {
     return array('error' => 'Failed to open output stream.');
   }

    // Check if file has been uploaded

    if (!$chunks || $chunk == $chunks - 1) {
      // Strip the temp .part suffix off
      rename("{$file_path}.part", $file_path);

      $ext = pathinfo($file_name, PATHINFO_EXTENSION);
      $name = wp_basename($file_name, ".$ext");
      $title = sanitize_text_field($name);
      $excerpt = '';

      if (strpos($type, 'image/') === 0) {
        $image_meta = wp_read_image_metadata( $file_name );

        if ($image_meta) {
          if (trim($image_meta['title']) && !is_numeric(sanitize_title($image_meta['title']))) {
            $title = $image_meta['title'];
          }
          if (trim( $image_meta['caption'])) {
            $excerpt = $image_meta['caption'];
          }
        }
      }

      // Save the data.
      $attachment_id = wp_insert_attachment(array(
        'post_mime_type' => mime_content_type($file_path),
        'post_title'     => $title,
        'post_excerpt'   => $excerpt
      ), $file_path);

      if ( ! is_wp_error( $attachment_id ) ) {
        // Set a custom header with the attachment_id.
        // Used by the browser/client to resume creating image sub-sizes after a PHP fatal error.
        if ( ! headers_sent() ) {
          header( 'X-WP-Upload-Attachment-ID: ' . $attachment_id );
        }

        if (!function_exists('wp_generate_attachment_metadata')) {
          include ABSPATH . 'wp-admin/includes/image.php';
        }


        // The image sub-sizes are created during wp_generate_attachment_metadata().
        // This is generally slow and may cause timeouts or out of memory errors.

        $metadata = wp_generate_attachment_metadata( $attachment_id, $file_path );


        wp_update_attachment_metadata( $attachment_id,  $metadata);
      }

      return $attachment_id;

    } else {

      return 'error attachment was not created';

    }

    // return $file_path;

  }


  // public function get($id) {
  //
  //   $attachment = get_post($id);
  //
  //   if ($attachment->post_type === 'attachment') {
  //
  //     $filename = get_attached_file($attachment->ID);
  //     // $filename = get_post_meta($attachment->ID, '_wp_attached_file', true);
  //     $metadata = wp_get_attachment_metadata($attachment->ID);
  //     $file_url = wp_get_attachment_url($attachment->ID);
  //     $thumb_data = wp_get_attachment_image_src($attachment->ID, 'thumbnail', true);
  //
  //     return array(
  //       'id' => $attachment->ID,
  //       'type' => get_post_mime_type($attachment),
  //       'src' => $file_url,
  //       'width' => $metadata['width'],
  //       'height' => $metadata['height'],
  //       'thumb_src' => $thumb_data[0],
  //       'thumb_width' => $thumb_data[1],
  //       'thumb_height' => $thumb_data[2],
  //       'size' => filesize($filename),
  //       'name' => basename($filename),
  //       'file' => $filename,
  //       'filetype' => 'file',
  //       'parent' => $attachment->post_parent,
  //       'date' => $attachment->post_date
  //     );
  //
  //   } else {
  //
  //     return array(
  //       'id' => $attachment->ID,
  //       'type' => '',
  //       'src' => '',
  //       'width' => '',
  //       'height' => '',
  //       'thumb_src' => '',
  //       'thumb_width' => '',
  //       'thumb_height' => '',
  //       'size' => '0',
  //       'name' => $attachment->post_title,
  //       'file' => '',
  //       'filetype' => 'folder',
  //       'parent' => $attachment->post_parent,
  //       'date' => $attachment->post_date
  //     );
  //
  //   }
  //
  // }


}
