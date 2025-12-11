import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { Coordinates, Salon, AnalysisResult, ChatMessage, ChatResponse } from "../types";
import { TRENDING_HAIRSTYLES } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// ... (previous helper code remains implicitly, but providing full file content for correctness) ...

export const analyzeUserFace = async (userImageBase64: string): Promise<AnalysisResult> => {
  try {
    const model = 'gemini-2.5-flash';
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
      config: {}
    });

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
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Find top-rated hair salons near my location that would be good for getting a "${styleName}".
      Sort them by highest star rating.
      List the top 3 salons.
      
      For each salon, provide:
      1. Name
      2. Rating (Stars)
      3. Address (Approximate)
      4. A brief 1-sentence reason why it's good for this specific style.

      Return the result as a Markdown Table with columns: Salon Name, Rating, Address, Why it's good.
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

const modifyHairstyleFunction: FunctionDeclaration = {
  name: 'modify_hairstyle',
  description: 'Modifies the user\'s current hairstyle based on their request (e.g. change color, length, texture, bangs).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      modification_description: {
        type: Type.STRING,
        description: 'A detailed description of how the hair should look after modification (e.g. "blonde bob cut", "add pink highlights", "make it shorter").'
      }
    },
    required: ['modification_description']
  }
};

export const getChatResponse = async (
    history: ChatMessage[], 
    newMessage: string,
    context: { styleName: string, faceShape?: string, currentImageBase64?: string }
): Promise<ChatResponse> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Setup Chat with Function Calling
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are a friendly and expert personal hair stylist. 
                The user has just virtually tried on a "${context.styleName}" hairstyle. 
                Their face shape is "${context.faceShape || 'unknown'}".
                
                If the user asks to visually CHANGE, MODIFY, or EDIT the hairstyle (e.g., "make it shorter", "dye it red", "add bangs"), YOU MUST CALL the 'modify_hairstyle' tool.
                
                If the user asks questions about maintenance, products, or advice, just answer with text.
                Keep answers concise (under 3 sentences) unless asked for details.`,
                tools: [{ functionDeclarations: [modifyHairstyleFunction] }]
            },
            history: history.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }))
        });

        const result = await chat.sendMessage({ message: newMessage });
        
        // Check for function calls
        const call = result.functionCalls?.[0];
        if (call && call.name === 'modify_hairstyle') {
            const args = call.args as any;
            const modification = args.modification_description;

            if (context.currentImageBase64) {
                 // Generate new image
                 const newImageUrl = await generateHairstyleImage(modification, context.currentImageBase64);
                 
                 // Inform the chat model that we did it, to get a nice text response back
                 const functionResponse = await chat.sendMessage({
                    message: [{
                        functionResponse: {
                            name: 'modify_hairstyle',
                            response: { result: 'success', description: `Image modified to: ${modification}` },
                            id: call.id
                        }
                    }]
                 });

                 return {
                     text: functionResponse.text || `Sure! I've updated the look to be ${modification}. How do you like it?`,
                     newImageUrl: newImageUrl
                 };
            } else {
                return { text: "I'd love to modify the look, but I seem to have lost track of the current image. Could you try generating the initial style again?" };
            }
        }

        return { text: result.text || "I'm thinking..." };

    } catch (e) {
        console.error("Chat error", e);
        return { text: "I'm having a little trouble connecting to the styling database right now. Try again in a moment!" };
    }
}
