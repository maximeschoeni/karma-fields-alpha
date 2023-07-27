<?php

// https://stackoverflow.com/a/38088630/2086505
// https://developer.wordpress.org/reference/functions/wp_generate_attachment_metadata/

require_once KARMA_FIELDS_ALPHA_PATH.'/drivers/driver-posts.php';

Class Karma_Fields_Alpha_Driver_Medias extends Karma_Fields_Alpha_Driver_Posts {


  /**
	 * query
	 */
  public function query($params) {
    global $wpdb;

    $args = $this->get_query_args($params);

    if (isset($params['parent'])) {

      $parent_id = intval($params['parent']);

      $folder_ids = $wpdb->get_col(
        "SELECT p.ID FROM $wpdb->posts AS p
        INNER JOIN $wpdb->posts AS a ON (a.post_parent = p.ID)
        WHERE a.post_type = 'attachment' AND p.post_status = 'publish' AND p.post_parent = $parent_id
        GROUP BY p.ID"
      );

      $attachment_ids = $wpdb->get_col("SELECT ID FROM $wpdb->posts WHERE post_type = 'attachment' AND post_status = 'inherit' AND post_parent = $parent_id");

      $args['post__in'] = array_merge(
        $folder_ids,
        $attachment_ids
      );

    } else if (empty($params['ids'])) {

      $args['post_type'] = 'attachment'; // -> only if parent and ids are not set

    }



    $args['no_found_rows'] = true;
    $args['cache_results'] = false;

    $query = new WP_Query($args);

    // var_dump($args, $query->posts); die();

    return array_map(function($post) {
      return array(
        // 'id' => (string) $post->ID,
        'ID' => (string) $post->ID,
        'post_date' => $post->post_date,
        // 'parent' => (string) $post->post_parent,
        'post_parent' => (string) $post->post_parent,
        // 'name' => $post->post_title,
        'post_title' => $post->post_title,
        // 'caption' => $post->post_excerpt,
        'post_excerpt' => $post->post_excerpt,
        'post_content' => $post->post_content,
        'mimetype' => $post->post_mime_type,
        'filetype' => $post->post_type === 'attachment' ? 'file' : 'folder'
      );
    }, $query->posts);

  }


  /**
   * count
   */
  public function count($params) {
    global $wpdb;

    $args = $this->get_query_args($params);

    if (isset($params['parent'])) {

      $parent_id = intval($params['parent']);

      $folder_ids = $wpdb->get_col(
        "SELECT p.ID FROM $wpdb->posts AS p
        INNER JOIN $wpdb->posts AS a ON (a.post_parent = p.ID)
        WHERE a.post_type = 'attachment' AND p.post_status = 'publish' AND p.post_parent = $parent_id
        GROUP BY p.ID"
      );

      $attachment_ids = $wpdb->get_col("SELECT ID FROM $wpdb->posts WHERE post_type = 'attachment' AND post_status = 'inherit' AND post_parent = $parent_id");

      $args['post__in'] = array_merge(
        $folder_ids,
        $attachment_ids
      );

    } else if (empty($params['ids'])) {

      $args['post_type'] = 'attachment'; // -> only if parent and ids are not set

    }




    //
    // if (empty($params['ids'])) { // -> may fetch file parents instead...
    //
    //   $args['post_type'] = 'attachment';
    //
    // }

    $args['fields'] = 'ids';

    $query = new WP_Query($args);

    return apply_filters('karma_fields_posts_driver_query_count', $query->found_posts, $query, $args);

  }



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
        WHERE post_id IN ($ids) AND meta_key NOT LIKE '\_%'";

			$results = $wpdb->get_results($sql);

      foreach ($results as $result) {

        $result->value = maybe_unserialize($result->value);

        $result->value = apply_filters('karma_fields_medias_meta', $result->value, $result->key, $result->id);

      }

      $results = apply_filters('karma_fields_medias_meta_results', $results, $ids);

      return $results;

    } else {

      return array();

    }

  }






  /**
	 * relations
	 */
  public function filemeta1($params) {
    global $wpdb;

    $output = array();

    $ids = array_map('intval', explode(',', $params['ids']));

    if ($ids) {

      $sql_ids = implode(',', $ids);

      $sql = "SELECT * FROM $wpdb->postmeta WHERE post_id IN ($sql_ids) AND meta_key = '_wp_attached_file'";

			$results = $wpdb->get_results($sql);

      $upload_dir = wp_get_upload_dir()['basedir'];

      foreach ($results as $result) {

        $filename = $result->meta_value;

        $dir = dirname('/'.$filename); // -> like /2023/05. Needed for getting sizes pull path

        $file = $upload_dir.'/'.$filename; // -> just for size

        $output[] = array(
          'id' => $result->post_id,
          'key' => 'size',
          'value' => filesize($file) //intval(filesize($filename)/1000).' KB'
        );
        // $output[] = array(
        //   'id' => $result->post_id,
        //   'key' => 'basename',
        //   'value' => basename($filename)
        // );
        $output[] = array(
          'id' => $result->post_id,
          'key' => 'filename',
          'value' => basename($filename)
        );
        $output[] = array(
          'id' => $result->post_id,
          'key' => 'dir',
          'value' => $dir // -> like 2023/05
        );
      }

    }

    return $output;

  }

  /**
   * filemeta relations
   */
  public function filemeta2($params) {
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

        if (isset($meta['sizes'])) {

          foreach ($meta['sizes'] as $key => $size) {

            $output[] = array(
              'id' => $result->id,
              'key' => 'sizes',
              'value' => array(
                'name' => $key,
                'filename' => $size['file'],
                'width' => $size['width'],
                'height' => $size['height']
              )
            );

          }

        }

        if (isset($meta['width'])) {

          $output[] = array(
            'id' => $result->id,
            'key' => 'width',
            'value' => $meta['width']
          );

        }

        if (isset($meta['height'])) {

          $output[] = array(
            'id' => $result->id,
            'key' => 'height',
            'value' => $meta['height']
          );

        }

      }

    }

    return $output;

  }




  public function upload($request) {

    $files = $request->get_file_params();
    $chunk = $request->get_param('chunk');
    $chunks = $request->get_param('chunks');
    $file_name = $request->get_param('name');
    $type = $request->get_param('type');
    $parent = $request->get_param('parent');


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
      $args = array(
        'post_mime_type' => mime_content_type($file_path),
        'post_title'     => $title,
        'post_excerpt'   => $excerpt
      );

      if ($parent) {

        $args['post_parent'] = $parent;

      }

      $attachment_id = wp_insert_attachment($args, $file_path);

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





}
