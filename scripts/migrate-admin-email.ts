/**
 * beautymaster → COOKmaster 리브랜딩 시 남아 있는 관리자 이메일을 갱신합니다.
 * 기존 DB에 admin@beautymaster.kr 만 있으면 로그인 화면(admin@cookmaster.kr)과 불일치합니다.
 * idempotent — 여러 번 실행해도 안전합니다.
 */
import { PrismaClient } from "@prisma/client";

const OLD_EMAIL = "admin@beautymaster.kr";
const NEW_EMAIL = "admin@cookmaster.kr";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: OLD_EMAIL } });
  if (!existing) {
    const current = await prisma.user.findUnique({ where: { email: NEW_EMAIL } });
    if (current) {
      console.log(`✔ 관리자 이메일이 이미 ${NEW_EMAIL} 입니다.`);
    } else {
      console.log(`ℹ ${OLD_EMAIL} 계정이 없습니다. 변경할 항목 없음.`);
    }
    return;
  }

  const conflict = await prisma.user.findUnique({ where: { email: NEW_EMAIL } });
  if (conflict) {
    console.error(
      `✖ ${NEW_EMAIL} 계정이 이미 존재합니다. ${OLD_EMAIL} 계정을 수동으로 정리해 주세요.`
    );
    process.exit(1);
  }

  await prisma.user.update({
    where: { email: OLD_EMAIL },
    data: { email: NEW_EMAIL },
  });

  console.log(`✔ 관리자 이메일 변경: ${OLD_EMAIL} → ${NEW_EMAIL}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
