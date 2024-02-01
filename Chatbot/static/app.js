document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const submitButton = document.getElementById('submitButton');
    const responseElement = document.getElementById('response');

    submitButton.addEventListener('click', () => {
        const userMessage = userInput.value;
        if (userMessage.trim() !== '') {
            displayUserMessage(userMessage);
            generateChatResponse(userMessage);
            userInput.value = '';
        }
    });

    function generateChatResponse(userMessage) {
        fetch('/process_command', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command: userMessage }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from backend:', data);
            displayChatbotResponse(data.response);
        })
        .catch(error => {
            console.error('Error sending command to backend:', error);
        });
    }

    function displayUserMessage(userMessage) {
        const newUserMessage = document.createElement('p');
        newUserMessage.textContent = `You: ${userMessage}`;
        responseElement.appendChild(newUserMessage);
    }

    function displayChatbotResponse(chatbotResponse) {
        clearChatbotResponses();  // Clear previous chatbot responses
        const newChatbotResponse = document.createElement('p');
        newChatbotResponse.textContent = `Chatbot: ${chatbotResponse}`;
        responseElement.appendChild(newChatbotResponse);
    }

    function clearChatbotResponses() {
        // Remove all child elements (previous chatbot responses)
        while (responseElement.firstChild) {
            responseElement.removeChild(responseElement.firstChild);
        }
    }
});
