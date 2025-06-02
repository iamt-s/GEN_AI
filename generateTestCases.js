import axios from 'axios';  // Importing axios using ES module syntax

// Define your Hugging Face API key
const API_KEY = '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';  // Replace with your actual API key

// Define the GPT-Neo model URL for inference (large text generation model)
const MODEL_URL = 'https://api-inference.huggingface.co/models/codellama/CodeLlama-7b-hf';

//gemma-2-27b-it
//gemma-7b
//gemma-7-9b
// Function to generate test cases from google gemma model
async function generateTestCase(prompt, retries = 3, delay = 5000) {
  const data = {
    inputs: prompt,
    parameters: {
      max_length: 300,
      temperature: 0.2,
      top_p: 0.95
      
    }
  };

  try {
    // Send the request to Hugging Face API with the prompt and parameters
    const response = await axios.post(MODEL_URL, data, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    // Log the response data to inspect the result
    //console.log('API Response:', response.data);

    // Get the generated text from the API response (assuming the model returns 'generated_text')
    if (response.data && response.data[0]) {
      const generatedText = response.data[0].generated_text || 'No generated text found';
      const formattedText = `Generated Test Case:\n${generatedText}`;
      console.log(formattedText);
    } else {
      console.error('No generated text in the response');
    }
  } catch (error) {
    // Log the error for better debugging
    console.error('Error generating test case:', error.response ? error.response.data : error.message);
  }
}

// Example prompt for generating test cases
const prompt = `All Positive and Negative Test Scenarios and steps for Login Functionality`;

// Call the function to generate test cases
generateTestCase(prompt);