'use client';

export default function myImageLoader({ src, width, quality }: any) {
  return `${process.env.NEXT_PUBLIC_SERVER_URL}/media/${src}?w=${width}&q=${
    quality || 75
  }`;
  // return `${process.env.NEXT_PUBLIC_SERVER_URL}/${src}?w=${width}&q=${
  //   quality || 75
  // }`;
}
