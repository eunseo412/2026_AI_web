import React from "react";

interface SectionTitleProps {
  id?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}

/**
 * 페이지 각 섹션의 제목을 일관되고 아름답게 표시하기 위한 공통 컴포넌트
 */
export default function SectionTitle({ id, title, subtitle, center = true }: SectionTitleProps) {
  return (
    <div id={id} className={`mb-10 flex flex-col ${center ? "items-center text-center" : "items-start text-left"}`}>
      {/* 대제목 - 반응형 폰트 크기 및 색상 설정 */}
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
        {title}
      </h2>
      
      {/* 소제목 (옵션) - 줄바꿈 및 가독성을 위한 최대 너비 설정 */}
      {subtitle && (
        <p className="mt-3 max-w-2xl text-lg text-slate-500">
          {subtitle}
        </p>
      )}
      
      {/* 하단 장식선 - 브랜드 아이덴티티를 나타내는 파란색 그라데이션 라인 */}
      <div className="mt-4 h-1.5 w-16 rounded-full bg-gradient-to-r from-blue-500 to-teal-400"></div>
    </div>
  );
}
