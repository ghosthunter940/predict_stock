// Memuat tampilan chatbot secara otomatis
document.addEventListener("DOMContentLoaded", function() {
    fetch('chatbot/chatbot.html')
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
        })
        .catch(err => console.error('Gagal memuat chatbot:', err));
});

// Fungsi Buka/Tutup Chat
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
        setTimeout(() => document.getElementById('chatInput').focus(), 100);
    }
}

// Handle Enter Key
function handleChatInput(event) {
    if (event.key === 'Enter') sendMessage();
}

// Kirim Pesan
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const msgContainer = document.getElementById('chatMessages');
    const message = input.value.trim();

    if (!message) return;

    // Tampilkan pesan User
    msgContainer.innerHTML += `<div class="message user-message">${message}</div>`;
    input.value = '';
    msgContainer.scrollTop = msgContainer.scrollHeight;

    // Tampilkan Loading
    const loadingId = 'loading-' + Date.now();
    msgContainer.innerHTML += `<div class="message bot-message" id="${loadingId}"><i class="fas fa-circle-notch fa-spin"></i> Mengetik...</div>`;
    msgContainer.scrollTop = msgContainer.scrollHeight;

    try {
        // Panggil API Backend Vercel
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ message })
        });
        
        const data = await res.json();
        
        // Hapus loading
        document.getElementById(loadingId).remove();

        if (data.choices && data.choices.length > 0) {
            msgContainer.innerHTML += `<div class="message bot-message">${data.choices[0].message.content}</div>`;
        } else {
            msgContainer.innerHTML += `<div class="message bot-message">Maaf, terjadi kesalahan.</div>`;
        }
    } catch (err) {
        if(document.getElementById(loadingId)) document.getElementById(loadingId).remove();
        msgContainer.innerHTML += `<div class="message bot-message">Gagal terhubung ke server.</div>`;
        console.error(err);
    }
    
    msgContainer.scrollTop = msgContainer.scrollHeight;
}