<?php

require_once KARMA_FIELDS_PATH.'/drivers/postfile.php';

Class Karma_Fields_Driver_Postfiles extends Karma_Fields_Driver_Postfile {

	/**
	 * get
	 */
  public function get($uri) {

    $id = apply_filters("karma_fields_posts_uri", $uri);
    $img_ids = get_post_meta($id, $this->key);

    $img_ids = apply_filters('karma_fields_driver_files_ids', $img_ids);

    $uploads = wp_get_upload_dir();
    $baseurl = $uploads['baseurl'] . '/';

    $attachments = array();

    foreach ($img_ids as $img_id) {

      $attachments[] = $this->get_attachment($img_id, $baseurl);

    }

    return $attachments;

  }

	/**
	 * update
	 */
  public function update($uri, $value, &$args) {

    $id = apply_filters('karma_fields_posts_uri', $uri);


    delete_post_meta($id, $this->key);

    $prev = get_post_meta($id, $this->key);

    $attachment_ids = array_map(function($attachment) {return $attachment->id;}, $value);

    $to_remove = array_diff($prev, $attachment_ids);
    $to_add = array_diff($attachment_ids, $prev);

    foreach ($to_remove as $value_to_remove) {

      delete_post_meta($id, $this->key, $value_to_remove);

    }

    foreach ($to_add as $value_to_add) {

      add_post_meta($id, $this->key, $value_to_add);

    }

    $cache = $this->get_cache();

    if ($cache) {

      foreach ($to_remove as $value_to_remove) {

        do_action('karma_cache_posts_remove_dependancy', $value_to_remove, "$uri/$cache");

      }

      foreach ($to_add as $value_to_add) {

        do_action('karma_cache_posts_add_dependancy', $value_to_add, "$uri/$cache");

      }

    }

  }

}
