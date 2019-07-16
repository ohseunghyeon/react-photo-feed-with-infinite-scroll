import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useScrapList, useFeeds } from '../hooks/index';

import ScrapFilter from './ScrapFilter';
import Feed from './Feed';

const Wrapper = styled.div`
  padding: 30px 40px 0 60px;
  font-size: 15px;
`;

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

function FeedList() {
  const [page, setPage] = useState(1);
  const increasePage = useCallback(() => setPage(page + 1), [page]);
  const [isFiltered, setIsFilterd] = useState(false);
  const [feeds, hasMore] = useFeeds(page, increasePage);
  const [scrapList, setScrapList] = useScrapList();

  return (
    <Wrapper>
      <ScrapFilter
        isFiltered={isFiltered}
        setIsFilterd={setIsFilterd}
      />

      <InfiniteScroll
        dataLength={feeds.length}
        next={increasePage}
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

export default FeedList;