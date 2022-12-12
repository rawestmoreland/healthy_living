export const getPocketbaseMedia = (collectionId, fileName) => {
  return `${process.env.NEXT_PUBLIC_CLOUDFLARE_BUCKET_URL}/${collectionId}/${fileName}`;
};
