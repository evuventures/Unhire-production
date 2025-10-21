import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const getExpertRecommendations = async (project, experts) => {
  try {
    const prompt = `
You are an AI engine that matches freelancers (experts) to projects.
Each expert has skills and rating. 
Rate each expert's suitability for the given project on a scale of 0–100.

Project Info:
Title: ${project.title}
Category: ${project.category}
Description: ${project.description}
Requirements: ${project.requirements || "N/A"}

Experts:
${experts
      .map(
        (e, i) =>
          `${i + 1}. Name: ${e.name}, Skills: ${e.skills?.length ? e.skills.join(", ") : "None"}, Rating: ${e.rating ?? 0}`
      )
      .join("\n")}

Return a JSON array of the top 10 expert IDs (no explanation). 
Format: [{"expertId": "123", "score": 95}, ...]
`;

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5:generateText?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // ✅ Use `input` instead of `prompt`
        input: prompt,
        temperature: 0.7,
        max_output_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content || "[]";

    let parsed = [];
    try {
      parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch (err) {
      console.error("Gemini JSON parse error:", err.message);
    }

    return parsed;
  } catch (err) {
    console.error("Gemini matching error:", err.message);
    return [];
  }
};
