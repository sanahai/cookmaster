import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";

/** 누적 합격생 수 — 5분 캐시로 DB 왕복·Neon 콜드스타트 부담 감소 */
export const getGraduatesCount = unstable_cache(
  async () => {
    try {
      return await prisma.learningProgress.count({
        where: { wrongMockDone: true, user: { role: { not: "admin" } } },
      });
    } catch {
      return 0;
    }
  },
  ["graduates-count"],
  { revalidate: 300 },
);
