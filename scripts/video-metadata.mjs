export function videoDimensions(node) {
  if (!node.mimeType?.startsWith("video/")) return {};
  const width = Number(node.videoMediaMetadata?.width);
  const height = Number(node.videoMediaMetadata?.height);
  return Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0
    ? { width, height }
    : {};
}
