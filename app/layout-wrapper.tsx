'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Info, Users, ParkingSquare, Sparkles } from 'lucide-react';
import styles from './layout.module.css';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read theme from localStorage or document attribute
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'light';
    setTheme(currentTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  if (!mounted) {
    // Avoid mismatches during SSR rendering hydration
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className={`${styles.header} glass`}>
        <Link href="/">
          <div className={styles.logo}>
            <ParkingSquare size={28} strokeWidth={2.5} />
            <span>ParkingMate<span className={styles.logoDot}>.</span></span>
          </div>
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`}>
            주차장 찾기
          </Link>
          <Link href="/about" className={`${styles.navLink} ${pathname === '/about' ? styles.navLinkActive : ''}`}>
            소개 (About)
          </Link>
          <Link href="/contact" className={`${styles.navLink} ${pathname === '/contact' ? styles.navLinkActive : ''}`}>
            팀원 소개
          </Link>
        </nav>

        <div className={styles.actions}>
          <button 
            onClick={toggleTheme} 
            className={styles.themeToggle} 
            aria-label="테마 전환"
            title={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <Link href="/about">
            <button className={styles.mainBtn}>시작하기</button>
          </Link>
        </div>
      </header>

      <main className={styles.mainContent}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div>
            <div className={styles.logo} style={{ fontSize: '1.15rem', marginBottom: '8px', cursor: 'default' }}>
              <ParkingSquare size={20} />
              <span>ParkingMate</span>
            </div>
            <p className={styles.footerText}>
              국토교통부 전국주차장정보표준데이터 공공데이터 포털 오픈 API 연동 서비스
            </p>
          </div>
          
          <div className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink}>주차장 찾기</Link>
            <Link href="/about" className={styles.footerLink}>서비스 소개</Link>
            <Link href="/contact" className={styles.footerLink}>팀원 연락처</Link>
          </div>
        </div>
        <div style={{ marginTop: '24px', fontSize: '0.8rem', color: 'var(--text-light)' }}>
          © {new Date().getFullYear()} ParkingMate Team. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
