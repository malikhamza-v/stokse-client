const displayPriceWithCurrency = (price: Number | String, store: any) => {
  const currency = store.currency;
  const formattedPrice = Number(price || 0).toFixed(2);
  if (currency.position === 'pre') return `${currency.symbol}${formattedPrice}`;
  return `${formattedPrice}${currency.symbol}`;
};

export { displayPriceWithCurrency };
