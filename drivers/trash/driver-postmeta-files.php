<?php

require_once KARMA_FIELDS_PATH.'/drivers/driver-postmeta-file.php';


Class Karma_Fields_Driver_Postmeta_Files extends Karma_Fields_Driver_Postmeta_File {

  /**
	 * get
	 */
  public function get($id, $key, $request, $karma_fields) {

    $img_ids = get_post_meta($id, $key);

    $img_ids = array_filter($img_ids, function($attachment_id) {
      return is_numeric($attachment_id);
    });

    $uploads = wp_get_upload_dir();
    $baseurl = $uploads['baseurl'] . '/';

    $attachments = array();

    $this->cache_files($img_ids);

    foreach ($img_ids as $img_id) {

      $attachments[] = $this->get_attachment($img_id, $baseurl);

    }

    return $attachments;

  }

  public function update($data, $output, $request, $karma_fields) {

    foreach ($data as $id => $item) {

      foreach ($item as $key => $value) {

        $prev = get_post_meta($id, $key);

        $attachment_ids = array_map(function($attachment) {
          return (string) $attachment['id'];
        }, $value);

        if ($prev !== $attachment_ids) {

          delete_post_meta($id, $key);

          foreach ($attachment_ids as $attachment_id) {

            add_post_meta($id, $key, $attachment_id);

          }

        }

        // $to_remove = array_diff($prev, $attachment_ids);
        // $to_add = array_diff($attachment_ids, $prev);
        //
        // foreach ($to_remove as $value_to_remove) {
        //
        //   delete_post_meta($id, $this->key, $value_to_remove);
        //
        // }
        //
        // foreach ($to_add as $value_to_add) {
        //
        //   add_post_meta($id, $this->key, $value_to_add);
        //
        // }

        // $cache = $this->get_cache();
        //
        // if ($cache) {
        //
        //   foreach ($to_remove as $value_to_remove) {
        //
        //     do_action('karma_cache_posts_remove_dependancy', $value_to_remove, "$uri/$cache");
        //
        //   }
        //
        //   foreach ($to_add as $value_to_add) {
        //
        //     do_action('karma_cache_posts_add_dependancy', $value_to_add, "$uri/$cache");
        //
        //   }

      }

    }

  }

  /**
   * Cache images
   */
  public function cache_files($image_ids) {
    global $wpdb;

    if ($image_ids) {

      $sql_ids = implode(',', $image_ids);

      $attachments = $wpdb->get_results(
        "SELECT * FROM $wpdb->posts WHERE ID IN ($sql_ids)"
      );

      update_post_caches($attachments, 'any', false, true);

    }

  }



}
