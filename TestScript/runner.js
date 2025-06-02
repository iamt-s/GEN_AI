import fs from 'fs';
import axios from 'axios';
import { exec } from 'child_process';

// Initial JavaScript test code
//let testCode = `const { generateTestScripts } = require('./TestScriptGenerator'); // Import the function from test_script.js`;


    let testCode=`const { generateTestScripts } = await import('./TestScriptGenerator.js');`
    // Now you can use generateTestScripts



// Function to write test code to test_execution.js
function writeTestFile(code) {
    fs.writeFileSync('test_execution.js', code);
}

// Function to execute the test file
function executeCode(fileName) {
    return new Promise((resolve) => {
        exec(`node ${fileName}`, (error, stdout, stderr) => {
            if (error || stderr) {
                resolve(stderr || error.message);
            } else {
                resolve(null);
            }
        });
    });
}

// Function to correct code using Mistral
async function correctCode(code, error) {
    const prompt = `The following JavaScript test code has an error:\n\n${code}\n\nError Message:\n${error}\n\nFix the issue and return only the corrected code.`;

    try {
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'mistral',
            prompt: prompt,
            stream: false
        });

        return response.data.response;
    } catch (err) {
        console.error("Error getting correction from LLM:", err.message);
        return code;
    }
}

// Main execution and correction loop
async function selfCorrectingExecution() {
    writeTestFile(testCode); // Save initial test script
    let error = await executeCode('test_execution.js'); // Run the test file
    let iterations = 0;
    const maxRetries = 1;

    while (error && iterations < maxRetries) {
        console.log(`Error detected:\n${error}\n\nGenerating a fix...`);
        
        testCode = await correctCode(testCode, error);
        writeTestFile(testCode); // Save corrected version
        console.log(`Updated Code:\n${testCode}\n`);

        error = await executeCode('test_execution.js');
        iterations++;
    }

    if (!error) {
        console.log("✅ Code executed successfully!");
    } else {
        console.log("❌ Failed after multiple attempts. Manual intervention needed.");
    }
}

selfCorrectingExecution();
