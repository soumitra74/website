export function getSlidesEmbedUrl(url: string): string {
  const driveFileId = getDriveFileId(url)
  if (driveFileId) {
    return `https://drive.google.com/file/d/${driveFileId}/preview`
  }

  const publishedSlidesId = url.match(/docs\.google\.com\/presentation\/d\/e\/([^/]+)/)?.[1]
  if (publishedSlidesId) {
    return `https://docs.google.com/presentation/d/e/${publishedSlidesId}/embed?start=false&loop=false&delayms=3000`
  }

  const slidesId = url.match(/docs\.google\.com\/presentation\/d\/([^/]+)/)?.[1]
  if (slidesId) {
    return `https://docs.google.com/presentation/d/${slidesId}/embed?start=false&loop=false&delayms=3000`
  }

  return url
}

export function getSlidesOpenUrl(url: string): string {
  const driveFileId = getDriveFileId(url)
  if (driveFileId) {
    return `https://drive.google.com/file/d/${driveFileId}/view`
  }

  const publishedSlidesId = url.match(/docs\.google\.com\/presentation\/d\/e\/([^/]+)/)?.[1]
  if (publishedSlidesId) {
    return `https://docs.google.com/presentation/d/e/${publishedSlidesId}/pub`
  }

  const slidesId = url.match(/docs\.google\.com\/presentation\/d\/([^/]+)/)?.[1]
  if (slidesId) {
    return `https://docs.google.com/presentation/d/${slidesId}/present`
  }

  return url
}

function getDriveFileId(url: string): string | undefined {
  return (
    url.match(/drive\.google\.com\/file\/d\/([^/]+)/)?.[1] ||
    url.match(/drive\.google\.com\/open\?id=([^&]+)/)?.[1] ||
    url.match(/drive\.google\.com\/uc\?[^#]*id=([^&]+)/)?.[1]
  )
}
