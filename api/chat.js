export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(200).json({
        success: true,
        message: "CNC GPT Proxy läuft 🚀 Nutze POST mit image_url"
      });
    }

    const { image_url } = req.body;

    if (!image_url) {
      return res.status(400).json({
        success: false,
        error: "image_url fehlt"
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Du bist CNC Experte. Analysiere technische Zeichnungen. Erkenne Maße, Bohrungen, Konturen, Werkstückdaten. Antworte nur als JSON."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analysiere diese technische Zeichnung für CNC Fertigung."
              },
              {
                type: "image_url",
                image_url: {
                  url: image_url
                }
              }
            ]
          }
        ],
        temperature: 0.2
      })
    });

    const data = await response.json();

    return res.status(200).json({
      success: true,
      result: data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
