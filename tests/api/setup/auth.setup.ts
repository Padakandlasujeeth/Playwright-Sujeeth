// auth.setup.ts
export async function login(request,username: string, password: string): Promise< | null> {
  try {
    const authResponse = await authenticateUser(request,username, password);
    console.log(authResponse)

    if (authResponse.token) {
        //apiContext.setAuthToken(authResponse.token); // Set the token for future requests
      return authResponse.token;
    } else {
      throw new Error("Authentication failed. Token not received.");
    }
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
}

async function authenticateUser(request,username: string, password: string) {
  const apiUrl = 'https://demoqa.com/Account/v1/Login'; // Replace with your actual authentication API endpoint

  const resp1 = await request.post(apiUrl,{
        data: JSON.stringify({userName: username, password: password}),
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',}
    });
    return await resp1.json()
}
