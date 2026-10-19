import { sessionCategories, sessions, getSessionUrl } from './session-data';
import { siteUrl } from './site-url';

export default function sitemap() {
    const fixedPages = [
        { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
        { url: `${siteUrl}/running-sessions`, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${siteUrl}/5k-pace-calculator`, changeFrequency: 'monthly', priority: 0.8 }
    ];
    const categoryPages = sessionCategories.map(({ slug }) => ({
        url: `${siteUrl}/running-sessions/${slug}`,
        changeFrequency: 'weekly',
        priority: 0.7
    }));
    const sessionPages = sessions.map((session) => ({
        url: `${siteUrl}${getSessionUrl(session)}`,
        changeFrequency: 'monthly',
        priority: 0.6
    }));

    return [...fixedPages, ...categoryPages, ...sessionPages];
}
