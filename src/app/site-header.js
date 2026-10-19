'use client';

import Link from 'next/link';

export default function SiteHeader() {
    return (
        <header>
            <Link className="logo" href="/">The 11th Mile</Link>
            <div className="sub-logo">Performance Laboratory // England</div>
            <nav className="site-nav" aria-label="Main navigation">
                <Link href="/running-sessions">Running Sessions</Link>
                <Link href="/5k-pace-calculator">5K Pace Calculator</Link>
            </nav>
        </header>
    );
}
