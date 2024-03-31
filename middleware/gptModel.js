const { OpenAI } = require('openai');
const dotenv=require('dotenv');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function extractRCBookData(rcbookFrontText, rcbookBackText) {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `${rcbookFrontText}\n${rcbookBackText}`, 
                },
                {
                    role: "system",
                    content: "Extract regno, chassis no, engine no, owner name, address, date of register(in yyyy-mm-dd format), valid_date (in yyyy-mm-dd format), fuel type, month&year of mfg, cubic capacity, no of cylinder, vehicle class, makers name, model name, color, body type, seating capacity. Please return in JSON format with key names as like this regno, chassis no, engine no, owner name, address, date of register(in yyyy-mm-dd format), valid_date (in yyyy-mm-dd format), fuel type, month&year of mfg, cubic capacity, no of cylinder, vehicle class, makers name, model name, color, body type, seating capacity. Dont put these values within another object like this a: { key: value, key2: value}, just give me only single object.",
                  }
            ],
            model: "gpt-3.5-turbo-0125",
            response_format: { type: "json_object" },
        });
        return completion.choices[0].message.content; // Return the extracted information
    } catch (error) {
        console.error("Error extracting RC book data:", error);
        return null;
    }
}
  
  async function extractLicenceData(licenceText) {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: licenceText, // Pass the text extracted from the license
        },
        {
          role: "system",
          content: "Extract issue_date(in yyyy-mm-dd format), valid_date(in yyyy-mm-dd format). Please return in JSON format.please give field name in JSON should be as i requested format",
        }
      ],
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
    });
    return completion.choices[0].message.content; 
  }
  
  async function extractInsuranceData(insuranceText) {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: insuranceText, 
        },
        {
          role: "system",
          content: "Extract start_date(in yyyy-mm-dd format), end_date(in yyyy-mm-dd format). Please return in JSON format.please give field name in JSON should be as i requested format",
        }
      ],
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
    });
    return completion.choices[0].message.content;
  }

  async function generateSolutionText(vehicleDetails, coValue) {

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `${vehicleDetails}\nCO Value: ${coValue}. Generate solutions for high CO emission in 4 good brief points for the provided vehicle model.`, 
                },
            ],
            model: "gpt-3.5-turbo", // Use a GPT model suitable for text generation
            response_format: { type: "text" },
        });
        return completion.choices[0].message.content; // Return the generated solution text
    } catch (error) {
        console.error("Error generating solution text:", error);
        return null;
    }
} 
  
  module.exports = { extractRCBookData, extractLicenceData, extractInsuranceData, generateSolutionText };
  