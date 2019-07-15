import React from 'react';
import styled from 'styled-components';

import checkbox_checked from './assets/checkbox_checked.svg';
import checkbox_unchecked from './assets/checkbox_unchecked.svg';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  cursor: pointer;
`;

const FilterButton = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 6px;
`;

const Text = styled.span`
  width: 244px;
  // font-family: AppleSDGothicNeo;
  color: #424242;
`;

function ScrapFilter({ isFiltered, setIsFilterd }) {
  return (
    <Wrapper
      onClick={() => setIsFilterd(!isFiltered)}
    >
      <FilterButton
        src={isFiltered ? checkbox_checked : checkbox_unchecked}
        alt='scrap switch'
      />
      <Text>스크랩한 것만 보기</Text>
    </Wrapper>
  )
}

export default ScrapFilter;