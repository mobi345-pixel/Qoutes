import { GoogleGenAI, Type } from "@google/genai";
import type { Quote, SeoContent } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quoteSchema = {
  type: Type.OBJECT,
  properties: {
    quote: {
      type: Type.STRING,
      description: "A famous and inspiring quote.",
    },
    author: {
      type: Type.STRING,
      description: "The author of the quote.",
    },
  },
  required: ['quote', 'author'],
};

const seoSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A catchy, SEO-friendly YouTube video title.",
    },
    description: {
      type: Type.STRING,
      description: "An engaging YouTube video description of 150-200 words, including 3-5 relevant hashtags at the end.",
    },
    tags: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "A list of 10-15 relevant keywords/tags for the video.",
    },
  },
  required: ['title', 'description', 'tags'],
};

const quoteTopics = [
  'success', 'perseverance', 'happiness', 'creativity', 'leadership', 
  'courage', 'wisdom', 'innovation', 'friendship', 'motivation', 
  'inspiration', 'learning', 'change', 'the future', 'greatness'
];

export async function generateQuote(): Promise<Quote> {
  try {
    const randomTopic = quoteTopics[Math.floor(Math.random() * quoteTopics.length)];
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a single, famous, and inspiring quote about ${randomTopic}. Also provide the author's name.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: quoteSchema,
      },
    });

    const text = response.text.trim();
    return JSON.parse(text) as Quote;
  } catch (error) {
    console.error("Error generating quote:", error);
    throw new Error("Failed to generate a new quote. Please try again.");
  }
}

export async function generateBackgroundImage(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `A visually stunning, abstract, aesthetic background image that evokes a feeling related to: "${prompt}". Serene, high-resolution, suitable for a motivational slide, 16:9 aspect ratio.`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating background image:", error);
    throw new Error("Failed to generate a new background image. Please try again.");
  }
}

export async function generateSeoContent(quote: string, author: string): Promise<SeoContent> {
  try {
    const prompt = `Based on the quote "${quote}" by ${author}, generate SEO-friendly content for a faceless YouTube channel video. Provide a catchy title, an engaging description (around 150-200 words) including 3-5 relevant hashtags at the end, and a list of 10-15 relevant keywords/tags.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: seoSchema,
      },
    });

    const text = response.text.trim();
    return JSON.parse(text) as SeoContent;
  } catch (error) {
    console.error("Error generating SEO content:", error);
    throw new Error("Failed to generate SEO content. Please try again.");
  }
}