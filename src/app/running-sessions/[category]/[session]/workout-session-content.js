'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { formatDistanceText } from '../../../distance-format';
import { useDistanceUnit } from '../../../distance-unit';
import { calculatePaces, formatTime } from '../../../pace-utils';
import { getReducedIntervalWorkout, getSessionDisplayTitle } from '../../../session-data';

const preferencesEvent = '11th-mile-preferences-changed';
const subscribeToPreferences = (callback) => {
    window.addEventListener('storage', callback);
    window.addEventListener(preferencesEvent, callback);
    return () => {
        window.removeEventListener('storage', callback);
        window.removeEventListener(preferencesEvent, callback);
    };
};
const getPreferencesSnapshot = () => window.localStorage.getItem('11thMilePrefs');
const getServerPreferencesSnapshot = () => null;

const formatPaces = (text, paces, unit) => {
    if (!paces) return text.replace(/\[(.*?)\]/g, (_, pace) => pace.toLowerCase().replace('_', ' '));
    return text
        .replace(/\[PACE_10K\]/g, `10k pace (${formatTime(paces.race10k)} /${unit === 'miles' ? 'mi' : 'km'})`)
        .replace(/\[PACE_5K\]/g, `5k pace (${formatTime(paces.race5k)} /${unit === 'miles' ? 'mi' : 'km'})`)
        .replace(/\[PACE_3K\]/g, `3k pace (${formatTime(paces.race3k)} /${unit === 'miles' ? 'mi' : 'km'})`)
        .replace(/\[PACE_1500M\]/g, `1500m pace (${formatTime(paces.race1500)} /${unit === 'miles' ? 'mi' : 'km'})`)
        .replace(/\[(.*?)\]/g, (_, pace) => pace.toLowerCase().replace('_', ' '));
};

export default function WorkoutSessionContent({ session, category }) {
    const unit = useDistanceUnit();
    const savedPreferences = useSyncExternalStore(
        subscribeToPreferences,
        getPreferencesSnapshot,
        getServerPreferencesSnapshot
    );
    let preferences = {};
    try {
        preferences = savedPreferences ? JSON.parse(savedPreferences) : {};
    } catch (error) {
        console.error('Unable to read saved pace preferences:', error);
    }
    const paces = calculatePaces(preferences.time || '', unit, preferences.gender || 'male');
    const [isReduced, setIsReduced] = useState(false);
    const reducedWorkout = getReducedIntervalWorkout(session, unit);
    const displayedSession = isReduced && reducedWorkout
        ? { ...session, ...reducedWorkout }
        : session;
    const title = getSessionDisplayTitle(displayedSession);

    return (
        <main className="editorial-page">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
                <Link href="/">Home</Link><span>/</span>
                <Link href="/running-sessions">Running Sessions</Link><span>/</span>
                <Link href={`/running-sessions/${category.slug}`}>{category.title}</Link><span>/</span>
                <span>{formatDistanceText(title, unit)}</span>
            </nav>
            <p className="workout-category">{session.category} session · {session.difficulty} · {formatDistanceText(`${session.distanceVal} Miles`, unit)}</p>
            <h1>{formatDistanceText(title, unit)}</h1>
            <p className="editorial-lead">{formatDistanceText(session.summary, unit)}</p>
            {reducedWorkout && (
                <div className="reduced-session-controls">
                    <button className="action-btn reduce-session-btn" disabled={!reducedWorkout.hasReps} onClick={() => setIsReduced((reduced) => !reduced)}>
                        {isReduced ? 'Show Original Session' : 'Reduce Session'}
                    </button>
                    {!reducedWorkout.hasReps ? (
                        <p className="reduced-session-note">This session contains only tempo efforts, so removing them leaves no reps to reduce.</p>
                    ) : isReduced ? (
                        <p className="reduced-session-note">Tempo efforts have been removed and 200m has been taken off each remaining rep. Reps of 200m or less are removed. Recovery is unchanged.</p>
                    ) : (
                        <p className="reduced-session-note">The reduced version removes tempo efforts and takes 200m off each remaining rep. Recovery stays the same.</p>
                    )}
                </div>
            )}
            <section className="workout-details">
                {isReduced && !reducedWorkout?.hasReps && <p>This session contains only tempo efforts, so removing them leaves no reps to reduce.</p>}
                {displayedSession.sessionDetail && <><h2>Session</h2><p>{formatDistanceText(displayedSession.sessionDetail, unit)}</p></>}
                {displayedSession.breakdown && <><h2>Workout breakdown</h2><p>{formatPaces(formatDistanceText(displayedSession.breakdown, unit), paces, unit)}</p></>}
                <h2>Recovery</h2>
                <p>{formatDistanceText(displayedSession.recoveryDetail, unit)}</p>
                {displayedSession.pacesList.length > 0 && <><h2>Training paces</h2><ul>{displayedSession.pacesList.map((pace) => <li key={pace}>{formatPaces(formatDistanceText(pace, unit), paces, unit)}</li>)}</ul></>}
            </section>
            <p className="editorial-callout">Estimate personalized paces with the <Link href="/5k-pace-calculator">5K pace calculator</Link>. Adjust any workout for your experience, conditions, and recovery.</p>
            <Link className="back-link" href={`/running-sessions/${category.slug}`}>Browse more {category.title.toLowerCase()}</Link>
        </main>
    );
}
