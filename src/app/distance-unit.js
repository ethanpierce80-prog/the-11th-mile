'use client';

import { useSyncExternalStore } from 'react';

const preferenceEvent = '11th-mile-preferences-changed';

const subscribe = (callback) => {
    window.addEventListener('storage', callback);
    window.addEventListener(preferenceEvent, callback);
    return () => {
        window.removeEventListener('storage', callback);
        window.removeEventListener(preferenceEvent, callback);
    };
};

const getSnapshot = () => {
    try {
        const preferences = JSON.parse(window.localStorage.getItem('11thMilePrefs') || '{}');
        return preferences.unit === 'km' ? 'km' : 'miles';
    } catch {
        return 'miles';
    }
};

const getServerSnapshot = () => 'miles';

export const useDistanceUnit = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export const saveDistanceUnit = (unit) => {
    try {
        const preferences = JSON.parse(window.localStorage.getItem('11thMilePrefs') || '{}');
        window.localStorage.setItem('11thMilePrefs', JSON.stringify({ ...preferences, unit }));
        window.dispatchEvent(new Event(preferenceEvent));
    } catch (error) {
        console.error('Unable to save distance unit preference:', error);
    }
};
