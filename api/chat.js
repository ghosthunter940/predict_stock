export default async function handler(req, res) {
  // 1. Hanya izinkan metode POST (kirim data)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  // 2. KUNCI RAHASIA (Saya ambil langsung dari gambar screenshot kamu)
  // Ini ditempel langsung biar tidak ada drama "Key Not Found" lagi.
  const apiKey = "AIzaSyACuNPRhQz4K5ZRqQqidze0XUHWHNRFlLM"; 

  try {
    // 3. Panggil Google Gemini (Versi Flash yang Cepat & Gratis)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            // Instruksi agar AI berlagak jadi asisten saham
            text: `Kamu adalah asisten AI ramah untuk website 'Stock Predictor' buatan GhostHunter. Jawab pertanyaan user ini dengan singkat dalam Bahasa Indonesia:\n\nUser: ${message}`
          }]
        }]
      })
    });

    const data = await response.json();

    // 4. Cek kalau Google menolak (Misal kuota habis)
    if (!response.ok) {
      console.error("Gemini Error:", data);
      throw new Error(data.error?.message || 'Error dari Google Gemini');
    }

    // 5. Ambil jawaban dari struktur data Google
    const reply = data.candidates[0].content.parts[0].text;

    // 6. Kirim jawaban ke layar Chatbot
    return res.status(200).json({
      choices: [{
        message: { content: reply }
      }]
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: 'Maaf, asisten sedang sibuk. Coba lagi nanti.' });
  }
}
