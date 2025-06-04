const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const sendMessageToGroq = async (message: string): Promise<string> => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization:
          "Bearer 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",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Groq API Error:", errorData);
      throw new Error(
        `Failed to get response from Groq: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw error;
  }
};
