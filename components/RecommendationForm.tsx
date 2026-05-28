"use client";

import React, { useState } from "react";

interface RecommendationFormProps {
  onRecommend: (text: string) => void;
}

// 사용자가 손쉽게 클릭해서 추가할 수 있는 키워드 추천 칩 정의
const SUGGESTED_CHIPS = [
  { emoji: "🌊", text: "바다" },
  { emoji: "🧘", text: "힐링" },
  { emoji: "🍕", text: "맛집" },
  { emoji: "👥", text: "친구" },
  { emoji: "👩‍❤️‍👨", text: "커플" },
  { emoji: "⛩️", text: "역사" },
  { emoji: "🌳", text: "자연" },
  { emoji: "☕", text: "카페" },
  { emoji: "🌃", text: "야경" },
  { emoji: "🚗", text: "드라이브" },
  { emoji: "⛰️", text: "산" },
  { emoji: "📸", text: "사진" }
];

/**
 * 사용자가 여행 취향과 요구사항을 텍스트로 입력할 수 있는 폼 컴포넌트
 */
export default function RecommendationForm({ onRecommend }: RecommendationFormProps) {
  const [inputText, setInputText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 입력값 유효성 검사 (공백만 있는 경우 포함)
    if (!inputText.trim()) {
      setErrorMsg("여행 스타일이나 취향을 입력해 주세요! (예: 바다가 보이는 조용한 카페에 가고 싶어)");
      return;
    }

    // 에러 상태 초기화 및 결과 전송
    setErrorMsg("");
    onRecommend(inputText);
  };

  // 추천 키워드 칩 클릭 시 textarea에 텍스트 자동 삽입 기능
  const handleChipClick = (keyword: string) => {
    setErrorMsg("");
    setInputText((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) {
        return `${keyword} `;
      }
      // 이미 단어가 들어가 있다면 띄어쓰기 후 추가
      if (trimmed.endsWith(keyword)) {
        return prev;
      }
      return `${trimmed} ${keyword} `;
    });
  };

  // 입력 내용 초기화
  const handleClear = () => {
    setInputText("");
    setErrorMsg("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl rounded-3xl border border-slate-100 bg-white/80 p-6 md:p-8 shadow-xl backdrop-blur-md">
      <div className="flex flex-col space-y-4">
        
        {/* 상단 레이블 및 설명 */}
        <div className="flex items-center justify-between">
          <label htmlFor="travel-preference" className="text-lg font-bold text-slate-700">
            어떤 여행을 꿈꾸고 계신가요? ✈️
          </label>
          <span className="text-xs text-slate-400 font-medium">
            최대 300자 입력 가능
          </span>
        </div>

        {/* 텍스트 입력창 (Textarea) */}
        <div className="relative">
          <textarea
            id="travel-preference"
            rows={4}
            maxLength={300}
            className={`w-full rounded-2xl border p-4 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
              errorMsg
                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
            }`}
            placeholder="원하시는 여행 스타일을 자유롭게 적어주세요.&#10;예: 이번 휴가엔 친구들과 탁 트인 바다를 보면서 맛집 투어도 하고 예쁜 카페에서 사진도 찍고 싶어요!"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (e.target.value.trim()) setErrorMsg(""); // 입력이 채워지면 에러 자동 해제
            }}
          />
          
          {/* 입력값 지우기 버튼 */}
          {inputText && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 bottom-4 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors duration-200"
              title="지우기"
            >
              ✕
            </button>
          )}
        </div>

        {/* 유효성 검사 안내 메시지 표시 */}
        {errorMsg && (
          <p className="text-sm font-semibold text-rose-500 flex items-center gap-1.5 animate-pulse">
            ⚠️ {errorMsg}
          </p>
        )}

        {/* 클릭 가능한 키워드 칩 추천 영역 */}
        <div className="space-y-2">
          <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
            💡 이런 키워드는 어때요? (클릭하여 추가)
          </span>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_CHIPS.map((chip, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleChipClick(chip.text)}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 active:scale-95 shadow-sm"
              >
                <span>{chip.emoji}</span>
                <span>{chip.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-400 px-6 py-4 text-base font-bold text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:via-indigo-600 hover:to-teal-500 active:scale-[0.99] transition-all duration-300 cursor-pointer"
          >
            🔍 완벽한 여행지 추천 받기
          </button>
        </div>

      </div>
    </form>
  );
}
