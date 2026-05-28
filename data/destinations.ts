export interface Destination {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  recommendedFor: string;
  imageEmoji: string;
  bestSeason: string;
}

export const destinations: Destination[] = [
  {
    id: "jeju",
    name: "제주도",
    description: "푸른 바다와 천혜의 자연경관이 어우러진 대한민국 최고의 힐링 섬",
    keywords: ["바다", "자연", "힐링", "드라이브", "사진"],
    recommendedFor: "지친 일상에서 벗어나 푸른 자연 속에서 진정한 휴식과 인생 사진을 남기고 싶은 분",
    imageEmoji: "🏝️",
    bestSeason: "봄, 가을"
  },
  {
    id: "busan",
    name: "부산",
    description: "화려한 도시 야경과 시원한 바다, 끊임없는 맛집이 가득한 역동적인 해양 도시",
    keywords: ["바다", "맛집", "야경", "쇼핑", "친구"],
    recommendedFor: "친구들과 함께 맛있는 음식을 먹고, 화려한 밤바다 야경과 쇼핑을 즐기고 싶은 활기찬 여행자",
    imageEmoji: "🌊",
    bestSeason: "여름, 가을"
  },
  {
    id: "gangneung",
    name: "강릉",
    description: "잔잔한 안목해변 커피거리와 기차 여행의 낭만이 살아있는 동해안의 대표 도시",
    keywords: ["바다", "카페", "힐링", "기차", "혼자"],
    recommendedFor: "혼자 기차를 타고 떠나 바다를 보며 향긋한 커피 한 잔과 사색을 즐기고 싶은 분",
    imageEmoji: "☕",
    bestSeason: "겨울, 봄"
  },
  {
    id: "gyeongju",
    name: "경주",
    description: "천년의 역사와 전통 한옥, 고즈넉한 산책로가 아름다운 지붕 없는 박물관",
    keywords: ["역사", "문화", "한옥", "가족", "산책"],
    recommendedFor: "가족과 함께 역사적인 유적지를 탐방하고, 고즈넉한 한옥 돌담길을 따라 산책하고 싶은 분",
    imageEmoji: "⛩️",
    bestSeason: "봄, 가을"
  },
  {
    id: "jeonju",
    name: "전주",
    description: "한국의 멋을 담은 경기전 한옥마을과 미식가들을 사로잡는 전통 먹거리의 고장",
    keywords: ["한옥", "맛집", "전통", "문화", "사진"],
    recommendedFor: "한복을 입고 한옥마을에서 예쁜 사진을 찍고, 전라도 전통 맛집 탐방을 하고 싶은 식도락 여행자",
    imageEmoji: "🍢",
    bestSeason: "봄, 가을"
  },
  {
    id: "yeosu",
    name: "여수",
    description: "낭만 가득한 밤바다와 감미로운 버스킹 노래가 울려 퍼지는 로맨틱 해안 도시",
    keywords: ["바다", "야경", "커플", "낭만", "먹거리"],
    recommendedFor: "사랑하는 연인과 함께 돌산대교 야경을 감상하며 낭만적인 밤바다 데이트를 즐기고 싶은 커플",
    imageEmoji: "🌉",
    bestSeason: "봄, 여름"
  },
  {
    id: "sokcho",
    name: "속초",
    description: "웅장한 설악산의 푸른 숲과 끝없는 동해 바다가 공존하는 자연의 도시",
    keywords: ["바다", "산", "자연", "설악산", "힐링"],
    recommendedFor: "시원한 산바람과 산속 힐링, 그리고 탁 트인 동해 바다를 동시에 느끼며 힐링하고 싶은 분",
    imageEmoji: "🏔️",
    bestSeason: "가을, 겨울"
  },
  {
    id: "seoul",
    name: "서울",
    description: "세계적인 트렌드를 이끄는 다채로운 쇼핑, 맛집, 현대 미술 전시가 공존하는 대한민국의 수도",
    keywords: ["쇼핑", "맛집", "전시", "도시", "친구"],
    recommendedFor: "친구와 함께 트렌디한 도심 속 핫플레이스 투어, 쇼핑, 문화 전시 관람을 즐기고 싶은 트렌드 세터",
    imageEmoji: "🌆",
    bestSeason: "사계절 내내"
  },
  {
    id: "chuncheon",
    name: "춘천",
    description: "잔잔한 의암호 호숫가와 짜릿한 스카이워크, 매콤한 닭갈비가 있는 낭만 여행지",
    keywords: ["자연", "호수", "당일치기", "닭갈비", "커플"],
    recommendedFor: "도심 근교로 가볍게 당일치기 드라이브를 떠나 호수 뷰를 보며 닭갈비를 맛보고 싶은 커플",
    imageEmoji: "🚴",
    bestSeason: "봄, 여름"
  },
  {
    id: "tongyeong",
    name: "통영",
    description: "남해의 다도해 비경과 케이블카 체험, 따뜻한 인심이 반겨주는 동양의 나폴리",
    keywords: ["바다", "섬", "케이블카", "힐링", "사진"],
    recommendedFor: "수많은 에메랄드빛 섬들을 조망하며 케이블카를 타고, 힐링 가득한 바다 사진을 남기고 싶은 분",
    imageEmoji: "⛵",
    bestSeason: "봄, 가을"
  }
];
