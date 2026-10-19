import Link from 'next/link';
import SiteHeader from '../site-header';
import WorkoutSearchList from '../workout-search-list';
import { sessionCategories, sessions } from '../session-data';

export const metadata = {
    title: 'Running Sessions and Workouts | The 11th Mile',
    description: 'Browse running workouts by type, including fartlek, interval, tempo, easy runs, and long runs.'
};

export default function RunningSessionsPage() {
    return (
        <>
            <SiteHeader />
            <main className="editorial-page">
                <nav className="breadcrumbs" aria-label="Breadcrumb">
                    <Link href="/">Home</Link><span>/</span><span>Running Sessions</span>
                </nav>
                <h1>Running Sessions</h1>
                <p className="editorial-lead">Explore structured running sessions by workout type. Choose a category to find session descriptions, distances, and recovery guidance.</p>
                <h2>Find a session</h2>
                <WorkoutSearchList sessions={sessions} showType />
                <div className="category-grid">
                    {sessionCategories.map((category) => (
                        <Link className="category-card" href={`/running-sessions/${category.slug}`} key={category.slug}>
                            <h2>{category.title}</h2>
                            <p>{category.description}</p>
                            <span>Browse sessions</span>
                        </Link>
                    ))}
                </div>
                <p className="editorial-callout">Use the <Link href="/5k-pace-calculator">5K pace calculator</Link> to estimate training paces for your workouts.</p>
            </main>
        </>
    );
}
