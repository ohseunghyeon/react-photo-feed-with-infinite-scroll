import { useState, useEffect } from 'react';

// custom hook for scrap list
export default function useScrapList() {
  let storedScrapList = localStorage.getItem('scrapList');
  storedScrapList = storedScrapList ? JSON.parse(storedScrapList) : {};

  const [scrapList, setScrapList] = useState(storedScrapList);

  useEffect(
    () => localStorage.setItem('scrapList', JSON.stringify(scrapList)),
    [scrapList],
  );

  return [scrapList, setScrapList];
}