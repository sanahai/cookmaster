import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { COURSES } from "../lib/courses";

const prisma = new PrismaClient();

// 과목별 핵심 키워드 뱅크 (샘플 문제 생성용)
const TOPIC_BANK: Record<string, string[]> = {
  식품위생및관련법규: ["식중독", "식품첨가물", "HACCP", "식품 미생물", "식품위생법", "감염병 관리", "기생충", "살균과 소독", "식품의 변질", "교차오염 방지"],
  식품학: ["탄수화물", "단백질", "지질", "비타민", "무기질", "수분활성도", "효소작용", "갈변반응", "식품의 색", "맛 성분"],
  조리이론과원가계산: ["조리의 기초", "계량과 계측", "열전달 원리", "조리 방법", "원가의 개념", "원가 계산", "재고 관리", "구매 관리", "메뉴 관리", "급식 관리"],
  공중보건: ["공중보건 개념", "역학", "환경위생", "산업보건", "보건영양", "인구와 보건", "감염병 관리", "기생충 질환", "보건행정", "상하수도 위생"],
  한식조리실무: ["밥과 죽", "국과 탕", "찌개와 전골", "나물과 생채", "구이와 조림", "전과 적", "김치 조리", "한식 양념", "고명", "한식 썰기"],
  양식조리실무: ["스톡", "소스", "수프", "샐러드", "전채요리", "주요리", "파스타", "육류 조리", "어패류 조리", "양식 기초"],
  중식조리실무: ["딤섬", "볶음요리", "튀김요리", "면요리", "중식 소스", "중식 양념", "냉채", "중식 썰기", "전분 활용", "중식 기초"],
  일식조리실무: ["회와 사시미", "초밥", "국물요리", "구이요리", "조림요리", "튀김(덴푸라)", "찜요리", "일식 양념", "일식 썰기", "일식 기초"],
  제과이론: ["반죽법", "팽창제", "굽기 공정", "케이크류", "쿠키류", "퍼프 페이스트리", "슈", "제과 공정", "충전물", "제품 평가"],
  재료과학: ["밀가루", "설탕", "유지", "계란", "우유와 유제품", "이스트", "팽창제", "물과 소금", "초콜릿", "안정제"],
  영양학: ["탄수화물 영양", "단백질 영양", "지질 영양", "비타민", "무기질", "에너지 대사", "소화와 흡수", "영양섭취 기준", "수분", "식이섬유"],
  식품위생및법규: ["식중독", "식품첨가물", "HACCP", "식품 미생물", "식품위생법", "개인위생", "교차오염", "소독과 살균", "보존료", "위생관리"],
  제빵이론: ["스트레이트법", "스펀지법", "발효", "성형", "굽기 공정", "식빵류", "단과자빵", "조리빵", "냉동 반죽", "제품 평가"],
};

function buildQuestions(courseId: number, subjects: { subject: string }[]) {
  const rows: any[] = [];
  let counter = 0;
  for (const { subject } of subjects) {
    const topics = TOPIC_BANK[subject] || ["기본 개념", "응용", "심화", "실무"];
    // 과목당 40문항 (난이도: 쉬움 16 / 보통 12 / 어려움 12) → 모의고사 비율 충족
    const plan: { difficulty: number; count: number }[] = [
      { difficulty: 1, count: 16 },
      { difficulty: 2, count: 12 },
      { difficulty: 3, count: 12 },
    ];
    for (const { difficulty, count } of plan) {
      for (let i = 0; i < count; i++) {
        const topic = topics[(i + difficulty) % topics.length];
        const distractors = topics.filter((t) => t !== topic);
        // 정답 + 오답 3개 구성
        const correct = `${topic}`;
        const wrongs = [distractors[i % distractors.length], distractors[(i + 1) % distractors.length], distractors[(i + 2) % distractors.length]];
        const optionTexts = [correct, ...wrongs];
        // 정답 위치를 순환시켜 다양화
        const answerPos = (counter % 4) + 1;
        const ordered = [...optionTexts];
        // correct 를 answerPos 위치로 이동
        [ordered[0], ordered[answerPos - 1]] = [ordered[answerPos - 1], ordered[0]];

        const diffLabel = difficulty === 1 ? "기초" : difficulty === 2 ? "표준" : "심화";
        rows.push({
          courseId,
          subject,
          content: `[${subject}·${diffLabel}] 다음 중 '${topic}'와(과) 가장 관련이 깊은 개념은 무엇인가?`,
          option1: ordered[0],
          option2: ordered[1],
          option3: ordered[2],
          option4: ordered[3],
          answer: answerPos,
          explanation: `'${topic}'은(는) ${subject}의 핵심 개념입니다. 정답은 ${answerPos}번 '${correct}'이며, 나머지 보기는 관련성이 낮습니다.`,
          difficulty,
          // 각 과목의 쉬움 문제 일부를 무료체험에 포함
          isFree: difficulty === 1 && i < 5,
        });
        counter++;
      }
    }
  }
  return rows;
}

async function main() {
  console.log("🌱 Seeding COOKmaster...");

  // 기존 데이터 정리
  await prisma.userAnswer.deleteMany();
  await prisma.wrongNote.deleteMany();
  await prisma.mockSession.deleteMany();
  await prisma.learningProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.question.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // 관리자 + 데모 학생
  const adminHash = await bcrypt.hash("admin1234", 10);
  const studentHash = await bcrypt.hash("test1234", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@cookmaster.kr",
      passwordHash: adminHash,
      name: "관리자",
      role: "admin",
      emailVerified: true,
    },
  });

  const student = await prisma.user.create({
    data: {
      email: "student@test.com",
      passwordHash: studentHash,
      name: "김요리",
      phone: "010-1234-5678",
      role: "student",
      emailVerified: true,
    },
  });

  console.log(`✔ 사용자 생성: ${admin.email}, ${student.email}`);

  // 과정 + 문제
  let firstCourseId = 0;
  for (const c of COURSES) {
    const course = await prisma.course.create({
      data: {
        slug: c.slug,
        name: c.name,
        category: c.category,
        description: c.description,
        price: c.price,
        durationDays: 90,
        isActive: !c.comingSoon,
      },
    });
    if (!firstCourseId) firstCourseId = course.id;

    const questions = buildQuestions(course.id, c.subjects);
    if (questions.length > 0) await prisma.question.createMany({ data: questions });
    console.log(
      `✔ 과정 [${c.name}] 문제 ${questions.length}개 생성${c.comingSoon ? " (준비 중)" : ""}`,
    );
  }

  // 데모 학생을 첫 과정(한식조리기능사)에 활성 수강 등록
  const expires = new Date();
  expires.setDate(expires.getDate() + 90);
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: firstCourseId,
      status: "active",
      amount: 39000,
      paidAt: new Date(),
      expiresAt: expires,
    },
  });
  console.log("✔ 데모 학생 수강 등록(한식조리기능사, active)");

  console.log("\n🎉 시드 완료!");
  console.log("관리자: admin@cookmaster.kr / admin1234");
  console.log("학생:   student@test.com / test1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
