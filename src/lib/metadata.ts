
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function getOgImage(url: string): Promise<string | null> {
    try {
        // Validate URL first
        new URL(url);

        // Add User-Agent to avoid being blocked by some sites
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 5000 // 5 second timeout
        });

        const $ = cheerio.load(data);

        // Try standard OG tag
        let ogImage = $('meta[property="og:image"]').attr('content');

        // Fallback to twitter image
        if (!ogImage) {
            ogImage = $('meta[name="twitter:image"]').attr('content');
        }

        return ogImage || null;
    } catch (error) {
        console.warn(`Failed to fetch OG image for ${url}:`, error);
        return null;
    }
}
