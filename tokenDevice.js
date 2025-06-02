import { PublicClientApplication } from "@azure/msal-node";

const config = {
  auth: {
    clientId: "ea2770eb6c2b4d65bab6a3ffa2aca003", // client_id 
    authority: "https://login.microsoftonline.com/9c307584-5070-4925-8d60-b80d437338f3", // azure tenant 
  },
};

const pca = new PublicClientApplication(config);

async function getToken() {
  const deviceCodeRequest = {
    scopes: ["https://graph.microsoft.com/.default"],
    deviceCodeCallback: (response) => {
      console.log(`Please visit ${response.verificationUri} and enter the code ${response.userCode}`);
    },
  };

  try {
    const response = await pca.acquireTokenByDeviceCode(deviceCodeRequest);
    console.log("Access Token:", response.accessToken);
  } catch (error) {
    console.error("Error:", error);
    // Log the error details for more insights
    if (error instanceof Error) {
      console.error("Detailed error:", error.message);
    }
    if (error?.response) {
      console.error("Response details:", error.response);
    }
  }
}

getToken();
// Here we need  client id and secrets which is under the azure ad tenant and that 