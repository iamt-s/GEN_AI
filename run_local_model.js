import { pipeline } from '@xenova/transformers';

// Load the model and generate text
async function generateTestCase(prompt) {
    console.log("Loading model...");
    const generator = await pipeline('text-generation', 'Xenova/gpt2');

    console.log("Generating test case...");
    const output = await generator(prompt, { max_length: 250, temperature: 0.8, top_p: 0.95 });

    console.log(`Generated Test Case:\n${output[0].generated_text}`);
}

// Example usage
const prompt = "Test Case for Login Functionality";
generateTestCase(prompt);
