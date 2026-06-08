

import Groq from "groq-sdk";

const getGroq = () => {
  if (!process.env.GROQ_API_KEY) return null;
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};


export const generateIntro = async (req, res) => {
  const { customer, match } = req.body;
console.log(process.env.GROQ_API_KEY);
  if (!customer || !match) {
    return res.status(400).json({
      success: false,
      message: "Both customer and match profile are required.",
    });
  }

  const groq = getGroq();

  if (!groq) {
    const fallback = `Dear ${customer.firstName}, we are pleased to introduce ${match.firstName} ${match.lastName} from ${match.city}. As a ${match.designation} at ${match.currentCompany}, ${match.firstName} shares your ${customer.religion} values and holds a ${match.degree} qualification. We believe your aligned outlook on family and lifestyle makes this a very promising connection. We look forward to hearing your thoughts!`;
    return res.status(200).json({
      success: true,
      intro: fallback,
      note: "Add GROQ_API_KEY to .env to enable AI intros.",
    });
  }

  try {
    // Build prompt for the matchmaking intro
    const prompt = `You are an expert Indian matchmaker writing a warm, professional introduction email.

Customer Profile (our client):
- Name: ${customer.firstName} ${customer.lastName}, ${customer.age} years old
- City: ${customer.city}, ${customer.country}
- Profession: ${customer.designation} at ${customer.currentCompany}
- Education: ${customer.degree}
- Religion: ${customer.religion}, Diet: ${customer.diet}
- Wants kids: ${customer.wantKids}
- Open to relocate: ${customer.openToRelocate}

Suggested Match Profile:
- Name: ${match.firstName} ${match.lastName}, ${match.age} years old
- City: ${match.city}, ${match.country}
- Profession: ${match.designation} at ${match.currentCompany}
- Education: ${match.degree}
- Religion: ${match.religion}, Diet: ${match.diet}
- Wants kids: ${match.wantKids}
- Open to relocate: ${match.openToRelocate}

Write a warm, genuine 3-4 sentence introduction email from the matchmaker to the customer.
Highlight 2-3 specific compatibility points between them.
Keep it professional but heartfelt. Do not use generic phrases.
Only return the email body text. 
Do NOT include any subject line, greeting like "Dear", sign-off, or signature like "Best regards" or "[Your Name]".
Just return the 3-4 sentences of the email body only.`;

    // Call Groq API with LLaMA 3 model
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",  // Free, fast LLaMA 3 model
      messages: [
        {
          role: "system",
          content: "You are TDC's expert matchmaker. Write warm, specific, professional introduction emails.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.7, 
    });


    const intro = completion.choices[0].message.content.trim();

    res.status(200).json({ success: true, intro });

  } catch (error) {
    console.error("Groq Error:", error.message);

    // Fallback if Groq API fails
    const fallback = `Dear ${customer.firstName}, we are delighted to introduce ${match.firstName} ${match.lastName}, a ${match.designation} based in ${match.city}. With a background in ${match.degree} and shared ${customer.religion} values, we believe ${match.firstName} could be a wonderful match for you. Their outlook on family and lifestyle aligns closely with yours, and we look forward to hearing your thoughts!`;

    res.status(200).json({
      success: true,
      intro: fallback,
      note: "AI service unavailable, using template.",
    });
  }
};


// POST /api/ai/explain
export const explainMatch = async (req, res) => {
  const { customer, match, score } = req.body;

  if (!customer || !match) {
    return res.status(400).json({
      success: false,
      message: "Customer and match profiles are required.",
    });
  }

  const groq = getGroq();

  // Fallback if no API key
  if (!groq) {
    return res.status(200).json({
      success: true,
      explanation: `${customer.firstName} and ${match.firstName} show compatibility based on shared values, lifestyle preferences, and professional backgrounds. Their alignment on key life decisions makes them worth exploring.`,
    });
  }

  try {
    const prompt = `As an expert Indian matchmaker, explain in 2-3 sentences why ${customer.firstName} (${customer.age} years old, ${customer.city}, ${customer.designation}) and ${match.firstName} (${match.age} years old, ${match.city}, ${match.designation}) have a compatibility score of ${score}/100. Be specific about their shared values, lifestyle, or professional alignment. Keep it concise.`;

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 120,
      temperature: 0.6,
    });

    const explanation = completion.choices[0].message.content.trim();

    res.status(200).json({ success: true, explanation });

  } catch (error) {
    console.error("Groq Error:", error.message);

    res.status(200).json({
      success: true,
      explanation: `${customer.firstName} and ${match.firstName} show strong compatibility based on shared values and professional backgrounds. Their aligned lifestyle preferences make this a connection worth exploring.`,
    });
  }
};