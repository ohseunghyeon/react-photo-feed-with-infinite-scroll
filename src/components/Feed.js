import React from 'react';
import styled from 'styled-components';

import scrapButtonOnSvg from '../assets/scrap_on.svg';
import scrapButtonOffSvg from '../assets/scrap_off.svg';

const Wrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  padding-right: 20px;
  padding-bottom: 30px;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  height: 36px;
  margin-bottom: 10px;
`;

const ProfileAvatar = styled.img`
  width: 36px;
  height: 36px;
  margin-right: 10px;
`;

const ProfileNickname = styled.span`
  height: 19px;
  // font-family: AppleSDGothicNeo;
  font-size: 15px;
  font-weight: bold;
  line-height: 1.27;
  color: rgba(0, 0, 0, 0.74);
`;

const Img = styled.img`
  width: 268px;
  height: 268px;
  border-radius: 10px;
`;

const ScrapButton = styled.img`
  position: absolute;
  width: 32px;
  height: 32px;
  right: 30px;
  bottom: 40px;
  cursor: pointer;
`;

function Feed({ feed, isScrapped, setScrapList }) {
  return (
    <Wrapper>
      <Profile>
        <ProfileAvatar
          src={feed.profile_image_url}
          alt='profile avatar'
        />
        <ProfileNickname>{feed.nickname}</ProfileNickname>
      </Profile>

      <Img src={feed.image_url} />
      <ScrapButton
        src={isScrapped ? scrapButtonOnSvg : scrapButtonOffSvg}
        alt='scrap button'
        onClick={() =>
          setScrapList(list => ({
            ...list,
            [feed.id]: !list[feed.id]
          }))
        }
      />
    </Wrapper>
  )
}

export default Feed;