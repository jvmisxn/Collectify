import { GoogleGenAI, Type } from "@google/genai";
import { CollectionType, ItemDetails } from '../types';
import { COLLECTION_CONFIG } from '../constants';

// Fix: Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const getFieldType = (field: string): Type => {
    switch (field) {
        case 'pages':
        case 'year':
        case 'runtime':
        case 'trackCount':
            return Type.INTEGER;
        default:
            return Type.STRING;
    }
};

export const fetchItemDetails = async (title: string, collectionType: CollectionType): Promise<Partial<ItemDetails> & { imageUrl?: string }> => {
    const config = COLLECTION_CONFIG[collectionType];
    const fields = config.fields;

    const properties: { [key: string]: { type: Type, description: string } } = {
        imageUrl: {
            type: Type.STRING,
            description: `A direct, publicly accessible, high-quality image URL for the item's cover art. For books, prioritize the first edition cover if possible.`
        }
    };

    fields.forEach(field => {
        properties[field] = {
            type: getFieldType(field),
            description: `The ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} of the ${config.singular}.`
        };
    });

    const prompt = `Find details for the ${config.singular} titled "${title}". It is crucial to find a high-quality, publicly accessible image URL for its cover or primary artwork to be used in the 'imageUrl' field. If you cannot find information for a field, omit it from the response.`;

    try {
        // Fix: Use the recommended 'gemini-2.5-flash' model and correct API usage for generating content.
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: properties,
                },
            },
        });

        // Fix: Extract text directly from the response object.
        const jsonString = response.text;
        const parsedData = JSON.parse(jsonString);
        return parsedData as Partial<ItemDetails> & { imageUrl?: string };
    } catch (error) {
        console.error("Error fetching item details from Gemini API:", error);
        throw new Error("Failed to auto-fill details. Please try again or enter them manually.");
    }
};