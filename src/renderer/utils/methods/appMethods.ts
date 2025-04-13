const displayPriceWithCurrency = (price: Number | String, store: any) => {
  const formattedPrice = Number(price || 0).toFixed(2);
  try {
    const currency = store.currency;
    if (currency.position === 'pre')
      return `${currency.symbol}${formattedPrice}`;
    return `${formattedPrice}${currency.symbol}`;
  } catch {
    return `${formattedPrice} n/a`;
  }
};

export { displayPriceWithCurrency };
