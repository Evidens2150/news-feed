export type Image = {
  src: string,
  alt: string,
};

export type SubtitleItem = {
  label: string,
  value: string,
};

export interface IImageModalProps {
  images: Image[],
}

export interface INewsItem {
  title?: string | null,
  link?: string,
  description?: string | null,
  date?: string | null,
}