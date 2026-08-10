const JUDGEME_SHOP_DOMAIN = 'kq1n1f-p4.myshopify.com';
const JUDGEME_PUBLIC_API_TOKEN = 'uRMTifvLszgQyECcrN8FoterN-E';
const JUDGEME_API_URL = 'https://api.judge.me/api/v1/widgets/product_review';

export interface JudgemeReview {
  id: string;
  rating: number;
  author: string;
  date: string;
  title: string;
  body: string;
  verified: boolean;
  pictures: string[];
}

export interface JudgemeProductReviews {
  averageRating: number;
  reviewCount: number;
  reviews: JudgemeReview[];
}

export async function fetchProductReviews(externalId: string | number): Promise<JudgemeProductReviews | null> {
  try {
    const response = await fetch(
      `${JUDGEME_API_URL}?shop_domain=${JUDGEME_SHOP_DOMAIN}&external_id=${externalId}&per_page=20&api_token=${JUDGEME_PUBLIC_API_TOKEN}`
    );

    if (!response.ok) return null;

    const data: { widget: string } = await response.json();
    return parseReviewWidgetHtml(data.widget);
  } catch (error) {
    console.error('Failed to load reviews:', error);
    return null;
  }
}

function parseReviewWidgetHtml(html: string): JudgemeProductReviews {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const widget = doc.querySelector('.jdgm-rev-widg');

  const averageRating = parseFloat(widget?.getAttribute('data-average-rating') || '0');
  const reviewCount = parseInt(widget?.getAttribute('data-number-of-reviews') || '0', 10);

  const reviews: JudgemeReview[] = Array.from(doc.querySelectorAll('.jdgm-rev')).map((el, index) => {
    const pictures = Array.from(el.querySelectorAll('.jdgm-rev__pics img')).map(
      (img) => img.getAttribute('src') || ''
    ).filter(Boolean);

    return {
      id: el.getAttribute('data-review-id') || String(index),
      rating: parseInt(el.querySelector('.jdgm-rev__rating')?.getAttribute('data-score') || '0', 10),
      author: el.querySelector('.jdgm-rev__author')?.textContent?.trim() || 'Anonymous',
      date: el.querySelector('.jdgm-rev__timestamp')?.getAttribute('datetime') || '',
      title: el.querySelector('.jdgm-rev__title')?.textContent?.trim() || '',
      body: el.querySelector('.jdgm-rev__body')?.textContent?.trim() || '',
      verified: el.getAttribute('data-verified-buyer') === 'true',
      pictures,
    };
  });

  return { averageRating, reviewCount, reviews };
}
