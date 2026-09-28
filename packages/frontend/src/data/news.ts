import { getPermalink } from '#/utils/permalinks';

export interface NewsItem {
  /** ISO date (YYYY-MM-DD) the news was announced. */
  date: string;
  text: string;
  /** Optional link to the related page. */
  href?: string;
}

/**
 * Announcements shown on the home page. Add new entries anywhere: they are
 * sorted newest first, and the most recent one is also shown in the top banner.
 */
const news: NewsItem[] = [
  {
    date: '2026-09-10',
    text: 'The call for papers is now available',
    href: getPermalink('/calls/papers')
  }
];

export const sortedNews = [...news].sort((a, b) => b.date.localeCompare(a.date));

export const latestNews: NewsItem | undefined = sortedNews[0];

/** Formats an ISO date as DD-MM-YYYY. */
export const formatNewsDate = (date: string) => date.split('-').reverse().join('-');
