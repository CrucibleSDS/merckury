export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const parseDate = (date: string): Date => {
  const [year, month, day] = date.split("-");
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};
