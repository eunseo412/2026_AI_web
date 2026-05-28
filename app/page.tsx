"use client";

import React, { useState, useRef } from "react";
import SectionTitle from "../components/SectionTitle";
import RecommendationForm from "../components/RecommendationForm";
import DestinationCard from "../components/DestinationCard";
import { recommendDestinations, RecommendationResult } from "../lib/recommend";

/**
 * TripPick - 메인 싱글 페이지 웹 서비스
 */
export default function HomePage() {
  // 상태 관리: 추천 결과, 기본 노출 여부, 검색 수행 여부, 최근 검색어
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [isDefault, setIsDefault] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 결과 화면으로 부드럽게 스크롤하기 위한 ref
  const resultSectionRef = useRef<HTMLDivElement>(null);

  // 추천 요청 이벤트 핸들러
  const handleRecommend = (text: string) => {
    setSearchQuery(text);
    const { results: recommendationResults, isDefault: defaultFlag } = recommendDestinations(text);
    
    setResults(recommendationResults);
    setIsDefault(defaultFlag);
    setHasSearched(true);

    // 스크롤 이동 헬퍼 함수 (모바일 브라우저 호환성 대비 try-catch 안전망 적용)
    setTimeout(() => {
      try {
        if (resultSectionRef.current) {
          resultSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (error) {
        // smooth scrolling을 지원하지 않는 브라우저를 위한 일반 스크롤 폴백
        if (resultSectionRef.current) {
          resultSectionRef.current.scrollIntoView();
        }
        console.warn("Smooth scrolling is not supported on this browser:", error);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* 글로벌 네비게이션 바 (GNB) */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧭</span>
            <span className="text-xl font-black tracking-wider bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
              TripPick
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#recommend" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">추천받기</a>
            <a href="#result" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">추천결과</a>
            <a href="#about" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">소개</a>
            <a href="#team" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">우리 팀</a>
          </nav>
        </div>
      </header>

      {/* 1. Hero Section (인트로 섹션) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-400 via-blue-500 to-slate-50 py-24 md:py-32">
        {/* 미려한 백그라운드 구체 데코레이션 */}
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-teal-300 opacity-20 blur-3xl" />
        <div className="absolute bottom-10 left-1/4 h-80 w-80 rounded-full bg-indigo-300 opacity-30 blur-3xl" />
        
        {/* 여행 도트 경로 & 비행기 데코레이션 (여행 서비스 느낌 극대화) */}
        <div className="absolute top-1/4 left-0 right-0 hidden lg:flex items-center justify-between px-16 opacity-20 pointer-events-none select-none">
          <span className="text-4xl animate-pulse">📍</span>
          <div className="h-0.5 flex-1 border-t-4 border-dashed border-white mx-4 relative">
            <span className="absolute -top-4 left-1/3 text-2xl rotate-45 animate-bounce">✈️</span>
            <span className="absolute -top-4 left-2/3 text-2xl animate-bounce" style={{ animationDelay: '1s' }}>🎈</span>
          </div>
          <span className="text-4xl animate-pulse" style={{ animationDelay: '0.5s' }}>🌴</span>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/25 px-4 py-1.5 text-xs sm:text-sm font-bold text-white backdrop-blur-sm border border-white/20 mb-6 shadow-sm">
            🌏 AI가 콕 집어주는 나만의 맞춤 국내 여행지
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl drop-shadow-md">
            TripPick
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-2xl text-blue-50 font-bold drop-shadow-sm">
            “나에게 딱 맞는 여행지를 찾아보세요.”
          </p>
          <p className="mx-auto mt-4 max-w-xl text-xs sm:text-sm text-blue-50/90 leading-relaxed font-medium">
            가고 싶은 휴가지나 원하는 여행 스타일(바다, 힐링, 맛집 등)에 대해 자유롭게 적어주세요. 텍스트에 포함된 선호도 키워드를 똑똑하게 포착하여 가장 어울리는 지역 3곳을 매칭해 드립니다.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="#recommend"
              className="rounded-full bg-white px-8 py-4 text-sm sm:text-base font-extrabold text-blue-600 shadow-md hover:shadow-xl hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all duration-300 border border-slate-100"
            >
              🚀 지금 취향 입력하러 가기
            </a>
          </div>
        </div>
      </section>

      {/* 2. Recommendation Section (입력 섹션) */}
      <section id="recommend" className="mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 relative z-20">
        <div className="flex flex-col items-center">
          <RecommendationForm onRecommend={handleRecommend} />
        </div>
      </section>

      {/* 3. Result Section (추천 결과 섹션) */}
      <section 
        id="result" 
        ref={resultSectionRef} 
        className="mx-auto max-w-7xl px-4 py-20 border-t border-slate-100 sm:px-6 lg:px-8 scroll-mt-16"
      >
        <SectionTitle
          title="🎯 당신의 추천 여행지"
          subtitle={hasSearched ? `"${searchQuery}"에 맞춰 매칭된 결과입니다.` : "나만을 위한 맞춤 추천 결과가 여기에 표시됩니다."}
        />

        {/* 조건별 렌더링 영역 */}
        {!hasSearched ? (
          // 검색 전 대기 화면
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-inner">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-4xl mb-4 animate-bounce">
              🗺️
            </div>
            <h3 className="text-lg font-bold text-slate-700">설레는 첫 추천을 준비해 보세요!</h3>
            <p className="mt-2 text-sm text-slate-500 max-w-md">
              상단의 여행 스타일 입력창에 <strong>바다, 힐링, 맛집, 야경, 전통, 친구</strong> 등 원하는 키워드를 자유롭게 적어 추천 버튼을 눌러주세요.
            </p>
          </div>
        ) : (
          // 검색 수행 후 화면
          <div className="space-y-8">
            {/* 키워드가 매칭되지 않아 기본 추천지가 나온 경우 안내 배너 노출 */}
            {isDefault && (
              <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800 shadow-sm">
                <span className="text-xl">💡</span>
                <div>
                  <span className="font-bold">원하시는 단어와 완벽하게 일치하는 매칭지가 없어요!</span>
                  <span className="block mt-0.5 text-xs text-amber-700">대신 TripPick에서 가장 평점 높고 많은 사랑을 받는 대표 한국 여행지 3곳을 엄선해 드립니다!</span>
                </div>
              </div>
            )}

            {/* 카드 결과 그리드 */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((item) => (
                <DestinationCard
                  key={item.destination.id}
                  destination={item.destination}
                  score={item.score}
                  matchedKeywords={item.matchedKeywords}
                />
              ))}
            </div>

            {/* 추가 액션 버튼 */}
            <div className="flex justify-center pt-6">
              <a
                href="#recommend"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
              >
                🔄 다시 입력해 보기
              </a>
            </div>
          </div>
        )}
      </section>

      {/* 4. About Section (소개 및 작동 방식 섹션) */}
      <section id="about" className="bg-slate-100 py-20 border-t border-slate-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="💡 서비스 작동 방식"
            subtitle="TripPick의 똑똑한 추천 시스템은 어떤 로직으로 작동하나요?"
          />

          <div className="grid gap-8 md:grid-cols-3 mt-10">
            {/* 스텝 1 */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white font-black text-lg mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">취향 정보 입력</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                사용자가 원하는 여행 스타일에 대해 편안한 대화체(자연어)로 textarea에 마음껏 입력합니다.
              </p>
            </div>

            {/* 스텝 2 */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white font-black text-lg mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">단어 형태소 키워드 분석</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                입력 텍스트의 불필요한 기호를 거르고 사전 정의된 19개의 핵심 테마(바다, 자연, 힐링 등) 매칭율과 대조합니다.
              </p>
            </div>

            {/* 스텝 3 */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-400 text-white font-black text-lg mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">점수 랭킹 및 폴백 추천</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                매칭 점수가 높은 순으로 여행지를 나열하고, 일치 항목이 없는 경우 기본 대표 관광지를 자동 보완하여 만족도를 보증합니다.
              </p>
            </div>
          </div>

          {/* 기술 스택 소개 */}
          <div className="mt-12 rounded-3xl bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-extrabold">Next.js & Tailwind CSS로 구현된 MVP</h3>
                <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
                  본 애플리케이션은 최신 Next.js App Router 아키텍처와 TypeScript 타입을 사용하여 정밀하게 코딩되었습니다. 외부 통신이나 API Latency 없이 완전히 로컬 브라우저 샌드박스에서 즉각 작동하도록 클라이언트 사이드 고속 필터링 모듈을 자체 탑재하였습니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <span className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur-sm border border-white/5">Next.js 15 AppRouter</span>
                <span className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur-sm border border-white/5">TypeScript</span>
                <span className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur-sm border border-white/5">Tailwind v4</span>
                <span className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur-sm border border-white/5">Vercel Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Team Section (팀 소개 섹션) */}
      <section id="team" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionTitle
          title="👥 우리 팀원 소개"
          subtitle="TripPick을 더 나은 방향으로 만들어 나가는 A2 조원들을 소개합니다."
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-10">
          
          {/* 팀원 1: 은서 */}
          <div className="flex flex-col items-center bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 text-3xl shadow-md mb-4">
              👩‍💻
            </div>
            <h3 className="text-lg font-bold text-slate-800">은서</h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 rounded-md px-2 py-0.5 mt-1 mb-3">Lead Frontend Developer</span>
            <p className="text-xs text-slate-500 text-center leading-relaxed max-w-xs">
              Next.js 뼈대 구조 초기화, Tailwind CSS를 이용한 UI 디자인 가이드 구축, 결과 출력 카드 및 레이아웃을 총괄 구현했습니다.
            </p>
          </div>

          {/* 팀원 2 (플레이스홀더) */}
          <div className="flex flex-col items-center bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 text-3xl shadow-md mb-4">
              👨‍💻
            </div>
            <h3 className="text-lg font-bold text-slate-800">[팀원 2 이름]</h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 rounded-md px-2 py-0.5 mt-1 mb-3">Algorithm & Parser Engineer</span>
            <p className="text-xs text-slate-500 text-center leading-relaxed max-w-xs">
              사용자 입력 취향 텍스트의 불필요한 공백을 정제하고, 키워드를 효율적으로 필터링하여 스코어링하는 추천 로직 핵심 알고리즘 설계를 전담했습니다.
            </p>
          </div>

          {/* 팀원 3 (플레이스홀더) */}
          <div className="flex flex-col items-center bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 text-3xl shadow-md mb-4">
              🕵️‍♂️
            </div>
            <h3 className="text-lg font-bold text-slate-800">[팀원 3 이름]</h3>
            <span className="text-xs font-bold text-pink-600 bg-pink-50 rounded-md px-2 py-0.5 mt-1 mb-3">QA & Technical Writer</span>
            <p className="text-xs text-slate-500 text-center leading-relaxed max-w-xs">
              예외적인 테스트 케이스들을 수집하고, 여행지 데이터 베이스 구성(10개 지역 상세), 설치 가이드 구축 및 Vercel 배포 안정성 검증을 담당했습니다.
            </p>
          </div>

        </div>
      </section>

      {/* 푸터 영역 */}
      <footer className="bg-slate-900 py-12 text-slate-400 text-sm border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="text-xl">🧭</span>
            <span className="text-base font-black tracking-wider text-white">TripPick</span>
          </div>
          <p>© 2026 Team A2. Built for Introduction to AI Programming Course.</p>
          <p className="mt-1 text-xs text-slate-600">All rights reserved. Designed with modern aesthetics.</p>
        </div>
      </footer>

    </div>
  );
}
