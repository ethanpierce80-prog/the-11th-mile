import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '../../../site-header';
import WorkoutSessionContent from './workout-session-content';
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
            <WorkoutSessionContent session={session} category={category} />
        </>
    );
}
