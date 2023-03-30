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

    $args['no_found_rows'] = true;
    $args['cache_results'] = false;

    $query = new WP_Query($args);

    return array_map(function($post) {
      return array(
        'id' => (string) $post->ID,
        'date' => $post->post_date,
        'parent' => (string) $post->post_parent,
        'name' => $post->post_title,
        'caption' => $post->post_excerpt,
        'description' => $post->post_content,
        'mimetype' => $post->post_mime_type
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
        WHERE post_id IN ($ids) AND meta_key != '_wp_attachment_metadata'";

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
