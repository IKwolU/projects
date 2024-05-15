import { type ClassValue, clsx } from "clsx";
import {
  ApplicationStage,
  CancellationSources,
  CarClass,
  DayOfWeek,
  FuelType,
  TransmissionType,
} from "../../src/api-client";
import { twMerge } from "tailwind-merge";
import { format, formatDuration } from "date-fns";

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

export function getFormattedTimerValue(
  days: number,
  hours: number,
  minutes: number,
  seconds: number
) {
  const formattedDuration = formatDuration(
    {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    },
    {
      format: ["days", "hours", "minutes", "seconds"],
      delimiter: ".",
    }
  )
    .replace(/days?/g, "д")
    .replace(/hours?/g, "ч")
    .replace(/minutes?/g, "м")
    .replace(/seconds?/g, "с")
    .replace(/\s/g, "");
  return formattedDuration;
}

export const getDayOfWeekDisplayName = (day: DayOfWeek) => {
  const daysOfWeek = {
    [DayOfWeek.Monday]: "Пн",
    [DayOfWeek.Tuesday]: "Вт",
    [DayOfWeek.Wednesday]: "Ср",
    [DayOfWeek.Thursday]: "Чт",
    [DayOfWeek.Friday]: "Пт",
    [DayOfWeek.Saturday]: "Сб",
    [DayOfWeek.Sunday]: "Вск",
  };
  return daysOfWeek[day];
};

export const getCancelationSourceDisplayName = (
  source: CancellationSources
) => {
  const sources = {
    [CancellationSources.Driver]: "Отменена водителем",
    [CancellationSources.Manager]: "Отменена менеджером",
    [CancellationSources.System]: "Истекла",
  };
  return sources[source];
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

export const getApplicationStageDisplayName = (stage: ApplicationStage) => {
  const stages = {
    [ApplicationStage.New]: "Новая заявка",
    [ApplicationStage.InProgress]: "В работе",
    [ApplicationStage.NoAnswer]: "Не берет трубку",
    [ApplicationStage.Thinking]: "Думает",
    [ApplicationStage.ReservationCanceled]: "Отменил бронь",
    [ApplicationStage.ReservationConfirmed]: "Подтвердил бронь",
    [ApplicationStage.ArrivedAtOffice]: "Дошел в офис",
    [ApplicationStage.ArrivedAtOfficeNoCar]: "Дошел в офис не взял авто",
    [ApplicationStage.CarRented]: "Взял авто",
    [ApplicationStage.NotRealized]: "Не реализовано",
  };
  return stages[stage];
};
