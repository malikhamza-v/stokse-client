export const getTotalPrice = (product: any): number => {
  if (product.taxes === null) {
    return parseFloat(product.sale_price).toFixed(2) as unknown as number;
  }
  const totalTaxAmount = product.taxes.reduce(
    (total: number, tax: any) => total + (tax.amount || 0),
    0,
  );
  const totalPrice = product.sale_price + totalTaxAmount;
  return parseFloat(totalPrice).toFixed(2) as unknown as number;
};

export const calculateTaxAmount = (salePrice: number, taxPercent: number) => {
  return ((salePrice * taxPercent) / 100).toFixed(2);
};

export const calculateTaxPercent = (salePrice: number, taxAmount: number) => {
  return ((taxAmount / salePrice) * 100).toFixed(2);
};

export const calculateTotalPaymentAmount = (methods: any) => {
  const totalAmount = methods.reduce(
    (total: number, method: any) => total + (parseFloat(method.amount) || 0),
    0,
  );
  return totalAmount.toFixed(2);
};

export const calculateTotalTaxAmount = (
  taxes: { name: string; amount: string; percent: string }[],
) => {
  const totalAmount = taxes.reduce((accumulator, tax) => {
    if (
      !tax ||
      typeof tax !== 'object' ||
      !('amount' in tax) ||
      !('percent' in tax)
    ) {
      throw new Error('Invalid tax object found in the array.');
    }

    const amount = parseFloat(tax.amount || '0');

    return accumulator + amount;
  }, 0);

  return totalAmount.toFixed(2); // Return total amount with two decimal places
};

export const formatTimestamp = (timestamp: string) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Extract time components
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert hours from 24-hour to 12-hour format
  hours %= 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Format minutes to always have two digits
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  return `${day} ${month} ${year} ${
    formattedMinutes ? `at ${hours}:${formattedMinutes} ${ampm}` : ''
  }`;
};

export const ConvertIntoDecimal = (value: number | string) => {
  return parseFloat(value as string).toFixed(2);
};

export const constructURLWithStoreParam = (
  baseUrl: string,
  storeParam: number,
  businessParam: number,
) => {
  const encodedStoreParam = encodeURIComponent(storeParam);
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}store=${encodedStoreParam}${
    businessParam ? `&business=${businessParam}` : ''
  }`;
};

export const formatDateIntoYYMMDD = (inputDate: string) => {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isElectron = () => {
  return window.electron;
};

export const getDateAndTimeFromSlot = (slot: string) => {
  const date = new Date(slot);

  const optionsDate = { weekday: 'short', day: 'numeric', month: 'short' };
  const formattedDate = date.toLocaleDateString('en-US', optionsDate);

  return {
    date: formattedDate.replace(',', ''),
    time: slot,
  };
};

export const convertTime = (time: string, format: '12' | '24') => {
  const date = new Date(time);

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  if (format === '12') {
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  const [timePart, modifier] = time.split(' ');
  let [tempHours, tempMinutes] = timePart.split(':');
  if (modifier === 'pm' && tempHours !== '12') {
    tempHours = parseInt(tempHours, 10) + 12;
  } else if (modifier === 'am' && tempHours === '12') {
    tempHours = '00';
  }
  return `${tempHours}:${tempMinutes}`;
};

export const handleTimeForAPI = (time: string) => {
  const date = new Date(time);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
};

export const handleCalculateTotalDuration = (services: any) => {
  let totalHours = 0;
  let totalMinutes = 0;

  services.forEach((service: any) => {
    const duration = service.duration;

    // Extract hours and minutes from the duration string
    const hoursMatch = duration.match(/(\d+)h/);
    const minutesMatch = duration.match(/(\d+)min/);

    if (hoursMatch) {
      totalHours += parseInt(hoursMatch[1]);
    }
    if (minutesMatch) {
      totalMinutes += parseInt(minutesMatch[1]);
    }
  });

  totalHours += Math.floor(totalMinutes / 60);
  totalMinutes = totalMinutes % 60;
  return `${totalHours}:${totalMinutes}`;
};

export const addTimeAndDuration = (
  time: string,
  duration: string,
  format: '12' | '24',
) => {
  const date = new Date(time);

  const [hours, minutes] = duration.split(' ').reduce(
    (acc, part: any) => {
      if (part.includes('h')) {
        acc[0] += parseInt(part || '0');
      } else if (part.includes('min')) {
        acc[1] += parseInt(part);
      }
      return acc;
    },
    [0, 0],
  );

  date.setHours(date.getHours() + hours);
  date.setMinutes(date.getMinutes() + minutes);

  if (format === '12') {
    const newHours = date.getHours() % 12 || 12;
    const newMinutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'pm' : 'am';
    return `${newHours}:${newMinutes} ${ampm}`;
  }

  const newHours24 = date.getHours().toString().padStart(2, '0');
  const newMinutes24 = date.getMinutes().toString().padStart(2, '0');
  return `${newHours24}:${newMinutes24}`;
};
