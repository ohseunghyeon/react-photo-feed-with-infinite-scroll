import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';

import ScrapFilter from './ScrapFilter';
import Feed from './Feed';

const Wrapper = styled.div`
  padding: 30px 60px 0;
  font-size: 15px;
`;

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

function FeedList() {
  const [page, setPage] = useState(1);
  const [isFiltered, setIsFilterd] = useState(false);
  const [feeds, hasMore] = useFeeds(page);
  const [scrapList, setScrapList] = useScrapList();

  return (
    <Wrapper>
      <ScrapFilter
        isFiltered={isFiltered}
        setIsFilterd={setIsFilterd}
      />

      <InfiniteScroll
        dataLength={feeds.length}
        next={() => setPage(page + 1)}
        hasMore={hasMore}
      >
        <List>
          {feeds
            .filter(feed => !isFiltered ? true : scrapList[feed.id])
            .map(feed => (
              <Feed
                key={feed.id}
                feed={feed}
                isScrapped={scrapList[feed.id]}
                setScrapList={setScrapList}
              />
            ))}
        </List>
      </InfiniteScroll>
    </Wrapper>
  );
}

// custom hook for scrap list
function useScrapList() {
  let storedScrapList = localStorage.getItem('scrapList');
  storedScrapList = storedScrapList ? JSON.parse(storedScrapList) : {};

  const [scrapList, setScrapList] = useState(storedScrapList);

  useEffect(
    () => localStorage.setItem('scrapList', JSON.stringify(scrapList)),
    [scrapList],
  );

  return [scrapList, setScrapList];
}

// custom hook for feeds
function useFeeds(page) {
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

  return [feeds, hasMore]
}

export default FeedList;