export interface Quote {
  quote: string;
  author: string;
}

export interface SeoContent {
  title: string;
  description: string;
  tags: string[];
}

export interface Customization {
  textColor: string;
  fontSize: number;
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right';
  textShadow: boolean;
}

export interface SlideData extends Quote {
  backgroundImage: string;
  imagePrompt: string;
}
