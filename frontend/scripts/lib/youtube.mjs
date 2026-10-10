/** Parsing puro del HTML del canal y del feed Atom de YouTube (testeable sin red). */

export function extractChannelId(html) {
  return (
    /"channelId":"(UC[\w-]{22})"/.exec(html)?.[1] ??
    /youtube\.com\/channel\/(UC[\w-]{22})/.exec(html)?.[1] ??
    null
  );
}

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const tag = (xml, name) => {
  const m = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`).exec(xml);
  return m ? decode(m[1].trim()) : '';
};

export function parseYouTubeFeed(xml) {
  const head = xml.split('<entry>')[0];
  const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, entry]) => {
    const id = tag(entry, 'yt:videoId');
    const views = /<media:statistics views="(\d+)"/.exec(entry)?.[1];
    return {
      id,
      title: tag(entry, 'title'),
      published: tag(entry, 'published'),
      thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      isShort: /\/shorts\//.test(entry),
      views: views ? Number(views) : null,
    };
  });
  return { title: tag(head, 'title'), videos: videos.filter((v) => /^[\w-]{11}$/.test(v.id)) };
}
