export default async function handler(req, res) {
  // 1. Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  // 2. KUNCI RAHASIA (Biarkan yang ini, karena sudah benar/valid)
  const apiKey = "AIzaSyACuNPRhQz4K5ZRqQqidze0XUHWHNRFlLM"; 

  try {
    // 3. Panggil Google Gemini (GANTI KE MODEL 'gemini-pro' AGAR STABIL)
    // Perhatikan URL di bawah ini beda dengan yang tadi
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Kamu adalah asisten AI untuk website Stock Predictor. Jawab pertanyaan ini dengan singkat dalam Bahasa Indonesia:\n\nUser: ${message}`
          }]
        }]
      })
    });

    const data = await response.json();

    // 4. Cek error dari Google
    if (!response.ok) {
      console.error("Gemini Error:", data);
      throw new Error(data.error?.message || 'Error dari Google Gemini');
    }

    // 5. Ambil jawaban
    const reply = data.candidates[0].content.parts[0].text;

    // 6. Kirim jawaban
    return res.status(200).json({
      choices: [{
        message: { content: reply }
      }]
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: 'Maaf, asisten sedang sibuk.' });
  }
}
