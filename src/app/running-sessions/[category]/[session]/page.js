import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '../../../site-header';
import { sessionCategories, sessions, slugify, getCategoryForSession } from '../../../session-data';

export function generateStaticParams() {
    return sessions.map((session) => {
        const category = getCategoryForSession(session);
        return { category: category.slug, session: slugify(session.title) };
    });
}

export async function generateMetadata({ params }) {
    const { category: categorySlug, session: sessionSlug } = await params;
    const session = sessions.find((item) => {
        const category = getCategoryForSession(item);
        return category.slug === categorySlug && slugify(item.title) === sessionSlug;
    });
    if (!session) return {};

    return {
        title: `${session.title} Running Session | The 11th Mile`,
        description: `${session.summary} ${session.distanceVal} mile ${session.category.toLowerCase()} workout.`
    };
}

export default async function RunningSessionPage({ params }) {
    const { category: categorySlug, session: sessionSlug } = await params;
    const session = sessions.find((item) => {
        const category = getCategoryForSession(item);
        return category.slug === categorySlug && slugify(item.title) === sessionSlug;
    });
    if (!session) notFound();

    const category = sessionCategories.find(({ slug }) => slug === categorySlug);

    return (
        <>
            <SiteHeader />
            <main className="editorial-page">
                <nav className="breadcrumbs" aria-label="Breadcrumb">
                    <Link href="/">Home</Link><span>/</span>
                    <Link href="/running-sessions">Running Sessions</Link><span>/</span>
                    <Link href={`/running-sessions/${category.slug}`}>{category.title}</Link><span>/</span>
                    <span>{session.title}</span>
                </nav>
                <p className="workout-category">{session.category} session · {session.difficulty} · {session.distanceVal} miles</p>
                <h1>{session.title}</h1>
                <p className="editorial-lead">{session.summary}</p>
                <section className="workout-details">
                    <h2>Session</h2>
                    <p>{session.sessionDetail}</p>
                    <h2>Workout breakdown</h2>
                    <p>{session.breakdown.replace(/\[(.*?)\]/g, (_, pace) => pace.toLowerCase().replace('_', ' '))}</p>
                    <h2>Recovery</h2>
                    <p>{session.recoveryDetail}</p>
                    <h2>Training paces</h2>
                    <ul>{session.pacesList.map((pace) => <li key={pace}>{pace.replace(/\[(.*?)\]/g, (_, name) => name.toLowerCase().replace('_', ' '))}</li>)}</ul>
                </section>
                <p className="editorial-callout">Estimate personalized paces with the <Link href="/5k-pace-calculator">5K pace calculator</Link>. Adjust any workout for your experience, conditions, and recovery.</p>
                <Link className="back-link" href={`/running-sessions/${category.slug}`}>Browse more {category.title.toLowerCase()}</Link>
            </main>
        </>
    );
}
