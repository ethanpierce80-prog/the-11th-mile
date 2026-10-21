const formatNumber = (value) => value.toFixed(1).replace(/\.0$/, '');

const formatMiles = (value) => {
    if (Math.abs(value - 1) < 0.01) return '1 Mile';
    const precision = value < 1 ? 2 : 1;
    const rounded = Number(value.toFixed(precision));
    return `${rounded.toFixed(precision).replace(/\.?0+$/, '')} Miles`;
};

export const formatDistanceText = (text, unit) => {
    if (!text) return text;

    if (unit === 'km') {
        return text.replace(/(?<![A-Z0-9_])(\d+(?:\.\d+)?)\s*(miles?|mi)\b/gi, (_, amount) => {
            const miles = Number(amount);
            if (miles === 0.25) return '400m';
            if (miles === 0.5) return '800m';
            if (miles === 0.75) return '1200m';
            return `${formatNumber(miles * 1.60934)}km`;
        });
    }

    return text
        .replace(/(?<![A-Z0-9_])(\d+(?:\.\d+)?)\s*km\b/gi, (_, amount) => formatMiles(Number(amount) * 0.621371))
        .replace(/(?<![A-Z0-9_])(\d+(?:\.\d+)?)\s*m\b/gi, (_, amount) => formatMiles(Number(amount) / 1609.34))
        .replace(/(?<![A-Z0-9_])(\d+(?:\.\d+)?)\s*k\b/gi, (_, amount) => formatMiles(Number(amount) * 0.621371));
};
