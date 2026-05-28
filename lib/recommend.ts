import { Destination, destinations } from "../data/destinations";

/**
 * 추천 결과 인터페이스
 */
export interface RecommendationResult {
  destination: Destination;
  score: number; // 입력 텍스트와 매칭된 키워드 개수
  matchedKeywords: string[]; // 매칭된 키워드 목록
}

/**
 * 사용자의 입력 텍스트를 기반으로 여행지를 추천하는 핵심 알고리즘 함수
 * 
 * @param inputText 사용자가 입력한 여행 취향 텍스트
 * @returns 추천 결과 리스트와 기본 추천 여부(isDefault)
 */
export function recommendDestinations(inputText: string): {
  results: RecommendationResult[];
  isDefault: boolean;
} {
  // 1. 입력값이 비어있거나 공백만 있는 경우 빈 배열 리턴 (컴포넌트에서 예외 처리)
  if (!inputText.trim()) {
    return { results: [], isDefault: false };
  }

  // 공백을 제거하고 소문자로 변환하여 검색 효율성 향상
  const normalizedInput = inputText.replace(/\s+/g, "").toLowerCase();

  // 2. 모든 여행지를 돌며 점수(매칭되는 키워드 개수) 계산
  const scoredDestinations: RecommendationResult[] = destinations.map((dest) => {
    // 여행지의 키워드 중 사용자의 입력값에 포함된 것만 필터링
    const matchedKeywords = dest.keywords.filter((keyword) => {
      const cleanKeyword = keyword.toLowerCase();
      return normalizedInput.includes(cleanKeyword);
    });

    return {
      destination: dest,
      score: matchedKeywords.length,
      matchedKeywords: matchedKeywords,
    };
  });

  // 3. 매칭된 키워드가 하나라도 있는지 확인 (가장 높은 점수가 0보다 큰지 확인)
  const hasMatches = scoredDestinations.some((item) => item.score > 0);

  // 4. 매칭되는 키워드가 전혀 없을 경우 기본 추천 여행지 3개 리턴
  // 기본 추천: 제주도(jeju), 부산(busan), 서울(seoul)
  if (!hasMatches) {
    const defaultIds = ["jeju", "busan", "seoul"];
    const defaultResults = destinations
      .filter((dest) => defaultIds.includes(dest.id))
      .map((dest) => ({
        destination: dest,
        score: 0,
        matchedKeywords: [],
      }));

    return {
      results: defaultResults,
      isDefault: true,
    };
  }

  // 5. 점수가 1점 이상인 여행지들만 필터링한 후, 점수 높은 순으로 정렬하여 최대 3개 선택
  const sortedResults = scoredDestinations
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score) // 점수 기준 내림차순 정렬
    .slice(0, 3); // 최대 3개 자르기

  return {
    results: sortedResults,
    isDefault: false,
  };
}
