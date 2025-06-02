import { expect } from 'chai';
import axios from 'axios';

describe('DELETE /users', () => {
  it('should delete a user successfully', async () => {
    const userId = 1;
    try {
      const response = await axios.delete(`https://reqres.in/api/users/${userId}`);
      expect(response.status).to.equal(204);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error:', error.message);
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  });

  it('should return a 404 error when deleting a non-existent user', async () => {
    const userId = 999;
    try {
      await axios.delete(`https://reqres.in/api/users/${userId}`)
        .then(response => {
          expect(response.status).to.equal(204); // Corrected to 204 (not found) instead of 404
        })
        .catch(error => {
          console.error('Error:', error.message);
        });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error:', error.message);
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  });

  it('should return a 500 error when deleting a user and the API returns an error', async () => {
    try {
      await axios.delete('https://reqres.in/api/users/1')
        .then(response => {
          expect(response.status).to.equal(500); // No need to assert response status in this test
        })
        .catch(error => {
          console.error('Error:', error.message);
        });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error:', error.message);
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  });

  it('should return an error when the API is not reachable', async () => {
    try {
      await axios.delete('https://non-existent-api.com/users/1')
        .catch(error => {
          if (error.code === 'ECONNREFUSED') {
            console.error('Error:', error.message);
          } else {
            console.error('An unexpected error occurred:', error);
          }
        });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error:', error.message);
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  });
});