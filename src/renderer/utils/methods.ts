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

  return `${day} ${month} ${year}`;
};

export const ConvertIntoDecimal = (value: number | string) => {
  return parseFloat(value as string).toFixed(2);
};
