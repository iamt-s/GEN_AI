import { pipeline, env } from '@xenova/transformers';

// Set your Hugging Face API token
env.allowRemoteModels = true;
env.authToken = "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";  // Replace with your token

async function runLLM() {
    console.log("Loading model...");
    const generator = await pipeline('text-generation', 'Xenova/llama3');

    console.log("Generating response...");
    const output = await generator("Tell me a fun fact about space.", { max_new_tokens: 50 });

    console.log("Response:", output[0].generated_text);
}

runLLM();
