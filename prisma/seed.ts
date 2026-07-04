import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { COURSES, COURSE_PRICE } from "../lib/courses";
import { buildSampleQuestions } from "../lib/sample-questions";

const prisma = new PrismaClient();

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

    const questions = buildSampleQuestions(course.id, c.subjects);
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
      amount: COURSE_PRICE,
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
