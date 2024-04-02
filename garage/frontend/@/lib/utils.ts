import { type ClassValue, clsx } from "clsx";
import {
  CarClass,
  DayOfWeek,
  FuelType,
  TransmissionType,
  Working_hours5,
} from "../../src/api-client";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { forEach } from "ramda";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFuelTypeDisplayName(x: FuelType | undefined | null) {
  if (!x) {
    return "Топливо";
  }

  const dict = {
    [FuelType.Propane]: "Пропан",
    [FuelType.Gasoline]: "Бензин",
    [FuelType.Methane]: "Метан",
    [FuelType.Electric]: "Электро",
  };

  return dict[x];
}

export function getTransmissionDisplayName(
  x: TransmissionType | undefined | null
) {
  if (!x) {
    return "Трансмиссия";
  }

  const dict = {
    [TransmissionType.Automatic]: "Автомат",
    [TransmissionType.Mechanics]: "Механика",
  };

  return dict[x];
}

export const formatRoubles = (amount: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    maximumSignificantDigits: 3,
    currency: "RUB",
  }).format(amount);

export function formatWorkingTime(hours: number, minutes: number) {
  return `${format(new Date(2000, 0, 0, hours, minutes), "HH:mm")}`;
}

export const CheckWorkingHours = (workingHours: Working_hours5[]) => {
  const monday = `${workingHours[0].start?.hours}:${workingHours[0].start?.minutes}:${workingHours[0].end?.hours}:${workingHours[0].end?.minutes}`;
  const tuesday = `${workingHours[1].start?.hours}:${workingHours[1].start?.minutes}:${workingHours[1].end?.hours}:${workingHours[1].end?.minutes}`;
  const wednesday = `${workingHours[2].start?.hours}:${workingHours[2].start?.minutes}:${workingHours[2].end?.hours}:${workingHours[2].end?.minutes}`;
  const thursday = `${workingHours[3].start?.hours}:${workingHours[3].start?.minutes}:${workingHours[3].end?.hours}:${workingHours[3].end?.minutes}`;
  const friday = `${workingHours[4].start?.hours}:${workingHours[4].start?.minutes}:${workingHours[4].end?.hours}:${workingHours[4].end?.minutes}`;

  if (
    monday === tuesday &&
    tuesday === wednesday &&
    wednesday === thursday &&
    thursday === friday
  ) {
    return false;
  } else {
    return true;
  }
};

export const getDayOfWeekDisplayName = (day: DayOfWeek) => {
  const daysOfWeek = {
    [DayOfWeek.Monday]: "понедельник",
    [DayOfWeek.Tuesday]: "вторник",
    [DayOfWeek.Wednesday]: "среда",
    [DayOfWeek.Thursday]: "четверг",
    [DayOfWeek.Friday]: "пятница",
    [DayOfWeek.Saturday]: "суббота",
    [DayOfWeek.Sunday]: "воскресенье",
  };
  return daysOfWeek[day];
};

export const getCarClassDisplayName = (carClass: CarClass) => {
  const carClasses = {
    [CarClass.Economy]: "Эконом",
    [CarClass.Comfort]: "Комфорт",
    [CarClass.ComfortPlus]: "Комфорт плюс",
    [CarClass.Business]: "Бизнес",
  };

  for (const [key, value] of Object.entries(carClasses)) {
    if (key === carClass) {
      return value;
    }
  }

  return "Эконом";
};
