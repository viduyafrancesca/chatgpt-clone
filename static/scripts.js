function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}

document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('send-btn');
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    sendButton.addEventListener('click', async function () {
        const message = userInput.value;
        if (message.trim()) {
             
            // Display the user message
            chatBox.innerHTML += `<div class="message user-message">${escapeHtml(message)}</div>`;

            // Clear input field
            userInput.value = '';
            
            // Send the message to the server
            let response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }),
            });
            let data = await response.json();
            
            if (data.reply) {
                chatBox.innerHTML += `<div class="message gpt">${escapeHtml(data.reply)}</div>`;
            } else {
                chatBox.innerHTML += '<div class="message gpt">Error! Please try again.</div>';
            }
            
            // Scroll chat box to the bottom
            chatBox.scrollTop = chatBox.scrollHeight;
            
        }
        // If user clicks enter instead of "Send" button
        userInput.addEventListener("keypress", (e) => {
            if (e.key === 'Enter') {
                sendButton.click();
            }
        });
    });
});
