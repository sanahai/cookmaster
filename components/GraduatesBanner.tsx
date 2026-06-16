import { getGraduatesCount } from "@/lib/stats";

export function GraduatesBannerSkeleton() {
  return (
    <section className="bg-primary py-10 text-center">
      <p className="text-2xl font-bold text-white sm:text-3xl">
        지금까지{" "}
        <span className="font-extrabold text-yellow-300">98명</span>이 이 방법으로
        합격했습니다
      </p>
    </section>
  );
}

export default async function GraduatesBanner() {
  const graduates = await getGraduatesCount();

  return (
    <section className="bg-primary py-10 text-center">
      <p className="text-2xl font-bold text-white sm:text-3xl">
        지금까지{" "}
        <span className="font-extrabold text-yellow-300">
          {(graduates + 98).toLocaleString()}명
        </span>
        이 이 방법으로 합격했습니다
      </p>
    </section>
  );
}
