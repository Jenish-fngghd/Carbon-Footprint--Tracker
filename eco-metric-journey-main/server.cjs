const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/gemini/recommendations', async (req, res) => {
  try {
    const { co2Level, temperature, humidity } = req.body;

    // Validate inputs
    if (
      typeof co2Level !== 'number' || isNaN(co2Level) || co2Level < 0 ||
      typeof temperature !== 'number' || isNaN(temperature) ||
      typeof humidity !== 'number' || isNaN(humidity) || humidity < 0 || humidity > 100
    ) {
      throw new Error('Invalid environmental data: CO2, temperature, and humidity must be valid numbers, with humidity between 0 and 100');
    }

    console.log('Received Environmental Data:', { co2Level, temperature, humidity });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    Given the following environmental data:
    - CO2 Level: ${co2Level} ppm
    - Temperature: ${temperature}°C
    - Humidity: ${humidity}%
    Provide 2-3 concise, actionable recommendations to improve environmental conditions in an office setting. Format each recommendation exactly as follows, with a dash (-) at the start of each recommendation, and each field on a new line with the labels "Title:", "Description:", and "Type:". The "Type" must be one of: "warning", "success", or "eco-tip". Do not include any extra text, numbering, or different formatting. Example:
    - Title: Reduce CO2 Levels
      Description: Open windows to improve ventilation.
      Type: warning

    Ensure each recommendation strictly follows this format.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log('Raw Gemini API Response:', text);

    const recommendations = [];
    const recBlocks = text.split('\n- ').filter(Boolean);

    for (let rec of recBlocks) {
      rec = rec.trim();
      const lines = rec.split('\n').filter(line => line.trim());

      const titleLine = lines.find(line => line.toLowerCase().startsWith('title:'));
      const descriptionLine = lines.find(line => line.toLowerCase().startsWith('description:'));
      const typeLine = lines.find(line => line.toLowerCase().startsWith('type:'));

      if (!titleLine || !descriptionLine || !typeLine) {
        console.log('Skipping recommendation due to missing fields:', lines);
        continue;
      }

      const title = titleLine.split(/title:/i)[1]?.trim() || 'Untitled';
      const description = descriptionLine.split(/description:/i)[1]?.trim() || 'No description';
      const type = typeLine.split(/type:/i)[1]?.trim().toLowerCase() || 'info';

      if (!['warning', 'success', 'eco-tip'].includes(type)) {
        console.log('Skipping recommendation due to invalid type:', type);
        continue;
      }

      recommendations.push({ title, description, type });
    }

    if (recommendations.length === 0) {
      throw new Error('No valid recommendations generated');
    }

    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching Gemini API recommendations:', error.message);
    res.status(500).json({ error: 'Failed to fetch recommendations', details: error.message });
  }
});

app.listen(8001, () => {
  console.log('Backend server running on port 8001');
});