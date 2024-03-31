import { addDays, eachDayOfInterval, formatDistance } from 'date-fns';
import { ru } from 'date-fns/locale'

export function getDiffDaysString(startDate: Date | null, endDate: Date | null) {
  return startDate && endDate
    ? formatDistance(addDays(endDate, 1), startDate, { locale: ru })
    : '0 дней';
}

export function getDaysRange(startDate: Date | null, endDate: Date | null) {
  return startDate && endDate
    ? eachDayOfInterval({ start: startDate, end: endDate })
    : [];
}
