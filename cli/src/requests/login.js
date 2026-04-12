import { md5 } from '../utilities/util.js';
import { config } from '../config/config.js';

export async function login() {
  const tokenEndpoint = `${config.baseUrl}${config.loginEndpoint}`;

  const body = JSON.stringify({
    email: process.env.DRIVVO_EMAIL,
    senha: md5(process.env.DRIVVO_PASSWORD),
    idioma: 'en',
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body,
    redirect: 'follow',
  };

  try {
    const response = await fetch(tokenEndpoint, requestOptions);
    if (!response.ok) {
      console.error(
        `Drivvo login failed with status ${response.status}: ${response.statusText}`
      );
      process.abort();
    }

    const result = await response.json();
    if (!result?.token) {
      console.error('Drivvo login response did not include an auth token.');
      return null;
    }

    return result.token;
  } catch (error) {
    console.error('Unable to log in to the Drivvo API:', error);
    return null;
  }
}
