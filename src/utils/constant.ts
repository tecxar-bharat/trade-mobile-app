import { GlobalSegmentsSlug } from '@interfaces/common';
import moment from 'moment';

export const NumberIntValidation = (numbers: string) => {
  if (numbers === null || numbers === undefined || numbers === '') {
    return true;
  }
  const reg = /^\d+$/;
  const isValidate = reg.test(numbers);
  return isValidate ? true : 'Value should be positive whole numbers';
};

export const NumberValidation = (numbers: string) => {
  if (numbers === null || numbers === undefined || numbers === '') {
    return true;
  }
  const reg = /^[0-9]+(\.[0-9]+)?$/;
  const isValidate = reg.test(numbers);
  return isValidate ? true : 'Only Numbers Acceptable';
};

export const toNumber = (x: any) => {
  if (x !== '' && x !== null && x !== undefined && !isNaN(parseFloat(x))) {
    return parseFloat(x);
  }
  if (x === '' || x === null || x === undefined) {
    return x;
  }
  return 0;
};

function getLastThursdayOfMonth(extraMonth?: number) {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth();
  if (extraMonth) {
    month = month + extraMonth;
  }
  // Start from the last day of the month
  const lastDayOfMonth = new Date(year, month + 1, 0);
  // Loop backwards from the last day until we find a Thursday
  for (let day = lastDayOfMonth.getDate(); day >= 1; day--) {
    const currentDate = new Date(year, month, day);
    if (currentDate.getDay() === 4) {
      // Thursday is represented by 4 (0 for Sunday, 1 for Monday, etc.)
      return currentDate;
    }
  }
  return ''; // Return null if a Thursday is not found in the current month
}

export const getLastNineWeeksDates = () => {
  const currentDate = moment().add(1, 'weeks');
  const allWeeks = [];

  // Calculate the date ranges for the last 9 weeks
  for (let i = 0; i < 9; i++) {
    const lastWeekStartDate = moment(currentDate)
      .subtract(i, 'weeks')
      .startOf('isoWeek');
    const lastWeek = getWeekDates(
      lastWeekStartDate,
      lastWeekStartDate.isoWeek(),
    );
    allWeeks.unshift(lastWeek); // Add to the beginning of the array
  }

  return allWeeks;
};

const getWeekDates = (startDate: any, weekNumber: number) => {
  const startOfWeek = moment(startDate).day('Monday').week(weekNumber);
  const endOfWeek = moment(startOfWeek).day('Saturday').endOf('day');
  const weekNumbers = Math.ceil(startDate.date() / 7);
  return {
    start_date: startOfWeek.format('YYYY-MM-DD'),
    end_date: endOfWeek.format('YYYY-MM-DD'),
    date: `${startOfWeek
      .format('MMM')
      .toUpperCase()}-${weekNumbers} (${startOfWeek
        .format('DDMMM')
        .toUpperCase()}-${endOfWeek.format('DDMMM').toUpperCase()})`,
  };
};

function formatDateString(last_Thursday: any) {
  const date = new Date(last_Thursday);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date
    .toLocaleString('default', { month: 'short' })
    .toUpperCase();
  const year = date.getFullYear();

  return `${day}${month}${year}`;
}

const lastThursday = getLastThursdayOfMonth();
export const expiry = formatDateString(lastThursday);
export const nextExpiry = formatDateString(getLastThursdayOfMonth(1));

export const isTodayLastThursdayOfCurrentMonth = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentMonth, 0);
  const lastThursdayOfMonth = new Date(lastDayOfMonth);
  while (lastThursdayOfMonth.getDay() !== 4) {
    lastThursdayOfMonth.setDate(lastThursdayOfMonth.getDate() - 1);
  }
  const todayDate = currentDate.getDate();
  const lastThursdayDate = lastThursdayOfMonth.getDate();
  return todayDate === lastThursdayDate;
};

export const isTodayLastWednesdayOfCurrentMonth = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentMonth, 0);
  const lastThursdayOfMonth = new Date(lastDayOfMonth);

  // Find the last Thursday of the month
  while (lastThursdayOfMonth.getDay() !== 4) {
    // Thursday is represented by 4 (0-indexed)
    lastThursdayOfMonth.setDate(lastThursdayOfMonth.getDate() - 1);
  }

  const todayDate = currentDate.getDate();

  // Get the date of the Wednesday before the last Thursday
  const wednesdayBeforeLastThursday = new Date(lastThursdayOfMonth);
  wednesdayBeforeLastThursday.setDate(lastThursdayOfMonth.getDate() - 1);
  const lastWednesdayDate = wednesdayBeforeLastThursday.getDate();
  return todayDate === lastWednesdayDate;
};

export const addQueryParamsToUrl = (url: string, params: any) => {
  let newUrl: string = url;
  let addedAnyOne = false;
  Object.keys(params).forEach((e: string) => {
    if (params[e]) {
      if (addedAnyOne) {
        newUrl = `${newUrl}&${e}=${params[e]}`;
      } else {
        newUrl = `${newUrl}/?${e}=${params[e]}`;
        addedAnyOne = true;
      }
    }
  });
  return newUrl;
};

export interface IViewData {
  label: string;
  value: any;
}

export const segmentsTypes = [
  { segment: { slug: 'nse_fut', refSlug: 'NFO' } },
  { segment: { slug: 'mcx', refSlug: 'MCX' } },
];

export const isBlank = (str: any) => {
  return str === null || str === undefined || str === '';
};
export const MaxMultiplicationValidation = (multi: string) => {
  if (multi === null || multi === undefined || multi === '') {
    return true;
  }
  const reg = /^[1-9][0-9]*$/;
  const isValidate = reg.test(multi);
  return isValidate ? true : 'Value should be greater than 0';
};

export const onLotChange = ({
  val,
  currentSymbol,
  QuotationLot,
  setValue,
}: {
  val: string;
  currentSymbol: string;
  QuotationLot?: number;
  setValue: any;
}) => {
  if (val) {
    if (currentSymbol.search(/FUTCOM_GOLDM/i) !== -1) {
      setValue('qty', toNumber(val) * 10);
    } else if (currentSymbol.search(/FUTCOM_GOLD/i) !== -1) {
      setValue('qty', toNumber(val) * 100);
    } else if (currentSymbol.search(/FUTCOM_ZINC/i) !== -1) {
      setValue('qty', toNumber(val) * 5000);
    } else if (currentSymbol.search(/FUTCOM_LEAD/i) !== -1) {
      setValue('qty', toNumber(val) * 5000);
    } else if (currentSymbol.search(/FUTCOM_ALUMINIUM/i) !== -1) {
      setValue('qty', toNumber(val) * 5000);
    } else if (QuotationLot) {
      const qty = toNumber(toNumber(val) * QuotationLot!);

      setValue('qty', qty);
    }
  } else {
    setValue('qty', 0);
  }
};

export const onQtyChange = ({
  val,
  currentSymbol,
  QuotationLot,
  setValue,
  exchange,
}: {
  val: string;
  currentSymbol: string;
  QuotationLot?: number;
  setValue: any;
  exchange: string;
}) => {
  if (val) {
    if (currentSymbol.search(/FUTCOM_GOLDM/i) !== -1) {
      setValue('lot', toNumber(val) / 10);
    } else if (currentSymbol.search(/FUTCOM_GOLD/i) !== -1) {
      setValue('lot', toNumber(val) / 100);
    } else if (currentSymbol.search(/FUTCOM_ZINC/i) !== -1) {
      setValue('lot', toNumber(val) / 5000);
    } else if (currentSymbol.search(/FUTCOM_LEAD/i) !== -1) {
      setValue('lot', toNumber(val) / 5000);
    } else if (currentSymbol.search(/FUTCOM_ALUMINIUM/i) !== -1) {
      setValue('lot', toNumber(val) / 5000);
    } else if (QuotationLot) {
      const lot = toNumber(toNumber(val) / QuotationLot!);

      if (
        exchange === GlobalSegmentsSlug.nfoFut ||
        exchange === GlobalSegmentsSlug.nseOpt
      ) {
        setValue('lot', lot.toFixed(4));
      } else {
        setValue('lot', lot);
      }
    }
  } else {
    setValue('lot', 0);
  }
};

export function getDayName(dateString: string) {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const date = new Date(dateString);
  const dayIndex = date.getDay();
  return days[dayIndex];
}

export const dateFormat = 'DD-MM-YYYY hh:mm:ss A';
export const date = 'DD-MM-YYYY'