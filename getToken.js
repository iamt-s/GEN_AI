import axios from 'axios';
import "dotenv/config";

const tenantId = "9c307584-5070-4925-8d60-b80d437338f3";
const clientId = "ea2770eb6c2b4d65bab6a3ffa2aca003"
const username = "FieldCoachI.UAE@stg-iqos.com";  // User's email or username
const password = "2025Feb28PMI!" ;  // User's password
const scope = "https://graph.microsoft.com/.default";
const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

async function getUserToken() {
  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams({
        client_id: clientId,
        username: username,
        password: password,
        scope: scope,
        grant_type: "password",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    console.log("Access Token:", response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching token:", error.response?.data || error.message);
  }
}

getUserToken();
