'use client';

import React from 'react';
import { Landmark, Compass, HelpCircle, AlertTriangle, Sparkles, Server } from 'lucide-react';
import styles from './about.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      
      {/* Header Section */}
      <section className={`${styles.header} animate-fade-in`}>
        <div className={styles.badge} style={{
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          padding: '6px 16px',
          borderRadius: '50px',
          fontSize: '0.85rem',
          fontWeight: 700,
          display: 'inline-flex',
          marginBottom: '16px'
        }}>
          서비스 소개 (About)
        </div>
        <h1 className={styles.title}>
          주차가 편리해지는 파트너,<br />
          <span className={styles.gradientText}>ParkingMate</span>
        </h1>
        <p className={styles.subtitle}>
          ParkingMate가 어떤 서비스이고, 어떻게 주차 문제를 해결하고 있으며, 어떤 데이터를 신뢰하여 가공하는지 설명해 드립니다.
        </p>
      </section>

      {/* 1. Purpose of the Service */}
      <section className={`${styles.section} animate-scale-in`} style={{ animationDelay: '0.1s' }}>
        <h2 className={styles.sectionTitle}>
          <Compass size={24} className={styles.iconWrapper} />
          서비스 기획 목적
        </h2>
        <div className={styles.content}>
          <p>
            운전자들이 생소한 지역이나 붐비는 목적지를 방문할 때, 가장 먼저 하는 큰 걱정 중 하나는 <strong>&quot;어디에 주차해야 하지?&quot;</strong> 또는 <strong>&quot;주차 요금이 너무 비싸진 않을까?&quot;</strong> 입니다.
          </p>
          <p>
            기존 지도 서비스는 주로 주차장의 &apos;위치&apos;만 보여주고, 구체적인 운영 여부나 가산 기본 요금 등을 하나하나 비교하기엔 턱없이 복잡하고 불편했습니다.
          </p>
          <p>
            <strong>ParkingMate</strong>는 이러한 일상의 크고 작은 골칫거리를 해결하기 위해 탄생했습니다. 입력된 도착 예정일, 시각, 예상 체류 시간 정보를 지도와 유기적으로 결합하여, 사용자가 주차장을 출발하기 전 가장 알맞은 공간을 완벽하게 의사결정할 수 있도록 돕습니다.
          </p>
        </div>
      </section>

      {/* 2. Reliable Data Source */}
      <section className={`${styles.section} animate-scale-in`} style={{ animationDelay: '0.2s' }}>
        <h2 className={styles.sectionTitle}>
          <Landmark size={24} className={styles.iconWrapper} />
          신뢰할 수 있는 데이터 원천
        </h2>
        <div className={styles.content}>
          <p>
            ParkingMate는 행정안전부 및 지방자치단체가 공동 관리하고 국토교통부 공공데이터포털(data.go.kr)이 제공하는 공식 행정 표준 규격인 <strong>&quot;전국주차장정보표준데이터 오픈 API&quot;</strong>를 활용하여 서비스를 구축했습니다.
          </p>
          <p>
            우리는 해당 데이터를 엄격히 정제하여 아래와 같은 핵심 지표를 정확하게 분석 및 노출합니다.
          </p>
          <ul className={styles.list}>
            <li><strong>주차구획 면수:</strong> 주차장의 규모를 파악할 수 있는 실제 주차 구획수</li>
            <li><strong>요금 체계:</strong> 기본 시간, 기본 요금, 추가 단위 시간, 추가 단위 요금 및 1일권 정액 요금</li>
            <li><strong>장애인 전용 주차구역:</strong> 보행에 어려움이 있는 교통약자 이용객을 위한 보유 여부 정보</li>
            <li><strong>상세 운영 시간:</strong> 평일, 토요일, 공휴일의 시작 및 종료 영업 시간 정보</li>
          </ul>

          <div className={styles.highlightCard}>
            <div className={styles.highlightTitle}>
              <Server size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
              API 실시간 동적 검색 구조
            </div>
            <p style={{ fontSize: '0.88rem', margin: 0 }}>
              사용자의 검색 목적지 주변 좌표 정보를 실시간 역지오코딩하여, 해당 행정구역(시·군·구)의 최신 주차장 목록 데이터를 공공데이터포털 서버로부터 직접 가져옵니다. 따라서 가공되거나 시뮬레이션된 데이터가 아닌 실제 국토교통부 표준 원본 데이터만을 운용합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Tech Stack Description */}
      <section className={`${styles.section} animate-scale-in`} style={{ animationDelay: '0.3s' }}>
        <h2 className={styles.sectionTitle}>
          <Sparkles size={24} className={styles.iconWrapper} />
          스택 구성 및 동작 아키텍처
        </h2>
        <div className={styles.content}>
          <p>
            본 웹 애플리케이션은 modern web 개발 기술 스택을 활용하여 빌드 및 설계되었습니다.
          </p>
          <ul className={styles.list}>
            <li><strong>Next.js + API Routes (App Router):</strong> 풀스택 SSR 아키텍처를 적용하여 빠른 첫 페이지 렌더링 및 SEO 최적화를 동시에 만족하고, Server-side API Routes를 통해 보안 위협 없이 공공데이터 API와 구글 제미나이 AI API 통신을 수행합니다.</li>
            <li><strong>Leaflet.js Map:</strong> 모바일 및 데스크톱 브라우저 환경에서 플러그인 없이 고성능으로 매핑 및 핀 인터랙션을 제공하는 경량 오픈소스 인터랙티브 지도 엔진입니다.</li>
            <li><strong>Google Gemini 1.5 Flash:</strong> 검색된 주차장 리스트를 거리, 비용, 이용 가능 시각을 지표 삼아 인공지능이 즉각 분석하고, 최상의 주차 꿀팁을 한국어 텍스트 마크다운 형태로 조형해 주는 혁신적인 인공지능 인터페이스입니다.</li>
          </ul>
        </div>
      </section>

      {/* 4. Service Limitations & Warnings */}
      <section className={`${styles.section} animate-scale-in`} style={{ animationDelay: '0.4s' }}>
        <h2 className={styles.sectionTitle}>
          <AlertTriangle size={24} style={{ color: 'var(--color-warning)' }} />
          서비스의 한계 및 주의 사항
        </h2>
        <div className={styles.content}>
          <p>
            ParkingMate는 국가 표준 데이터를 적극 신용하여 서비스를 제공하고 있으나, 공공 데이터 특성상 아래와 같은 시간 차 및 한계가 실재할 수 있음을 사전 고지해 드립니다.
          </p>
          
          <div className={styles.alertBox}>
            <AlertTriangle className={styles.alertIcon} size={24} />
            <div>
              <div className={styles.alertTitle}>실시간 만차/공차 상태 미지원</div>
              <p className={styles.alertText}>
                본 서비스가 연동 중인 전국주차장 표준 데이터는 주차장 시설의 마스터 데이터(위치, 규격, 영업 요금 기준)를 제공하므로, <strong>현재 몇 대가 입차하여 주차가 가능한지 등의 실시간 차량 잔여 면수 데이터는 포함하지 않습니다.</strong> 따라서 주차장 규모(총 구획수)를 감안하시어 이동하시는 것을 권장합니다.
              </p>
            </div>
          </div>

          <div className={styles.alertBox} style={{ marginTop: '16px' }}>
            <HelpCircle className={styles.alertIcon} size={24} style={{ color: 'var(--primary)' }} />
            <div>
              <div className={styles.alertTitle}>현장 사정에 따른 변동 가능성</div>
              <p className={styles.alertText}>
                지자체별 데이터 업로드 시점 차이 또는 시설 공사, 민간 매입 등으로 인해 실제 주차 요금 및 운영 시간이 앱에 표시된 데이터와 상이할 수 있습니다. 특히 <strong>휴무일이나 임시 요금 변동</strong>이 있는 경우 주차장 카드에 기재된 대표 연락처로 사전에 확인 후 이동해 주시기 바랍니다.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
