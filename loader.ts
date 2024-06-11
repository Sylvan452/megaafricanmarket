'use client';

export default function myImageLoader({ src, width, quality }: any) {
  if ((src as string).startsWith('http')) {
    return src;
  }
  return `${process.env.NEXT_PUBLIC_SERVER_URL}/${src}?w=${width}${
    quality ? '&q=' + quality : ''
  }`;
  // return `${process.env.NEXT_PUBLIC_SERVER_URL}/${src}?w=${width}&q=${
  //   quality || 75
  // }`;
}
