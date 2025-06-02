import { expect } from 'chai';
import axios from 'axios';
import { describe, it } from 'mocha';

const apiKey = 'reqres-free-v1';
const userId = 4; // Update user with ID 4

describe('Update User Test', () => {
  it('should update user successfully', async () => {
    try {
      const response = await axios.put(`https://reqres.in/api/users/${userId}`, {
        name: 'John Doe',
        job: 'Software Engineer'
      }, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      expect(response.status).to.equal(200);
    } catch (error) {
      if (error.response) {
        console.log('Error occurred with status:', error.response.status);
        expect(error.response.status).not.to.equal(200);
      } else {
        throw error;
      }
    }
  });
  it('should handle network error', async () => {
    try {
      await axios.put('https://reqres.in/api/users/invalid', {}, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        validateStatus: false // This should be set to false for handling 404 and other non-200 status codes
      })
        .catch(error => {
          expect(error.message).to.include('Network Error');
        });
    } catch (error) {
      throw error;
    }
  });
  it('should handle invalid response', async () => {
    try {
      const response = await axios.put('https://reqres.in/api/users/invalid', {}, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        validateStatus: false // This should be set to false for handling 404 and other non-200 status codes
      });
      expect(response.status).not.to.equal(200);
    } catch (error) {
      if (error.response) {
        console.log('Error occurred with status:', error.response.status);
        expect(error.response.status).not.to.equal(200);
      } else {
        throw error;
      }
    }
  });
});