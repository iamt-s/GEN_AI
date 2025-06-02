import axios from 'axios';
import XLSX from 'xlsx';
import fs from 'fs';


async function generateTestCases(feature) {
    const prompt = `Generate test cases for the ${feature} functionality.
   Cover:
        - Positive & negative scenarios
        - Inputs, steps, and expected results
        Format:
        [
        { "TestCaseID": "TC001", "Description": "Valid login", "Steps": ["Enter user", "Enter pass", "Login"], "ExpectedResult": "Success" }
        ]
        Return only valid JSON.`;

    try {
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'llama3', // Use 'llama3' or another model if preferred
            prompt: prompt,
            stream: false
        });

        // Parse JSON response
        // const testCases = JSON.parse(response.data.response);    
        // console.log("Generated Test Cases:\n", testCases);

        const rawResponse = response.data.response;
        console.log("Raw Response:", rawResponse);

        // Extract JSON part
        const jsonStart = rawResponse.indexOf("[");
        const jsonEnd = rawResponse.lastIndexOf("]") + 1;
        const jsonText = rawResponse.slice(jsonStart,jsonEnd);

        const testCases = JSON.parse(jsonText);
        // console.log("Generated Test Cases:\n", testCases);


        // Convert test cases to Excel format
        saveTestCasesToExcel(testCases, 'test_cases.xlsx');

    } catch (error) {
        console.error('Error generating test cases:', error.message);
    }
}

function saveTestCasesToExcel(testCases, fileName) {
    // Convert JSON data into a worksheet
    const worksheet = XLSX.utils.json_to_sheet(testCases);
    
    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TestCases");

    // Write to an Excel file
    XLSX.writeFile(workbook, fileName);
    console.log(`Test cases saved to ${fileName}`);
}

// Generate test cases for "Login" feature
generateTestCases("Login");



