import { useState, useEffect } from 'react';

// custom hook for feeds
export default function useFeeds(page, increasePage) {
  const [feeds, setFeeds] = useState([]);
  const [hasMore, setHasMore] = useState(true); // option value for infinite scroll 

  useEffect(
    () => {
      const requestFeeds = async () => {
        const data = await fetch(`https://s3.ap-northeast-2.amazonaws.com/bucketplace-coding-test/cards/page_${page}.json`);
        const newFeeds = await data.json();

        newFeeds.length
          ? setFeeds(feeds => feeds.concat(newFeeds))
          : setHasMore(false);
      };

      requestFeeds();
    },
    [page]
  );

  useEffect(
    () => {
      const scrollheight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
      const clientHeight = document.documentElement.clientHeight;

      if (feeds.length > 0 && scrollTop + clientHeight === scrollheight) {
        increasePage();
      }
    },
    [feeds, increasePage]
  )

  return [feeds, hasMore]
}