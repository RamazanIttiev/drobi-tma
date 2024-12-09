export interface PersonalDetails {
  name: string;
  email: string;
  phone: string;
}

export const validateField = (
  field: keyof PersonalDetails,
  value: string,
): string | undefined => {
  switch (field) {
    case "name":
      if (!value.trim()) return "Имя обязательно.";
      if (value.length < 2) return "Имя должно содержать не менее 2 символов.";
      break;
    case "email": {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) return "Email обязателен.";
      if (!emailRegex.test(value)) return "Введите корректный email.";
      break;
    }
    case "phone": {
      const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
      if (!value.trim()) return "Телефон обязателен.";
      if (!phoneRegex.test(value))
        return "Введите корректный телефон (+7 (XXX) XXX-XX-XX).";
      break;
    }
    default:
      return undefined;
  }
};
