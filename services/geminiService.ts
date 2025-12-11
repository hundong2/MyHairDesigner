import { GoogleGenAI } from "@google/genai";
import { Coordinates, Salon, AnalysisResult } from "../types";
import { TRENDING_HAIRSTYLES } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert grounding chunks to simplified Salon objects
const extractSalons = (groundingChunks: any[]): Salon[] => {
  if (!groundingChunks) return [];
  
  // Filter for chunks that have map data
  const salons: Salon[] = [];
  
  groundingChunks.forEach(chunk => {
    if (chunk.web?.uri && chunk.web?.title) {
        // Fallback for web results if map specific isn't structured well
         salons.push({
            title: chunk.web.title,
            websiteUri: chunk.web.uri,
            rating: 0 // Web chunks might not have rating easily accessible
         });
    }
  });

  return salons;
};

export const analyzeUserFace = async (userImageBase64: string): Promise<AnalysisResult> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Get all available IDs to help Gemini choose valid recommendations
    const availableIds = TRENDING_HAIRSTYLES.map(h => h.id).join(', ');

    const prompt = `
      Act as a world-class hair stylist consultant.
      Analyze the face in this image.
      
      1. Determine the Face Shape (e.g., Oval, Round, Square, Heart, Long).
      2. Recommend 2 hairstyles from this specific list of IDs that would best suit this face shape: [${availableIds}].
      3. Explain briefly why these styles suit the user's features.

      Return the response in this JSON format ONLY:
      {
        "faceShape": "Shape Name",
        "recommendedStyleIds": ["id1", "id2"],
        "reasoning": "Your reasoning here..."
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { data: userImageBase64, mimeType: 'image/jpeg' } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || "{}";
    const json = JSON.parse(text);

    return {
      faceShape: json.faceShape || "Unknown",
      recommendedStyleIds: json.recommendedStyleIds || [],
      reasoning: json.reasoning || "Based on your features, we recommend these styles."
    };

  } catch (error) {
    console.error("Face analysis failed:", error);
    throw new Error("Could not analyze face.");
  }
}

export const generateHairstyleImage = async (
  styleName: string,
  userImageBase64?: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-image';
    const parts: any[] = [];

    if (userImageBase64) {
      // Editing Mode
      parts.push({
        inlineData: {
          data: userImageBase64,
          mimeType: 'image/jpeg',
        },
      });
      parts.push({
        text: `Change this person's hair to a ${styleName} hairstyle. Keep the face exactly the same. High quality, photorealistic.`,
      });
    } else {
      // Generation Mode (Fake Persona)
      parts.push({
        text: `A photorealistic portrait of a person with a trendy ${styleName} hairstyle. Professional studio lighting, high resolution.`,
      });
    }

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        // Nano banana models do not support responseMimeType/responseSchema
      }
    });

    // Check for inline data (image)
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image generated.");
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
};

export const generateStyleAnalysis = async (
  styleName: string,
  hasUserImage: boolean
): Promise<{ advice: string; pros?: string[]; cons?: string[] }> => {
  try {
    const model = 'gemini-2.5-flash';
    
    let prompt = "";
    if (hasUserImage) {
      prompt = `
        You are a professional hair stylist. 
        A user has just tried on the "${styleName}" hairstyle. 
        Write a short, encouraging, and professional recommendation (max 3 sentences) about how to style this look and why it might suit them.
        Return the result as plain text.
      `;
    } else {
      prompt = `
        You are a professional hair stylist.
        Analyze the "${styleName}" hairstyle.
        Provide exactly 2 Pros and 2 Cons for this hairstyle.
        
        Return the response in this JSON format:
        {
          "pros": ["Pro 1", "Pro 2"],
          "cons": ["Con 1", "Con 2"]
        }
      `;
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: hasUserImage ? {} : { responseMimeType: 'application/json' }
    });

    const text = response.text || "";

    if (hasUserImage) {
      return { advice: text };
    } else {
      try {
        const json = JSON.parse(text);
        return {
            advice: `Here is a professional breakdown of the ${styleName}.`,
            pros: json.pros || [],
            cons: json.cons || []
        };
      } catch (e) {
        // Fallback if JSON parsing fails
        return { 
            advice: text,
            pros: ["Stylish look", "Modern appeal"],
            cons: ["Requires maintenance", "Regular trimming needed"]
        };
      }
    }

  } catch (error) {
    console.error("Text analysis failed:", error);
    throw error;
  }
};

export const searchNearbySalons = async (
  styleName: string,
  coords: Coordinates
): Promise<string> => {
    // Note: returning string (markdown) because Google Maps grounding works best returning the model's text 
    // which contains the grounding metadata links implicitly in the text response or we can parse chunks.
    // For this app, we will display the model's textual recommendation which usually includes links.
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Find top-rated hair salons near my location that would be good for getting a "${styleName}".
      Sort them by highest star rating.
      List the top 3 salons with their rating and a brief reason why.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: coords.latitude,
              longitude: coords.longitude
            }
          }
        }
      }
    });

    return response.text || "Could not find salons nearby.";
  } catch (error) {
    console.error("Salon search failed:", error);
    return "Unable to search for salons at this moment. Please check your location settings.";
  }
};