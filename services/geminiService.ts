import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY;
if (!apiKey) {
    // En una aplicación real, querrías manejar esto de una manera más elegante,
    // quizás mostrando un mensaje de error en la interfaz de usuario.
    // Para este ejemplo, lanzaremos un error para que quede claro.
    throw new Error("La variable de entorno API_KEY no está configurada. Por favor, proporciona una clave de API de Gemini válida.");
}
const ai = new GoogleGenAI({ apiKey });

// Define el esquema de respuesta para el modelo de IA
const schema = {
    type: Type.OBJECT,
    properties: {
        review: {
            type: Type.STRING,
            description: "La revisión de código detallada en formato Markdown. Analiza bugs, rendimiento, legibilidad, seguridad y mejores prácticas."
        },
        improvedCode: {
            type: Type.STRING,
            description: "El código completo, refactorizado y mejorado, aplicando las sugerencias de la revisión."
        }
    },
    required: ["review", "improvedCode"]
};


export const reviewCode = async (code: string, language: string): Promise<{ review: string; improvedCode: string }> => {
    const prompt = `
Eres un ingeniero de software experto y un revisor de código de clase mundial.
Tu tarea es proporcionar una revisión de código detallada y constructiva, y también reescribir el código con mejoras.

Para el siguiente fragmento de código en ${language}, por favor, proporciona:
1.  **Una revisión de código detallada**: Analiza el código en busca de bugs, rendimiento, legibilidad, seguridad y mejores prácticas. Formatea esta revisión usando Markdown.
2.  **El código mejorado**: Proporciona la versión completa y mejorada del código, aplicando tus sugerencias.

Aquí está el código a revisar:
\`\`\`${language.toLowerCase()}
${code}
\`\`\`
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (typeof result.review === 'string' && typeof result.improvedCode === 'string') {
            return result;
        } else {
            throw new Error("La respuesta de la IA no tiene el formato esperado.");
        }

    } catch (error) {
        console.error("Error al revisar el código con la API de Gemini:", error);
        if (error instanceof Error) {
            throw new Error(`Ocurrió un error al comunicarse con el servicio de IA: ${error.message}. Por favor, verifica tu clave de API y tu conexión de red.`);
        }
        throw new Error("Ocurrió un error desconocido durante la revisión del código.");
    }
};