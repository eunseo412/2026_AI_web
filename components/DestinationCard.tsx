import React from "react";
import { Destination } from "../data/destinations";

interface DestinationCardProps {
  destination: Destination;
  score?: number; // 매칭된 키워드 점수 (옵션)
  matchedKeywords?: string[]; // 매칭된 키워드 리스트 (옵션)
}

/**
 * 여행지 추천 결과를 개별 카드 형태로 보여주는 컴포넌트
 */
export default function DestinationCard({ destination, score = 0, matchedKeywords = [] }: DestinationCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-100">
      
      {/* 장식용 그라데이션 탑 보더 (그룹 호버 시 활성화) */}
      <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-400 opacity-80 transition-all duration-300 group-hover:h-2" />

      <div>
        {/* 상단: 대표 이모지와 도시 이름 */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-100">
            {destination.imageEmoji}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              {destination.name}
              {/* 키워드가 매칭되었고 점수가 1점 이상일 때 매칭 점수 배지 표시 */}
              {score > 0 && (
                <span className="inline-flex items-center rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700 border border-teal-200">
                  {score}개 일치
                </span>
              )}
            </h3>
            <span className="text-xs font-medium text-slate-400">추천 시즌: {destination.bestSeason}</span>
          </div>
        </div>

        {/* 설명 */}
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          {destination.description}
        </p>

        {/* 추천 키워드 배지 리스트 */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {destination.keywords.map((keyword, index) => {
            // 사용자가 입력한 키워드와 매칭된 키워드인지 확인
            const isMatched = matchedKeywords.includes(keyword);
            return (
              <span
                key={index}
                className={`inline-block rounded-lg px-2.5 py-1 text-xs font-medium transition-colors duration-200 ${
                  isMatched
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm" // 매칭된 키워드는 강조
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                #{keyword}
              </span>
            );
          })}
        </div>
      </div>

      {/* 추천 이유 (하단에 고정) */}
      <div className="mt-auto pt-4 border-t border-slate-100 bg-slate-50/50 rounded-xl p-3 border-l-4 border-l-blue-500">
        <span className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">💡 추천하는 이유</span>
        <p className="text-xs text-slate-600 leading-relaxed">
          {destination.recommendedFor}
        </p>
      </div>

    </div>
  );
}
