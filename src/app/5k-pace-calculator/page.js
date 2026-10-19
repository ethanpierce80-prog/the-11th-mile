import Link from 'next/link';
import PaceCalculator from '../pace-calculator';
import SiteHeader from '../site-header';

export const metadata = {
    title: '5K Pace Calculator | The 11th Mile',
    description: 'Enter your 5K time to estimate personalized running paces for easy, long, tempo, threshold, and interval training.'
};

export default function FiveKCalculatorPage() {
    return (
        <>
            <SiteHeader />
            <main className="editorial-page">
                <nav className="breadcrumbs" aria-label="Breadcrumb">
                    <Link href="/">Home</Link><span>/</span><span>5K Pace Calculator</span>
                </nav>
                <h1>5K Pace Calculator</h1>
                <p className="editorial-lead">
                    Enter your recent 5K time to estimate training paces for easy runs, long runs, tempo efforts, threshold workouts, and intervals.
                </p>
                <PaceCalculator />
                <section className="editorial-section">
                    <h2>How to use the calculator</h2>
                    <p>Use a recent 5K result and choose the units you want to train in. The calculator estimates pace guidance from that time; use it as a starting point and adjust for terrain, weather, and how you feel.</p>
                    <p>New to structured running? Browse the <Link href="/running-sessions">running session library</Link> for workouts that use these pace types.</p>
                </section>
            </main>
        </>
    );
}
