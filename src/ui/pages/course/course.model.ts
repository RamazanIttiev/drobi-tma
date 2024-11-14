export interface Course {
  id: number;
  title: string;
  shortDescription?: string;
  description: string;
  image: string;
}

export type CourseLevel = "5-8" | "9" | "10-11";
export type CourseDuration = "60" | "90";
export type CourseType = "individual" | "group";
export type CourseQuantity = "1" | "4" | "8";

export const levels: CourseLevel[] = ["5-8", "9", "10-11"];
export const durations: CourseDuration[] = ["60", "90"];
export const types: CourseType[] = ["individual", "group"];
export const quantity: CourseQuantity[] = ["1", "4", "8"];

export const levelLocalization: Record<CourseLevel, string> = {
  "5-8": "5-8 класс",
  "9": "9 класс",
  "10-11": "10-11 класс",
};

export const durationLocalization: Record<CourseDuration, string> = {
  "60": "60 минут",
  "90": "90 минут",
};

export const typeLocalization: Record<CourseType, string> = {
  individual: "Индивидуально",
  group: "В группе",
};

const basePrices = {
  "5-8": 800,
  "9": 800,
  "10-11": 1000,
};

const quantityRates = {
  "1": 1,
  "4": 4,
  "8": 8,
};

const typeRates = {
  individual: 1,
  group: 0.75,
};

const durationRates = {
  "60": 1,
  "90": 1.5,
};

export const calculatePrice = (
  level: CourseLevel,
  quantity: CourseQuantity,
  type: CourseType,
  duration: CourseDuration,
): number => {
  const basePrice = basePrices[level];
  const quantityMultiplier = quantityRates[quantity];
  const typeMultiplier = typeRates[type];
  const durationMultiplier = durationRates[duration];

  const price =
    basePrice * quantityMultiplier * typeMultiplier * durationMultiplier;

  if (type === "group" && duration === "90") {
    switch (level) {
      case "5-8":
      case "9": {
        if (quantity === "4") {
          return price - basePrices["5-8"];
        } else {
          return price - basePrices["5-8"] * 2;
        }
      }
      case "10-11":
        return price * 0.8;
    }
  }

  return price;
};
