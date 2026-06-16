// 요리·제과제빵 자격증 6종의 과목 구성 및 출제 비율

export type SubjectRatio = { subject: string; ratio: number };

export type CourseConfig = {
  slug: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  price: number;
  subjects: SubjectRatio[];
  comingSoon?: boolean; // true면 메뉴/아이콘만 노출, 수강·학습은 차후 오픈
};

// 조리기능사 패키지(4종 전체)에 포함되는 카테고리
export const PACKAGE_CATEGORY = "조리기능사";

export const COURSES: CourseConfig[] = [
  {
    slug: "cook-korean",
    name: "한식조리기능사 필기",
    category: "조리기능사",
    icon: "🍚",
    description: "식품위생·식품학·조리이론·공중보건·한식조리",
    price: 39000,
    subjects: [
      { subject: "식품위생및관련법규", ratio: 0.2 },
      { subject: "식품학", ratio: 0.2 },
      { subject: "조리이론과원가계산", ratio: 0.25 },
      { subject: "공중보건", ratio: 0.15 },
      { subject: "한식조리실무", ratio: 0.2 },
    ],
  },
  {
    slug: "cook-western",
    name: "양식조리기능사 필기",
    category: "조리기능사",
    icon: "🍝",
    description: "식품위생·식품학·조리이론·공중보건·양식조리",
    price: 39000,
    subjects: [
      { subject: "식품위생및관련법규", ratio: 0.2 },
      { subject: "식품학", ratio: 0.2 },
      { subject: "조리이론과원가계산", ratio: 0.25 },
      { subject: "공중보건", ratio: 0.15 },
      { subject: "양식조리실무", ratio: 0.2 },
    ],
  },
  {
    slug: "cook-chinese",
    name: "중식조리기능사 필기",
    category: "조리기능사",
    icon: "🥟",
    description: "식품위생·식품학·조리이론·공중보건·중식조리",
    price: 39000,
    subjects: [
      { subject: "식품위생및관련법규", ratio: 0.2 },
      { subject: "식품학", ratio: 0.2 },
      { subject: "조리이론과원가계산", ratio: 0.25 },
      { subject: "공중보건", ratio: 0.15 },
      { subject: "중식조리실무", ratio: 0.2 },
    ],
  },
  {
    slug: "cook-japanese",
    name: "일식조리기능사 필기",
    category: "조리기능사",
    icon: "🍣",
    description: "식품위생·식품학·조리이론·공중보건·일식조리",
    price: 39000,
    subjects: [
      { subject: "식품위생및관련법규", ratio: 0.2 },
      { subject: "식품학", ratio: 0.2 },
      { subject: "조리이론과원가계산", ratio: 0.25 },
      { subject: "공중보건", ratio: 0.15 },
      { subject: "일식조리실무", ratio: 0.2 },
    ],
  },
  {
    slug: "confectionery",
    name: "제과기능사 필기",
    category: "제과",
    icon: "🍰",
    description: "제과이론·재료과학·영양학·식품위생",
    price: 39000,
    subjects: [
      { subject: "제과이론", ratio: 0.3 },
      { subject: "재료과학", ratio: 0.25 },
      { subject: "영양학", ratio: 0.2 },
      { subject: "식품위생및법규", ratio: 0.25 },
    ],
  },
  {
    slug: "breadmaking",
    name: "제빵기능사 필기",
    category: "제빵",
    icon: "🍞",
    description: "제빵이론·재료과학·영양학·식품위생",
    price: 39000,
    subjects: [
      { subject: "제빵이론", ratio: 0.3 },
      { subject: "재료과학", ratio: 0.25 },
      { subject: "영양학", ratio: 0.2 },
      { subject: "식품위생및법규", ratio: 0.25 },
    ],
  },
];

export const PACKAGE_PRICE = 79000;
export const EXTEND_PRICE = 19000;

export function getCourseConfig(slug: string): CourseConfig | undefined {
  return COURSES.find((c) => c.slug === slug);
}

// 모의고사 회차별 난이도 비율 (easy:normal:hard)
export const MOCK_CONFIG: Record<
  number,
  { name: string; difficulty: string; easy: number; normal: number; hard: number }
> = {
  1: { name: "쉬움", difficulty: "easy", easy: 0.7, normal: 0.2, hard: 0.1 },
  2: { name: "보통", difficulty: "normal", easy: 0.2, normal: 0.6, hard: 0.2 },
  3: { name: "어려움", difficulty: "hard", easy: 0.1, normal: 0.2, hard: 0.7 },
  4: { name: "실전1", difficulty: "real", easy: 0.25, normal: 0.5, hard: 0.25 },
  5: { name: "실전2", difficulty: "real", easy: 0.25, normal: 0.5, hard: 0.25 },
  6: { name: "실전3", difficulty: "real", easy: 0.25, normal: 0.5, hard: 0.25 },
};
