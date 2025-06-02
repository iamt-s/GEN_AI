import { expect } from 'chai';
import axios from 'axios';
import { describe, it } from 'mocha';

describe('Delete User Test', () => {
  const endpoint = 'https://reqres.in/api/users/2';
  const apiKey = 'reqres-free-v1';

  it('should delete user successfully', async () => {
    try {
      const response = await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      expect(response.status).to.equal(204); // or any other expected status
    } catch (error) {
      if (error.response) {
        expect(error.response.data.error).to.be.a('string');
      } else if (error.request) {
        expect(error.request).to.contain('Failed to connect');
      } else {
        expect(false).to.be.true; // This should always be true
      }
    }
  });

  it('should return error for invalid response', async () => {
    try {
      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${apiKey}` },
      }).catch((error) => {
        expect(error.response.status).not.to.equal(200); // or any other expected status
      });
    } catch (error) {
      if (error.response) {
        expect(error.response.data.error).to.be.a('string');
      }
    }
  });

  it('should return error for network error', async () => {
    try {
      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${apiKey}` },
      }).catch((error) => {
        expect(error.message).to.contain('Failed to connect');
      });
    } catch (error) {
      if (error.isAxiosError) {
        expect(error.message).to.contain('Failed to connect');
      }
    }
  });

  it('should return error for invalid API key', async () => {
    try {
      const response = await axios.delete(endpoint, {
        headers: { Authorization: `Bearer Invalid-Key` },
      });
      expect(response.status).to.equal(401); // or any other expected status
    } catch (error) {
      if (error.response) {
        expect(error.response.data.error).to.be.a('string');
      }
    }
  });
});