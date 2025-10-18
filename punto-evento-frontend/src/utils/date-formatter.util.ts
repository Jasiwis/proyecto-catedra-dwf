import dayjs from "dayjs";

const monthNames = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export const formatDateToSpanish = (date: string | Date): string => {
  const dayjsDate = dayjs(date);
  const day = dayjsDate.date();
  const month = monthNames[dayjsDate.month()];
  const year = dayjsDate.year();

  return `${day} de ${month} del ${year}`;
};

export const formatDateTimeToSpanish = (date: string | Date): string => {
  const dayjsDate = dayjs(date);
  const day = dayjsDate.date();
  const month = monthNames[dayjsDate.month()];
  const year = dayjsDate.year();
  const hour = dayjsDate.hour();
  const minute = dayjsDate.minute();

  return `${day} de ${month} del ${year} a las ${hour
    .toString()
    .padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
};
