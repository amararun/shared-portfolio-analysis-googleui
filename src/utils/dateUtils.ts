/**
 * Formats a Date object to YYYY-MM-DD string.
 * @param date The Date object to format.
 * @returns The formatted date string.
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Gets yesterday's date as a YYYY-MM-DD string.
 * @returns Yesterday's date string.
 */
export const getYesterdayDateString = (): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return formatDate(yesterday);
};

/**
 * Gets a date N months ago from a given end date, as a YYYY-MM-DD string.
 * @param months The number of months to go back.
 * @param endDateString The end date string (YYYY-MM-DD) to calculate from. Defaults to yesterday.
 * @returns The date string N months ago.
 */
export const getMonthsAgoDateString = (months: number, endDateString?: string): string => {
  const endDate = endDateString ? new Date(endDateString) : new Date(getYesterdayDateString());
  const pastDate = new Date(endDate);
  pastDate.setMonth(endDate.getMonth() - months);
  return formatDate(pastDate);
};

/**
 * Gets a date N years ago from a given end date, as a YYYY-MM-DD string.
 * @param years The number of years to go back.
 * @param endDateString The end date string (YYYY-MM-DD) to calculate from. Defaults to yesterday.
 * @returns The date string N years ago.
 */
export const getYearsAgoDateString = (years: number, endDateString?: string): string => {
  const endDate = endDateString ? new Date(endDateString) : new Date(getYesterdayDateString());
  const pastDate = new Date(endDate);
  pastDate.setFullYear(endDate.getFullYear() - years);
  return formatDate(pastDate);
};
