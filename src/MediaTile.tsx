type Media = { id: string; kind: "image" | "audio" | "video" | "other"; name?: string };
const thumbnail = (id: string, size = "w1200") => `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=${size}`;
const fileUrl = (id: string) => `https://drive.google.com/file/d/${encodeURIComponent(id)}/view`;
const previewUrl = (id: string) => `https://drive.google.com/file/d/${encodeURIComponent(id)}/preview`;
const directUrl = (id: string) => `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`;

function MediaActions({ media, showName }: { media: Media; showName: boolean }) {
  return (
    <div className="image-actions">
      {showName && <span className="file-name" title={media.name}>{media.name}</span>}
      <span className="file-action-links">
        <a href={fileUrl(media.id)} target="_blank" rel="noreferrer">VIEW ↗</a>
        <a href={directUrl(media.id)} target="_blank" rel="noreferrer">DOWNLOAD ↓</a>
      </span>
    </div>
  );
}

export function MediaTile({ media, showName = false, videoLink = false }: { media: Media; showName?: boolean; videoLink?: boolean }) {
  if (media.kind === "video" && videoLink) {
    return <figure className="media-tile video-tile">
      <a className="video-thumbnail" href={fileUrl(media.id)} target="_blank" rel="noreferrer" aria-label="Play video in Google Drive">
        <img src={thumbnail(media.id)} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} />
        <span className="video-play">▶ PLAY ON GOOGLE DRIVE ↗</span>
      </a>
      <MediaActions media={media} showName={showName} />
    </figure>;
  }
  if (media.kind === "video") {
    return (
      <figure className="media-tile video-tile">
        <iframe src={previewUrl(media.id)} title="Instagram video" allow="autoplay; fullscreen" loading="lazy" />
        <MediaActions media={media} showName={showName} />
      </figure>
    );
  }

  if (media.kind === "audio") {
    return (
      <figure className="media-tile audio-tile">
        <div className="audio-mark" aria-hidden="true">AUDIO / INSTAGRAM</div>
        <iframe src={previewUrl(media.id)} title="Instagram audio" allow="autoplay" loading="lazy" />
        <MediaActions media={media} showName={showName} />
      </figure>
    );
  }

  if (media.kind !== "image") {
    return <figure className="media-tile unsupported-media"><a className="unsupported-tile" href={fileUrl(media.id)} target="_blank" rel="noreferrer">OPEN FILE IN DRIVE ↗</a><MediaActions media={media} showName={showName} /></figure>;
  }

  return (
    <figure className="media-tile">
      <a href={fileUrl(media.id)} target="_blank" rel="noreferrer" aria-label="Open original image in Google Drive">
        <img src={thumbnail(media.id)} alt="" loading="lazy" />
      </a>
      <MediaActions media={media} showName={showName} />
    </figure>
  );
}

