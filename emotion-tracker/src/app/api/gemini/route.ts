import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { emotion, prev_context } = await req.json();

    // Проверяем токен пользователя
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Спрашиваем gemini-2.0-flash

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GOOGLE_AI_STUDIO_API_KEY || "",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `some`,
                },
              ],
            },
          ],
        }),
      },
    );

    const data = await res.json();
    if (data?.candidates?.lenght)
      return NextResponse.json({ slogan: data.candidates[0].content[0].text });
    else return NextResponse.json({ slogan: "" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
