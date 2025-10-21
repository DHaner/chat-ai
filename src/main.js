import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import DOMPurify from "dompurify";
import { marked } from "marked";

const openRouter = createOpenRouter({ apiKey: import.meta.env.VITE_API_KEY })

const form = document.querySelector('form');
const chatMessages = document.querySelector("#chat-messages")
const submitButton = document.querySelector("#submit")
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const prompt = document.querySelector("#input").value.trim();

  if (prompt === "") {
    alert("no puede ir vacio");
    return;
  }
  submitButton.disabled = true
  try {

    const result = streamText({
      // model : openRouter("deepseek/deepseek-r1-0528:free"),
      // model : openRouter("google/gemini-2.0-flash-exp:free"),
      model: openRouter("deepseek/deepseek-chat-v3-0324:free"),
      prompt,
      system: "Eres desarrollador frontend senior con varios años de experiencia",
      temperature: 1
    })

    // Remover contenido anterior
    while (chatMessages.firstChild)
      chatMessages.removeChild(chatMessages.firstChild)

    let respuestaMarkdown = ""
    for await (const text of result.textStream) {
      respuestaMarkdown += text

      const htmlFormateado = marked(respuestaMarkdown);
      chatMessages.innerHTML = DOMPurify.sanitize(htmlFormateado);
    }
  }
  catch (error) {
    console.error("Error al procesar la solicitud:", error);
    alert("Ocurrió un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.");
  }
  finally {
    submitButton.disabled = false
  }

})