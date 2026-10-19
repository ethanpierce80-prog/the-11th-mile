'use client';

import { useSyncExternalStore } from 'react';
import { calculatePaces, formatTime } from './pace-utils';

const preferenceEvent = '11th-mile-preferences-changed';

const subscribeToPreferences = (callback) => {
    window.addEventListener('storage', callback);
    window.addEventListener(preferenceEvent, callback);
    return () => {
        window.removeEventListener('storage', callback);
        window.removeEventListener(preferenceEvent, callback);
    };
};

const getPreferenceSnapshot = () => window.localStorage.getItem('11thMilePrefs');
const getServerPreferenceSnapshot = () => null;

const readPreferences = (snapshot) => {
    try {
        return snapshot ? JSON.parse(snapshot) : {};
    } catch {
        return {};
    }
};

const savePreference = (key, value) => {
    const preferences = readPreferences(getPreferenceSnapshot());
    window.localStorage.setItem('11thMilePrefs', JSON.stringify({ ...preferences, [key]: value }));
    window.dispatchEvent(new Event(preferenceEvent));
};

export default function PaceCalculator() {
    const savedPreferences = useSyncExternalStore(
        subscribeToPreferences,
        getPreferenceSnapshot,
        getServerPreferenceSnapshot
    );
    const preferences = readPreferences(savedPreferences);
    const time = preferences.time || '';
    const gender = preferences.gender || 'male';
    const unit = preferences.unit || 'miles';
    const paces = calculatePaces(time, unit, gender);

    const handleTimeInput = (event) => {
        let value = event.target.value.replace(/\D/g, '').slice(0, 4);
        if (value.length > 2) value = `${value.slice(0, 2)}:${value.slice(2)}`;
        savePreference('time', value);
    };

    return (
        <div className="pace-calculator-panel">
            <div className="input-group">
                <label htmlFor="pace-time">5K Time (MM:SS)</label>
                <input
                    id="pace-time"
                    type="text"
                    value={time}
                    onChange={handleTimeInput}
                    className="calc-input"
                    placeholder="20:00"
                    maxLength="5"
                    inputMode="numeric"
                />
            </div>
            <div className="input-group">
                <span className="pace-control-label">Gender</span>
                <div className="gender-toggle">
                    <button type="button" className={`g-btn ${gender === 'male' ? 'active' : ''}`} onClick={() => savePreference('gender', 'male')}>Male</button>
                    <button type="button" className={`g-btn ${gender === 'female' ? 'active' : ''}`} onClick={() => savePreference('gender', 'female')}>Female</button>
                </div>
            </div>
            <div className="input-group">
                <span className="pace-control-label">Units</span>
                <button type="button" className="action-btn" onClick={() => savePreference('unit', unit === 'miles' ? 'km' : 'miles')}>
                    Switch to {unit === 'miles' ? 'KM' : 'Miles'}
                </button>
            </div>
            {paces && (
                <div className="pace-results" aria-live="polite">
                    <div className={`tier-badge tier-${paces.level.toLowerCase()}`}>{paces.level}</div>
                    <div className="res-row"><span className="res-label">Warm Up / Cool Down</span><span className="res-val">{formatTime(paces.warmup)} /{unit === 'miles' ? 'mi' : 'km'}</span></div>
                    <div className="res-row"><span className="res-label">Easy Run</span><span className="res-val">Max {formatTime(paces.easy)} /{unit === 'miles' ? 'mi' : 'km'}</span></div>
                    <div className="res-row"><span className="res-label">Long Run</span><span className="res-val">Conversation pace</span></div>
                    <div className="res-row"><span className="res-label">Tempo</span><span className="res-val">{formatTime(paces.tempo)} /{unit === 'miles' ? 'mi' : 'km'}</span></div>
                    <div className="res-row"><span className="res-label">Threshold</span><span className="res-val">{formatTime(paces.threshold)} /{unit === 'miles' ? 'mi' : 'km'}</span></div>
                    <div className="res-row"><span className="res-label">Intervals</span><span className="res-val">{formatTime(paces.interval)} /{unit === 'miles' ? 'mi' : 'km'}</span></div>
                </div>
            )}
        </div>
    );
}
