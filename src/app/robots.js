import { siteUrl } from './site-url';

export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/'
        },
        sitemap: `${siteUrl}/sitemap.xml`
    };
}
