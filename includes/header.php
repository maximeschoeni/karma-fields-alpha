
<script>
  K = KarmaFieldsAlpha = {
    restURL: "<?php echo rest_url(); ?>",
    uploadURL: "<?php echo wp_get_upload_dir()['baseurl']; ?>",
    nonce: "<?php echo wp_create_nonce( 'wp_rest' ); ?>",
    locale: "<?php echo str_replace('_', '-', get_locale()); ?>",
    adminURL: "<?php echo admin_url(); ?>",
    assetsURL: "<?php echo dirname(plugin_dir_url( __FILE__ )); ?>/assets",
    embeds: [],
    drivers: <?php echo json_encode($drivers); ?>,
    useWPMediaUploader: true,
    restMediaURL: "<?php echo rest_url(); ?>wp/v2/media",
    base: "<?php echo basename(ABSPATH); ?>"
  };
</script>
