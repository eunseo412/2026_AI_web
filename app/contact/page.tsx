'use client';

import React from 'react';
import { Users, Mail, Phone, MapPin } from 'lucide-react';
import styles from './contact.module.css';

export default function ContactPage() {
  const teamMembers = [
    {
      name: '이채민',
      role: 'Project Leader',
      desc: '서비스 기획 및 전반적인 프론트엔드 아키텍처 설계를 총괄했습니다. Leaflet 지도 컴포넌트 개발과 전체 테마 모듈 연동을 담당했습니다.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    },
    {
      name: '김도현',
      role: 'Dataset Engineer',
      desc: '국토교통부 표준 주차장 데이터셋 정제 및 전처리 알고리즘을 설계하고, 비정상 좌표 데이터 정합성을 정밀 보정하는 시스템을 담당했습니다.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    },
    {
      name: '박서연',
      role: 'Backend Developer',
      desc: 'Next.js API Routes 백엔드 설계 및 데이터 포털 오픈 API 연동을 구축했습니다. 역지오코딩 처리와 거리 연산 필터링 라우트를 전담했습니다.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    },
    {
      name: '최준혁',
      role: 'AI / Infra Engineer',
      desc: 'Google Gemini LLM 비서 추천 API 연동 모듈을 조율하고, Vercel 클라우드 무중단 배포 자동화 인프라 환경을 완성했습니다.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    }
  ];

  return (
    <div className={styles.container}>
      
      {/* Header Block */}
      <section className={`${styles.header} animate-fade-in`}>
        <div style={{
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          padding: '6px 16px',
          borderRadius: '50px',
          fontSize: '0.85rem',
          fontWeight: 700,
          display: 'inline-flex',
          marginBottom: '16px',
          gap: '6px',
          alignItems: 'center'
        }}>
          <Users size={14} />
          <span>ParkingMate 팀소개</span>
        </div>
        <h1 className={styles.title}>
          우리는 <span className={styles.gradientText}>ParkingMate</span> 팀입니다
        </h1>
        <p className={styles.subtitle}>
          더 쾌적하고 막힘없는 이동 경험을 제공하기 위해 열정을 바치며, 각자의 전문 역량을 유기적으로 엮어 이번 서비스를 완성해 냈습니다.
        </p>
      </section>

      {/* Team Grid */}
      <section className={styles.teamGrid}>
        {teamMembers.map((member, idx) => (
          <div 
            key={idx} 
            className={`${styles.memberCard} animate-scale-in`}
            style={{ animationDelay: `${0.1 * (idx + 1)}s` }}
          >
            <div className={styles.avatarWrapper}>
              <Users size={32} />
            </div>
            
            <h3 className={styles.name}>{member.name}</h3>
            <span className={styles.role}>{member.role}</span>
            <p className={styles.desc}>{member.desc}</p>
            
            <div className={styles.links}>
              <a href={member.github} target="_blank" rel="noreferrer" className={styles.linkIcon} aria-label="GitHub">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href={member.linkedin} target="_blank" rel="noreferrer" className={styles.linkIcon} aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* Project Inquiry Card */}
      <section className={`${styles.contactInfoCard} animate-scale-in`} style={{ animationDelay: '0.5s' }}>
        <div>
          <h2 className={styles.infoTitle}>프로젝트 제휴 및 기술 문의</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            ParkingMate 서비스에 관한 피드백이나 비즈니스 연동 문의는 아래의 연락처로 남겨주시면 정성껏 답변해 드리겠습니다.
          </p>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className={styles.infoRow}>
            <div className={styles.infoIconWrapper}>
              <Mail size={20} />
            </div>
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>이메일 주소</span>
              <span className={styles.infoValue}>support@parkingmate.ai</span>
            </div>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoIconWrapper}>
              <Phone size={20} />
            </div>
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>대표 유선번호</span>
              <span className={styles.infoValue}>02-1234-5678 (평일 09:00 ~ 18:00)</span>
            </div>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoIconWrapper}>
              <MapPin size={20} />
            </div>
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>오피스 위치</span>
              <span className={styles.infoValue}>서울특별시 강남구 테헤란로 396, ParkingMate 연구소</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
