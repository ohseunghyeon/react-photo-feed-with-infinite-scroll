# 1번 - A

### 1 전체 사진 리스트를 가져오는 SQL을 작성해주세요.

    SELECT * FROM `cards`

### 2 전체 사진 리스트에서 현재 사용자가 사진 담기 여부를 확인 할 수 있는 SQL을 작성해주세요.

    SELECT 
      c.id, 
      c.user_id, 
      c.image_url, 
      cc.collection_book_id, 
      c.created_at 
    FROM 
      cards c 
      LEFT JOIN (
        SELECT 
          collection_book_id, 
          card_id 
        FROM 
          `collects` 
        WHERE 
          `collection_book_id` IN (
            SELECT 
              id 
            FROM 
              `collection_books` 
            WHERE 
              `user_id` = 1
          ) 
        GROUP BY 
          card_id
      ) cc ON c.id = cc.card_id;

* user_id는 임의로 1로 정했습니다.

### 3 위 문제를 해결할 때, 로그인 여부를 판단하셨나요?

네. user table에 row가 존재해야 collection_books 에 특정 유저에 대한 row를 추가할 수 있고, collects에 사진 담기가 가능합니다.
2번 문제의 지문 또한 `현재 사용자`라고 명시되어 있기에 로그인 된 유저에게 cards 목록을 보여주면서 collects가 이미 되어있는지 알 수 있어야 한다는 시나리오라고 이해했습니다.

# 1번 - B

### 1 해당 사용자가 소유한 컬랙션북 리스트를 가져오는 SQL을 작성해주세요.

    SELECT * FROM `collection_books` WHERE `user_id` = 1

### 2 해당 사용자의 소유한 컬랙션북 리스트에서 대표 사진을 가져오는 SQL을 작성해주세요.

    SELECT
     * 
    FROM 
      cards c 
      JOIN (
        SELECT
          collection_book_id, 
          max(card_id) card_id
        FROM 
          `collects` 
        WHERE 
          `collection_book_id` IN (
            SELECT 
              id 
            FROM 
              `collection_books` 
            WHERE 
              `user_id` = 1
          ) 
        GROUP BY 
          collection_book_id
      ) cc ON c.id = cc.card_id;

* user_id는 임의로 1로 정했습니다.
* 가장 최근에 collects에 추가된 사진이 대표 이미지로 지정되게 했습니다. card_id가 시간순이 아닐 경우 created_at을 기준으로 대표 이미지를 뽑으면 됩니다.

# 2번 - A - 1 아래의 요구사항을 듣고, 데이터베이스 구조를 설계해주세요

## users
| column   | type           |
|----------|----------------|
| id       | Integer(PK)    |
| email    | String(unique) |
| password | String         |
| nickname | String(unique) |
| gender   | Boolean        |
| birth    | Date           |

## pictures
| column     | type        |
|------------|-------------|
| id         | Integer(PK) |
| user_id    | Integer(FK) |
| category   | Integer(FK) |
| desc       | String      |
| created_at | Datetime    |

## categories
| column | type    |
|--------|---------|
| id     | Integer |
| name   | String  |

## picture_collections
| column  | type        |
|---------|-------------|
| id      | Integer(PK) |
| user_id | Integer(FK) |
| summary | String      |
| rep_pic | Integer(FK) |

## collected_pictures
| column        | type        |
|---------------|-------------|
| id            | Integer(PK) |
| order         | Integer     |
| pic_id        | Integer(FK) |
| collection_id | Integer(FK) |

## picture_replies
| column     | type        |
|------------|-------------|
| id         | Integer(PK) |
| user_id    | Integer(FK) |
| pic_id     | Integer(FK) |
| content    | String      |
| created_at | Datetime    |

## picture_collection_replies
| column     | type        |
|------------|-------------|
| id         | Integer(PK) |
| user_id    | Integer(FK) |
| pic_col_id | Integer(FK) |
| content    | String      |
| created_at | Datetime    |

## picture_likes
| column     | type        |
|------------|-------------|
| user_id    | Integer(PK) |
| pic_id     | Integer(PK) |

## picture_collection_likes
| column     | type        |
|------------|-------------|
| user_id    | Integer(PK) |
| pic_col_id | Integer(PK) |

# 2번 - A - 2 추가적인 기획내용이 있다고 합니다. 아래의 내용을 위 구조에 추가하여 해결해주세요.

1.  사용자가 이메일 뿐만아니라 facebook이나 naver를 이용해서 로그인 하게 해주세요.

users 테이블에 아래의 컬럼을 추가하여 각 서비스에서 제공될 unique id를 저장

| column | type   |
|--------|--------|
| fb_id  | String |
| nv_id  | String |

2. 그리고 댓글에는 대댓글을 달 수 있게 해주세요.

picture_replies와 picture_collection_replies 테이블에 각각 아래의 컬럼을 추가하여 부모 댓글이 존재할 수 있게 수정

| column    | type    |
|-----------|---------|
| parent_id | Integer |

3. 마지막으로 각각의 사용자가 친구를 맺을 수 있게 해주세요. 

friends라는 새로운 테이블을 생성합니다.

## friendships
| column     | type        |
|------------|-------------|
| user_1_id  | Integer(PK) |
| user_2_id  | Integer(PK) |
| status     | String      |

* status column으로 친구 신청, 맺어진 상태를 파악
* A와 B라는 사람이 있을 경우 A - B 라는 레코드만 둘 경우 one way로 구성할 수 있고 two way로 구성하기 위해 B - A 레코드를 추가할 수 있다.
* 기획이 불분명한 부분이 있다고 생각되어 기획자에게 우선 물어보는 게 맞을 것 같다. 친구 신청이 필요한지 아닌지, 서로 이웃 같은 건 절차 없이 각자가 서로 추가할 경우 그 개념이 성립하는 건지.

# 3번 - A - 1 다음의 문제를 해결해주세요.

사용 언어: javascript
풀이에 대한 의식의 흐름: 두 배열이 존재하고 각각의 배열에서 숫자를 뽑아 곱하여 누적할 때 가장 작게 나오는 경우는 최대한 큰 값끼리의 곱을 피하는 경우라고 생각됩니다.

그 방법은 하나의 배열은 오름차순으로, 나머지 하나의 배열은 내림차순으로 정렬하여 곱하는 것입니다.

다음과 같은 배열이 두 개 있을 때,
A = [1,4,2]
B = [4,5,3]

각각의 배열을 정렬하여 다음과 같이 만들어주면
A = [1,2,4] (오름차순)
B = [5,4,3] (내림차순)

곱의 합이 최솟값이 될 것 같습니다.
(증명할 수 없어서 '그럴 것 같다'고 썼습니다.)

따라서 이 경우에 필요한 함수는 배열을 오름차순과 내림차순으로 정렬하는 함수입니다. 자바스크립트의 기본 정렬 함수를 사용할 수 없다면 삽입정렬을 구현해서 사용하겠습니다.

```js
function sort(array, isIncrease) {
  for (let i = 1; i < array.length; i++) {
    const key = array[i];
    let j = i - 1;

    while (
      j >= 0 &&
      isIncrease ? array[j] > key : array[j] < key
    ) {
      array[j + 1] = array[j];
      j = j - 1;
    }
    array[j + 1] = key;
  }

  return array;
}

function leastSumOfMultiplication(arrA, arrB) {
  const sortedA = sort(arrA, true);
  const sortedB = sort(arrB, false);

  let sum = 0;
  for (let i = 0; i < sortedA.length; i++) {
    sum += sortedA[i] * sortedB[i];
  }

  return sum
}
```







