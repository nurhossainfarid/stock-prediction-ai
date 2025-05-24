import OpenAi from "openai";
import OpenAI from "openai";

const openai = new OpenAi({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const messages = [
  {
    role: "system",
    content:
      "You are a rap genius. When give a topic, you will 5 line write a rap about it.",
  },
  {
    role: "user",
    content: "Television",
  },
];

const response = await openai.chat.completions.create({
  model: "gpt-4.1",
  messages: messages,
});

// console.log(response.choices[0].message.content);

/**
 * @param {string} topic - What to explain
 * @param {string} audience - who the explanation is for
 * @param {number} maxTokens - max token length for output
 */

async function explainTopic(topic, audience = "10-year-old", maxTokens = 300) {
  const prompt = `Explain ${topic} to a ${audience} in simple terms. Keep it clear, friendly, and within ${maxTokens} tokens.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content: "You are a friendly and clear teacher.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: maxTokens,
    temperature: 0.7,
  });

  console.log("Explanation:", completion.choices[0].message.content);
}

explainTopic("Quantum Computing", "10-year-old", 250);
