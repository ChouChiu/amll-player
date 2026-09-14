use std::{env, path::Path};

/// NVIDIA's explicit-sync path can fail when WebKitGTK creates a native
/// Wayland surface. Disable it before GTK/WebKit initialization on affected
/// Linux sessions; an existing user value always wins.
pub(crate) fn configure_nvidia_wayland() {
    if env::var_os("WAYLAND_DISPLAY").is_none()
        || env::var_os("__NV_DISABLE_EXPLICIT_SYNC").is_some()
        || !Path::new("/dev/nvidiactl").exists()
    {
        return;
    }

    // SAFETY: called before Tauri initializes GTK or starts worker threads.
    unsafe { env::set_var("__NV_DISABLE_EXPLICIT_SYNC", "1") };
}
