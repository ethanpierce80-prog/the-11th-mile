'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getSessionUrl, matchesSessionSearch } from './session-data';

export default function WorkoutSearchList({ sessions, showType = false }) {
    const [search, setSearch] = useState('');
    const filteredSessions = sessions.filter((session) => matchesSessionSearch(session, search));

    return (
        <>
            <label className="session-search-label" htmlFor="category-session-search">Find a workout</label>
            <input
                id="category-session-search"
                className="session-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, distance, or type"
            />
            <div className="workout-list">
                {filteredSessions.map((session) => (
                    <Link className="workout-list-item" href={getSessionUrl(session)} key={session.id}>
                        <span>
                            <strong>{session.title}</strong>
                            <span>{showType ? `${session.category} · ` : ''}{session.summary}</span>
                        </span>
                        <span className="workout-distance">{session.distanceVal} miles</span>
                    </Link>
                ))}
                {filteredSessions.length === 0 && (
                    <p className="no-results">No sessions match “{search}”. Try a different name, distance, or type.</p>
                )}
            </div>
        </>
    );
}
