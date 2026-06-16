import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

// 모든 라우트를 요청 시 렌더링(동적)으로 강제 → 빌드 단계에서 DB 접속/프리렌더 방지
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "COOKmaster · 조리·제과제빵 자격증 필기 문제은행",
  description:
    "한식·양식·중식·일식 조리기능사와 제과·제빵기능사 필기시험 대비 문제은행. 무료체험 100문제 + 3회차 반복학습 + 6회 모의고사 + 오답복습으로 합격까지.",
  keywords: [
    "조리기능사 필기",
    "한식조리기능사",
    "양식조리기능사",
    "중식조리기능사",
    "일식조리기능사",
    "제과기능사 필기",
    "제빵기능사 필기",
  ],
  openGraph: {
    title: "COOKmaster · 조리·제과제빵 자격증 필기 문제은행",
    description: "무료체험 → 반복학습 → 오답복습 → 모의고사 → 합격",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col antialiased">
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
