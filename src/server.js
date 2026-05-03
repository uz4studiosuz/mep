// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Tokenni shu yerda saqlaymiz (frontendga ko‘rinmaydi)
const API_KEY = "0b408bbe4663467dbee19e2fde747c17.UirIu_-n11CgL-y5JlYpJwp7";

app.post("/ask", async (req, res) => {
  const { symptoms } = req.body;

  try {
    const response = await fetch("https://api.ollama.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama2-chat",
        messages: [
          {
            role: "system",
            content:
              "Sen tibbiy maslahatchisan. Faqat tavsiya ber, aniq tashxis qo‘ymagin. Javob O‘zbek tilida bo‘lsin.",
          },
          {
            role: "user",
            content: `Bemor alomatlari: ${symptoms}

1) Ehtimoliy sabab
2) Uy sharoitida tavsiya
3) Qachon shifokorga borish kerak`,
          },
        ],
      }),
    });

    const data = await response.json();
    res.json({ answer: data.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ error: "Server xatosi" });
  }
});

app.listen(5000, () => console.log("Server 5000 portda ishlayapti"));
