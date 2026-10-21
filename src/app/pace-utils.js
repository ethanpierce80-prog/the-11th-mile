export const parseTime = (value) => {
    if (!value || !value.includes(':')) return 0;
    const [minutes, seconds] = value.split(':').map(Number);
    if (!Number.isFinite(minutes) || !Number.isFinite(seconds) || seconds > 59) return 0;
    return (minutes * 60) + seconds;
};

export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export const calculatePaces = (time, unit, gender) => {
    const totalSeconds = parseTime(time);
    if (totalSeconds <= 0) return null;

    const averagePace = unit === 'miles' ? totalSeconds / 3.10686 : totalSeconds / 5;
    const conversion = unit === 'miles' ? 1 : 0.621371;
    const racePace = (distanceKm) => {
        const predictedTime = totalSeconds * ((distanceKm / 5) ** 1.06);
        const pacePerKm = predictedTime / distanceKm;
        return unit === 'miles' ? pacePerKm * 1.60934 : pacePerKm;
    };
    const minutes = totalSeconds / 60;
    const level = gender === 'male'
        ? (minutes < 16 ? 'Elite' : minutes < 20 ? 'Advanced' : minutes < 25 ? 'Intermediate' : 'Beginner')
        : (minutes < 18 ? 'Elite' : minutes < 23 ? 'Advanced' : minutes < 28 ? 'Intermediate' : 'Beginner');

    return {
        interval: averagePace - (10 * conversion),
        threshold: averagePace + (20 * conversion),
        tempo: averagePace + (40 * conversion),
        float: averagePace + (70 * conversion),
        long: averagePace + (105 * conversion),
        easy: averagePace + (95 * conversion),
        race10k: racePace(10),
        race5k: racePace(5),
        race3k: racePace(3),
        race1500: racePace(1.5),
        warmup: averagePace + (135 * conversion),
        level
    };
};
