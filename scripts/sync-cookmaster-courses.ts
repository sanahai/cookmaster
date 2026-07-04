/**
 * beautymaster 잔존 과정(미용·이용·문신)을 COOKmaster 6종으로 교체합니다.
 * 기존 beautymaster 과정의 학습·수강 데이터는 삭제되며, cookmaster 과정과 샘플 문제가 생성됩니다.
 */
import { PrismaClient } from "@prisma/client";
import { COURSES } from "../lib/courses";
import { buildSampleQuestions } from "../lib/sample-questions";

const LEGACY_SLUG_PREFIXES = ["beauty-", "barber", "tattoo"];

const prisma = new PrismaClient();

async function deleteCourseData(courseIds: number[]) {
  if (courseIds.length === 0) return;
  await prisma.userAnswer.deleteMany({ where: { question: { courseId: { in: courseIds } } } });
  await prisma.wrongNote.deleteMany({ where: { question: { courseId: { in: courseIds } } } });
  await prisma.questionReport.deleteMany({ where: { question: { courseId: { in: courseIds } } } });
  await prisma.mockSession.deleteMany({ where: { courseId: { in: courseIds } } });
  await prisma.learningProgress.deleteMany({ where: { courseId: { in: courseIds } } });
  await prisma.enrollment.deleteMany({ where: { courseId: { in: courseIds } } });
  await prisma.question.deleteMany({ where: { courseId: { in: courseIds } } });
  await prisma.course.deleteMany({ where: { id: { in: courseIds } } });
}

async function main() {
  console.log("🍳 COOKmaster 과정 동기화 시작...");

  const allCourses = await prisma.course.findMany();
  const legacy = allCourses.filter(
    (c) => LEGACY_SLUG_PREFIXES.some((p) => c.slug === p || c.slug.startsWith(p))
  );
  const cookSlugs = new Set(COURSES.map((c) => c.slug));

  if (legacy.length > 0) {
    console.log(`✖ beautymaster 잔존 과정 ${legacy.length}개 삭제: ${legacy.map((c) => c.slug).join(", ")}`);
    await deleteCourseData(legacy.map((c) => c.id));
  }

  for (const c of COURSES) {
    const existing = await prisma.course.findUnique({ where: { slug: c.slug } });
    let courseId: number;

    if (existing) {
      await prisma.course.update({
        where: { slug: c.slug },
        data: {
          name: c.name,
          category: c.category,
          description: c.description,
          price: c.price,
          isActive: !c.comingSoon,
        },
      });
      courseId = existing.id;
      console.log(`✔ 과정 갱신: ${c.name}`);
    } else {
      const created = await prisma.course.create({
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
      courseId = created.id;
      console.log(`✔ 과정 생성: ${c.name}`);
    }

    const qCount = await prisma.question.count({ where: { courseId } });
    if (qCount === 0) {
      const questions = buildSampleQuestions(courseId, c.subjects);
      if (questions.length > 0) {
        await prisma.question.createMany({ data: questions });
      }
      console.log(`  → 샘플 문제 ${questions.length}개 생성`);
    } else {
      console.log(`  → 기존 문제 ${qCount}개 유지`);
    }
  }

  const final = await prisma.course.findMany({ orderBy: { id: "asc" } });
  const unexpected = final.filter((c) => !cookSlugs.has(c.slug));
  if (unexpected.length > 0) {
    console.warn(`⚠ cookmaster 외 과정 ${unexpected.length}개 남음: ${unexpected.map((c) => c.slug).join(", ")}`);
  }

  console.log("\n🎉 동기화 완료!");
  console.log(final.map((c) => `  · ${c.name} (${c.price.toLocaleString()}원)`).join("\n"));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
