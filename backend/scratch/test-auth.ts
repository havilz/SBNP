async function test() {
  const loginUrl = 'http://localhost:3000/api/auth/login';
  const protectedUrl = 'http://localhost:3000/api/export/excel';
  
  console.log('1. Attempting login...');
  try {
    const res = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: 'admin', 
        password: 'admin_password_123' 
      }),
    });
    
    const data: any = await res.json();
    
    if (res.status === 200 && data.data && data.data.access_token) {
      console.log('SUCCESS: Login works, token received.');
      const token = data.data.access_token;

      console.log('2. Testing protected route (Export) WITH token...');
      const res2 = await fetch(protectedUrl, {
        headers: { Authorization: 'Bearer ' + token },
      });
      
      if (res2.status === 200) {
        console.log('SUCCESS: Authenticated Export access works.');
      } else {
        console.log('FAIL: Auth Export access returned status ' + res2.status);
      }

      console.log('3. Testing protected route (Export) WITHOUT token...');
      const res3 = await fetch(protectedUrl);
      if (res3.status === 401) {
        console.log('SUCCESS: Unauthenticated Export access blocked (401).');
      } else {
        console.log('FAIL: Unauthenticated access WAS NOT blocked. Status: ' + res3.status);
      }
    } else {
      console.log('FAIL: Login failed or no token. Status: ' + res.status);
      console.log(JSON.stringify(data));
    }
  } catch (error) {
    console.error('Network Error:', error);
  }
}

test();
