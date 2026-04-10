const CLOUDINARY_HOSTNAME = "res.cloudinary.com";

export function getCloudinaryCatalogImageUrl(src: string): string {
  try {
    const url = new URL(src);

    if (url.hostname !== CLOUDINARY_HOSTNAME) {
      return src;
    }

    const catalogTransform = "f_auto,q_auto,w_800,h_600,c_pad,b_rgb:F8F8F8";

    return src.replace("/image/upload/", `/image/upload/${catalogTransform}/`);
  } catch {
    return src;
  }
}
