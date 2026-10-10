import { describe, expect, it } from 'vitest';
import { extractChannelId, parseYouTubeFeed } from './youtube.mjs';

const FEED = `<?xml version="1.0"?><feed xmlns:yt="x" xmlns:media="y"><title>David Cevallos</title>
<entry><yt:videoId>kToT4VRtZWw</yt:videoId><title>Arquitectura &amp; Backend</title>
<link rel="alternate" href="https://www.youtube.com/watch?v=kToT4VRtZWw"/><published>2026-09-01T00:00:00+00:00</published>
<media:group><media:community><media:statistics views="321"/></media:community></media:group></entry>
<entry><yt:videoId>abcdefghijk</yt:videoId><title>Short</title><link rel="alternate" href="https://www.youtube.com/shorts/abcdefghijk"/><published>2026-08-01</published></entry>
<entry><yt:videoId>bad</yt:videoId><title>Roto</title></entry></feed>`;

describe('parseYouTubeFeed', () => {
  const feed = parseYouTubeFeed(FEED);
  it('lee el título del canal y decodifica entidades', () => {
    expect(feed.title).toBe('David Cevallos');
    expect(feed.videos[0].title).toBe('Arquitectura & Backend');
  });
  it('detecta shorts, vistas y descarta IDs inválidos', () => {
    expect(feed.videos).toHaveLength(2);
    expect(feed.videos[0]).toMatchObject({ id: 'kToT4VRtZWw', views: 321, isShort: false });
    expect(feed.videos[1].isShort).toBe(true);
    expect(feed.videos[0].thumb).toBe('https://i.ytimg.com/vi/kToT4VRtZWw/hqdefault.jpg');
  });
});

describe('extractChannelId', () => {
  it('encuentra el channelId en el HTML del canal', () => {
    expect(extractChannelId('..."channelId":"UC1234567890abcdefghijkl"...')).toBe('UC1234567890abcdefghijkl');
    expect(extractChannelId('<link href="https://www.youtube.com/channel/UCabcdefghijklmnopqrstuv">')).toBe('UCabcdefghijklmnopqrstuv');
    expect(extractChannelId('nada')).toBeNull();
  });
});
