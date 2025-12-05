export default async function handler(req, res) {
  // Hanya izinkan method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  // --- KUNCI LANGSUNG DITEMPEL DI SINI (HANYA UNTUK TES) ---
  const apiKey = "AIzaSyACuNPRhQz4K5ZRqQqidze0XUHWHNRFlLM"; 
  // ---------------------------------------------------------

  try {
    // URL API Google Gemini (Model Flash yang Cepat & Gratis)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Kamu adalah asisten AI untuk website Prediksi Saham GhostHunter. Jawablah pertanyaan user berikut dengan singkat, ramah, dan membantu dalam Bahasa Indonesia:\n\nUser: ${message}`
          }]
        }]
      })
    });

    const data = await response.json();

    // Cek jika Google mengirim error
    if (!response.ok) {
      console.error("Gemini API Error Details:", data);
      throw new Error(data.error?.message || 'Error dari Google Gemini');
    }

    // Ambil teks jawaban dari struktur data Gemini
    const reply = data.candidates[0].content.parts[0].text;

    // Kirim balik ke frontend
    return res.status(200).json({
      choices: [{
        message: { content: reply }
      }]
    });

  } catch (error) {
    console.error("Server Error Log:", error);
    return res.status(500).json({ error: error.message || 'Gagal memproses pesan.' });
  }
}
