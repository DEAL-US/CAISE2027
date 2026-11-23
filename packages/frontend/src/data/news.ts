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
    date: '2026-11-23',
    text: 'The call for PhD Award applications is now available',
    href: getPermalink('/calls/phd-award')
  },
  {
    date: '2026-11-23',
    text: 'The call for forum and tools is now available',
    href: getPermalink('/calls/forum')
  },
  {
    date: '2026-11-20',
    text: 'The call for tutorials is now available',
    href: getPermalink('/calls/tutorials')
  },
  {
    date: '2026-11-18',
    text: 'The call for journal-first papers is now available',
    href: getPermalink('/calls/journal-first')
  },
  {
    date: '2026-11-16',
    text: 'Workshop notification date extended to November 20, 2026',
    href: getPermalink('/calls/workshops')
  },
  {
    date: '2026-10-21',
    text: 'Important! New LNCS template.',
    href: 'https://www.overleaf.com/latex/templates/springer-nature-lecture-notes-in-computer-science/kzwwpvhwnvfj'
  },
  {
    date: '2026-10-08',
    text: 'The call for workshops is now available',
    href: getPermalink('/calls/workshops')
  },
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
