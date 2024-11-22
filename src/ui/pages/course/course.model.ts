export interface Course {
  id: string;
  title: string;
  shortDescription?: string;
  description: string;
  image: string;
}

export interface CourseConfig {
  selectedLevel: CourseLevel;
  selectedQuantity: CourseQuantity;
  selectedType: CourseType;
  selectedDuration: CourseDuration;
}

export type CourseLevel = "5-8 класс" | "9 класс" | "10-11 класс";
export type CourseDuration = "60 минут" | "90 минут";
export type CourseType = "Индивидуально" | "В группе";
export type CourseQuantity = "1" | "4" | "8";

export const levels: CourseLevel[] = ["5-8 класс", "9 класс", "10-11 класс"];
export const durations: CourseDuration[] = ["60 минут", "90 минут"];
export const types: CourseType[] = ["Индивидуально", "В группе"];
export const quantity: CourseQuantity[] = ["1", "4", "8"];

const basePrices = {
  "5-8 класс": 800,
  "9 класс": 800,
  "10-11 класс": 1000,
};

const quantityRates = {
  "1": 1,
  "4": 4,
  "8": 8,
};

const typeRates = {
  Индивидуально: 1,
  "В группе": 0.75,
};

const durationRates = {
  "60 минут": 1,
  "90 минут": 1.5,
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

  if (type === "В группе" && duration === "90 минут") {
    switch (level) {
      case "5-8 класс":
      case "9 класс": {
        if (quantity === "4") {
          return price - basePrices["5-8 класс"];
        } else {
          return price - basePrices["5-8 класс"] * 2;
        }
      }
      case "10-11 класс":
        return price * 0.8;
    }
  }

  return price;
};
