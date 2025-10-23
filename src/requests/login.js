import { config } from '../config/config.js';

export async function login() {
  const tokenEndpoint = `${config.baseUrl}${config.loginEndpoint}`;

  const body = JSON.stringify({
    email: process.env.DRIVVO_EMAIL,
    senha: process.env.DRIVVO_PASSWORD,
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
    const result = await response.json();
    console.log(result.token);
    return result.token;
  } catch (error) {
    console.error(error);
  }
}
