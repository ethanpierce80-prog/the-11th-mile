import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '../../site-header';
import WorkoutSearchList from '../../workout-search-list';
import { sessionCategories, sessions } from '../../session-data';

export function generateStaticParams() {
    return sessionCategories.map(({ slug }) => ({ category: slug }));
}

export async function generateMetadata({ params }) {
    const { category: categorySlug } = await params;
    const category = sessionCategories.find(({ slug }) => slug === categorySlug);
    if (!category) return {};

    return {
        title: `${category.title} | The 11th Mile`,
        description: category.description
    };
}

export default async function SessionCategoryPage({ params }) {
    const { category: categorySlug } = await params;
    const category = sessionCategories.find(({ slug }) => slug === categorySlug);
    if (!category) notFound();

    const categorySessions = sessions.filter(({ category: name }) => name === category.category);

    return (
        <>
            <SiteHeader />
            <main className="editorial-page">
                <nav className="breadcrumbs" aria-label="Breadcrumb">
                    <Link href="/">Home</Link><span>/</span>
                    <Link href="/running-sessions">Running Sessions</Link><span>/</span>
                    <span>{category.title}</span>
                </nav>
                <h1>{category.title}</h1>
                <p className="editorial-lead">{category.introduction}</p>
                <h2>Browse {categorySessions.length} sessions</h2>
                <WorkoutSearchList sessions={categorySessions} />
                <section className="editorial-section">
                    <h2>Choose a pace that suits you</h2>
                    <p>Session paces are personalized using your recent 5K time. Estimate yours with the <Link href="/5k-pace-calculator">5K pace calculator</Link>, and build your training gradually.</p>
                </section>
                <nav className="related-categories" aria-label="Other running session categories">
                    {sessionCategories.filter(({ slug }) => slug !== category.slug).map((related) => (
                        <Link href={`/running-sessions/${related.slug}`} key={related.slug}>{related.title}</Link>
                    ))}
                </nav>
            </main>
        </>
    );
}
