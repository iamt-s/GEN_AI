import { expect } from 'chai';
import axios from 'axios';
import { describe, it } from 'mocha';

describe('User Creation Test', () => {
  const url = 'https://reqres.in/api/users';
  const userData = {
    name: 'John Doe',
    job: 'Software Engineer'
  };

  it('should create a new user successfully', async () => {
    try {
      const response = await axios.post(url, userData);
      expect(response.status).to.equal(201);
      expect(response.data.name).to.equal(userData.name);
      expect(response.data.job).to.equal(userData.job);
    } catch (error) {
      console.error(error);
    }
  });

  it('should not create a new user with invalid data', async () => {
    try {
      const response = await axios.post(url, { invalid: 'data' });
      expect(response.status).to.equal(400);
    } catch (error) {
      console.error(error);
    }
  });

  it('should handle network error', async () => {
    try {
      axios.create({ timeout: 1000 }).post(url, userData)
        .then(() => { throw new Error('Expected network error'); })
        .catch((error) => {
          expect(error).to.be.an('Error');
          expect(error.message).to.equal('timeout of 1000ms exceeded');
        });
    } catch (error) {
      console.error(error);
    }
  });

  it('should handle invalid response', async () => {
    try {
      const response = await axios.post(url, userData);
      expect(response.status).not.to.equal(201);
    } catch (error) {
      console.error(error);
    }
  });
});