export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // Kita ganti nama kuncinya

  try {
    // URL API Google Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Kamu adalah asisten AI untuk website Prediksi Saham GhostHunter. Jawablah pertanyaan berikut dengan singkat, ramah, dan dalam Bahasa Indonesia:\n\nUser: ${message}`
          }]
        }]
      })
    });

    const data = await response.json();

    // Cek jika ada error dari Google
    if (data.error) {
      throw new Error(data.error.message);
    }

    // Ambil jawaban dari format Gemini
    const reply = data.candidates[0].content.parts[0].text;
    
    // Kembalikan ke format yang dimengerti frontend kita
    return res.status(200).json({ 
      choices: [{ 
        message: { content: reply } 
      }] 
    });

  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({ error: 'Gagal memproses pesan.' });
  }
}
