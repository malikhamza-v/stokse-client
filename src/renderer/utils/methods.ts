const getTotalPrice = (product: any): number => {
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

const calculateTaxAmount = (salePrice: number, taxPercent: number) => {
  return (salePrice * taxPercent) / 100;
};

const calculateTaxPercent = (salePrice: number, taxAmount: number) => {
  return (taxAmount / salePrice) * 100;
};

export { getTotalPrice, calculateTaxAmount, calculateTaxPercent };
