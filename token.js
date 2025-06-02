import axios from 'axios';
import qs from 'qs';

const tenantId = "9c307584-5070-4925-8d60-b80d437338f3";
const clientId = "8b86a65e-3c3a-4406-8ac3-19a6b5cc52bc"
const clientSecret = "dcdd8428-2166-48eb-bcc7-d3577a326f67";
const scope = "https://graph.microsoft.com/.default"; // Scopes for Microsoft Graph or other Azure resources

const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/token`;

const tokenRequestData = qs.stringify({
  client_id: clientId,
  scope: scope,
  client_secret: clientSecret,
  grant_type: "client_credentials", // For service-to-service (client credentials flow)
});

axios
  .post(tokenEndpoint, tokenRequestData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
  .then((response) => {
    console.log("Access token:", response.data.access_token);
  })
  .catch((error) => {
    console.error("Error acquiring token:", error);
  });
