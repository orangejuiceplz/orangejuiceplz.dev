const API_BASE_URL = 'temp';

document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');

    function addMessage(author, content, timestamp) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        messageElement.innerHTML = `
            <span class="message-author">${author}</span>
            <span class="message-content">${content}</span>
            <span class="message-timestamp">${new Date(timestamp).toLocaleTimeString()}</span>
        `;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (message) {
            console.log('Attempting to send message:', message);
            try {
                const response = await fetch(`${API_BASE_URL}/api/send-message`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message }),
                });
                const data = await response.json();
                if (response.ok) {
                    console.log('Message sent successfully:', data);
                    addMessage('You', message, new Date());
                    chatInput.value = '';
                } else {
                    console.error('Failed to send message:', data.error);
                    alert(`Failed to send message: ${data.error}`);
                }
            } catch (error) {
                console.error('Error sending message:', error);
                alert(`Error sending message: ${error.message}`);
            }
        }
    });

    async function fetchMessages() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/get-messages`);
            if (response.ok) {
                const messages = await response.json();
                chatMessages.innerHTML = ''; 
                messages.reverse().forEach(msg => addMessage(msg.author, msg.content, msg.timestamp));
            } else {
                const errorData = await response.json();
                console.error('Failed to fetch messages:', errorData.error);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    fetchMessages();

    setInterval(fetchMessages, 1000);
});