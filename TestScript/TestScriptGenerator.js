import axios from 'axios';
import fs from 'fs';
import { execSync } from 'child_process';
import promptSync from 'prompt-sync';
const prompt = promptSync({ sigint: false });
const LLM_ENDPOINT = 'http://localhost:11434/api/generate';
const MODEL = 'llama3';
let framework='';
async function generateTestScripts() {
   const endpoint = prompt('Enter the API endpoint (e.g., https://reqres.in/api/users): ');
   const functionality = prompt('Enter the API functionality (e.g., Create, Update, Delete): ');    
   framework = prompt('Choose your test framework (Jest / Mocha): ');
   const fileName = prompt('Provide a filename to save the test script (without extension): ') + '.js';
   const apiKey=process.env.APIKEY 
// //- Use the test framework: ${framework}
    const testPrompt = `
Generate a simple JavaScript test script for the following:
- Endpoint: ${endpoint}
- Functionality: ${functionality}
- Use the test framework: ${framework}
- Use axios for API calls
- The test script should:
  - Be written in ES module syntax (use "import" instead of "require")
 - Use following imports and create script accordingly that should run successfully in one shot:
                            import { expect } from 'chai';
                            import axios from 'axios';
                            import { describe, it } from 'mocha'
  - Use api key as "${apiKey}" in the headers
  - Cover both positive and negative test cases
  - Include error handling for network errors and invalid responses
  - Be free of syntax, runtime, and configuration errors
  - Return only the JavaScript code in a code block
  - Ensure the script is ready to execute without requiring additional modifications
`;

    try {
        const code = await getLLMGeneratedCode(testPrompt);
        if (!code) throw new Error('No code returned from LLM.');

        fs.writeFileSync(fileName, code, 'utf8');
        console.log(`✅ Test script saved to ${fileName}`);

        await validateAndHeal(fileName, testPrompt);

    } catch (error) {
        console.error('❌ Error during script generation:', error.message);
    }
}

async function getLLMGeneratedCode(promptText) {
    const response = await axios.post(LLM_ENDPOINT, {
        model: MODEL,
        prompt: promptText,
        stream: false
    });

    const raw = response.data.response;
    console.log('\n📩 Raw response received.\n');

    const extracted = extractCode(raw);
    if (!extracted) {
        console.log('⚠️ No valid code block found.');
    }
    return extracted;
}

function extractCode(text) {
    const codeBlockRegex = /```(?:javascript)?\s*([\s\S]*?)```/i;
    const match = text.match(codeBlockRegex);
    return match ? match[1].trim() : null;
}

async function validateAndHeal(fileName, originalPrompt) {
    console.log(`\n🧪 Validating generated script....`);

    try {
        //execSync(`node ${fileName} --reporter mochawesome`, { stdio: 'inherit' });
        execSync(`npx ${framework} ${fileName} --reporter mochawesome`, { stdio: 'inherit' });
        console.log('✅ Script ran successfully.');
        
    } catch (error) {
        console.error('❌ Runtime error detected:\n', error.message);
        // Attempt to heal the code
        console.log('✅🛠️ Attempting to heal the code...');
        
        const fixPrompt = `
The JavaScript test script generated earlier has the following error during execution:

Error:
${error.message}

Original Prompt:
${originalPrompt}

Broken Code:
\`\`\`javascript
${fs.readFileSync(fileName, 'utf8')}
\`\`\`

Please fix this code and return only the corrected version in a JavaScript code block.
`;

        const healedCode = await getLLMGeneratedCode(fixPrompt);
        if (healedCode) {
            fs.writeFileSync(fileName, healedCode, 'utf8');
            console.log('🛠️ Healed version saved. Retesting...');
            await validateAndHeal(fileName, originalPrompt);
        } else {
            console.error('⚠️ Auto-healing failed. Manual fix may be required.');
        }
    }
}

generateTestScripts();
