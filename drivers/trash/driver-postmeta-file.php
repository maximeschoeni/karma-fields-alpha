<?php

require_once KARMA_FIELDS_PATH.'/drivers/driver-postmeta.php';


Class Karma_Fields_Driver_Postmeta_File extends Karma_Fields_Driver_Postmeta {

  /**
   * get
   */
  public function get($id, $key, $request, $karma_fields) {

    $attachment_id = get_post_meta($id, $key, true);

    if (is_numeric($attachment_id) && $attachment_id) {

      $uploads = wp_get_upload_dir();
      $baseurl = $uploads['baseurl'] . '/';

      return $this->get_attachment($attachment_id, $baseurl);

    }

    return '';

  }

  /**
   * update
   */
  public function update($data, $output, $request, $karma_fields) {

    foreach ($data as $id => $item) {

      foreach ($item as $key => $value) {

        $prev = get_post_meta($id, $key, true);

        if (isset($value['id']) && $value['id']) {

          update_post_meta($id, $key, $value['id']);

        } else if ($prev) {

          delete_post_meta($id, $key, $prev);

        }

      }

    }



    // $cache = $this->get_cache();
    //
    // if ($cache && $prev && (!isset($value->id) || intval($prev) != $value->id)) {
    //
    //   do_action('karma_cache_posts_remove_dependancy', $prev, "$uri/$cache");
    //
    // }
    //
    // if ($cache && isset($value->id) && intval($prev) != $value->id) {
    //
    //   do_action('karma_cache_posts_add_dependancy', $value->id, "$uri/$cache");
    //
    // }

  }

  /**
   * get_attachment
   */
  public function get_attachment($img_id, $baseurl) {

    $attachment = get_post($img_id);
    $file = get_post_meta($img_id, '_wp_attached_file', true);
    $basename = basename($file);
    $path = str_replace($basename, '', $file);
    $metadata = wp_get_attachment_metadata($img_id);
    $mime_type = get_post_mime_type($attachment);
    $thumb_src_data = wp_get_attachment_image_src($img_id, 'thumbnail', true);

    return array(
      'id' => intval($img_id),
      'name' => $attachment->post_name,
      'title' => get_the_title($attachment),
      'caption' => wp_get_attachment_caption($img_id), // = post_excerpt
      'description' => apply_filters('sublanguage_translate_post_field', $attachment->post_content, $attachment, 'post_content'),
      'alt' => get_post_meta($img_id, '_wp_attachment_image_alt', true),
      'type' => $mime_type,
      'filename' => $basename,
      'url' => $baseurl . $file,
      'width' => intval($metadata['width']),
      'height' => intval($metadata['height']),
      'sources' => $this->get_sources($baseurl, $metadata, $path, $mime_type),
      'thumb' => $thumb_src_data[0],
      'thumb_width' => $thumb_src_data[1],
      'thumb_height' => $thumb_src_data[2]
    );

  }

  /**
   * get_sources
   */
  public function get_sources($baseurl, $metadata, $path, $mime_type) {

    $sources = array();

    if ($mime_type === 'image/jpeg' || $mime_type === 'image/jpg' || $mime_type === 'image/png') {

      $img_sizes = get_intermediate_image_sizes();

      foreach ($img_sizes as $img_size) {

        if ($img_size === 'full') {

          $sources[] = array(
            'size' => $img_size,
            'src' => $baseurl.$metadata['file'],
            'width' => intval($metadata['width']),
            'height' => intval($metadata['height'])
          );

        } else if (isset($metadata['sizes'][$img_size])) {

          $sources[] = array(
            'size' => $img_size,
            'src' => $baseurl . $path . $metadata['sizes'][$img_size]['file'],
            'width' => intval($metadata['sizes'][$img_size]['width']),
            'height' => intval($metadata['sizes'][$img_size]['height'])
          );

        }

      }

      usort($sources, array($this, 'sort_sources'));

    }

    return $sources;

  }

  /**
   * sort_sources
   */
  public function sort_sources($a, $b) {

    if ($a['width'] > $b['width']) return 1;
    else if ($a['width'] < $b['width']) return -1;
    else return 0;

  }


}
