export const getHighQualityCoverUrl = (url?: string) => {
  if (!url) return url;

  return url.replace('/coversum/', '/cover500/').replace('/cover/', '/cover500/');
};
