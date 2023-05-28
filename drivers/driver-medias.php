<?php

// https://stackoverflow.com/a/38088630/2086505
// https://developer.wordpress.org/reference/functions/wp_generate_attachment_metadata/

require_once KARMA_FIELDS_ALPHA_PATH.'/drivers/driver-posts.php';

Class Karma_Fields_Alpha_Driver_Medias extends Karma_Fields_Alpha_Driver_Posts {


  /**
	 * query
	 */
  public function query($params) {

    $args = $this->get_query_args($params);

    $args['post_type'] = 'attachment';
    $args['no_found_rows'] = true;
    $args['cache_results'] = false;

    $query = new WP_Query($args);

    // var_dump($args, $query->posts); die();

    return array_map(function($post) {
      return array(
        'id' => (string) $post->ID,
        'date' => $post->post_date,
        'parent' => (string) $post->post_parent,
        'name' => $post->post_title,
        'caption' => $post->post_excerpt,
        'description' => $post->post_content,
        'mimetype' => $post->post_mime_type,
        'filetype' => $post->post_type === 'attachment' ? 'file' : 'folder'
      );
    }, $query->posts);

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
        $output[] = array(
          'id' => $result->post_id,
          'key' => 'basename',
          'value' => basename($filename)
        );
        $output[] = array(
          'id' => $result->post_id,
          'key' => 'filename',
          'value' => $filename
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





}
