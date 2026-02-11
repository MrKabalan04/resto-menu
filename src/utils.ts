export const formatPrice = (price: number, displayCurrency: 'USD' | 'LBP', rate: number, baseCurrency: 'USD' | 'LBP' = 'USD'): string => {
    let finalPrice = price;

    if (baseCurrency === 'USD' && displayCurrency === 'LBP') {
        finalPrice = price * rate;
    } else if (baseCurrency === 'LBP' && displayCurrency === 'USD') {
        finalPrice = price / rate;
    }

    if (displayCurrency === 'USD') {
        return `$${finalPrice.toFixed(2)}`;
    } else {
        // Round LBP to nearest 1000 for cleaner display (optional, but professional)
        const roundedLBP = Math.round(finalPrice / 1000) * 1000;
        return `${roundedLBP.toLocaleString()} LBP`;
    }
};
