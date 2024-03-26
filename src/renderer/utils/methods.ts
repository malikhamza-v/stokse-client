export const getTotalPrice = (product: any): number => {
  if (product.taxes === null) {
    return product.sale_price.toFixed(2);
  }
  const totalTaxAmount = product.taxes.reduce(
    (total: number, tax: any) => total + (tax.amount || 0),
    0,
  );
  const totalPrice = product.sale_price + totalTaxAmount;
  return totalPrice.toFixed(2);
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
