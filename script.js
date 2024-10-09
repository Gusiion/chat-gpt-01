// Seleciona os elementos do chat no DOM
const chatContainer = document.querySelector(".chat-container");
const form = document.querySelector(".chat-form");
const input = document.querySelector(".chat-input");
const sendButton = document.querySelector("[data-testid='send-button']"); // Seleciona o botão de envio

// Função para adicionar a mensagem ao chat
function addMessage(role, content) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", role);
  messageElement.textContent = content;
  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight; // Rola para baixo automaticamente
}

// Função para enviar a mensagem para a API e receber a resposta
async function sendMessage(message) {
  const API_KEY = "96b95238218f4be09da99489b4e65caa"; // Substitua pela sua chave API
  const ENDPOINT =
    "https://gusionchat.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview";

  const payload = {
    messages: [
      { role: "system", content: "Você é um assistente de IA." },
      { role: "user", content: message }
    ],
    temperature: 0.7,
    top_p: 0.95,
    max_tokens: 800
  };

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;
    addMessage("ai", aiMessage); // Adiciona a resposta da IA ao chat
  } catch (error) {
    console.error("Erro ao se comunicar com a API:", error);
    addMessage("ai", "Erro ao se conectar com o servidor.");
  }
}

// Função para habilitar/desabilitar o botão com base no conteúdo do input
input.addEventListener('input', () => {
  if (input.value.trim() === "") {
    sendButton.setAttribute('disabled', ''); // Desabilita o botão
  } else {
    sendButton.removeAttribute('disabled'); // Habilita o botão
  }
});

// Captura o evento de envio do formulário
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Previne o comportamento padrão de envio do formulário

  const userMessage = input.value.trim(); // Captura a mensagem do usuário
  if (userMessage === "") return; // Não faz nada se a mensagem for vazia

  addMessage("user", userMessage); // Adiciona a mensagem do usuário no chat
  sendMessage(userMessage); // Envia a mensagem para a API

  input.value = ""; // Limpa o campo de input
  sendButton.setAttribute('disabled', ''); // Desabilita o botão até que haja nova entrada
});
