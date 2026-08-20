export interface BlogPost {
  slug: string;
  title: string;
  title_en?: string;
  date: string;
  category: string;
  excerpt: string;
  excerpt_en?: string;
  tags?: string[];
  content?: string;
  cover?: string;
  lang?: string;
  translation_slug?: string;
  translation_of?: string;
}
