async function test() {
    try {
        console.log('Testing login...');
        const loginRes = await fetch('http://127.0.0.1:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'TestUser', mobile: '1234567890', role: 'user' })
        });
        
        console.log('Testing OTP...');
        const verifyRes = await fetch('http://127.0.0.1:5000/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile: '1234567890', otp: '0000' })
        });
        const cookie = verifyRes.headers.get('set-cookie');
        console.log('Cookie received:', !!cookie);

        console.log('Fetching tables...');
        const tablesRes = await fetch('http://127.0.0.1:5000/api/tables', {
            headers: { 'Cookie': cookie }
        });
        const tables = await tablesRes.json();
        const firstTable = tables[0];
        console.log('Table 0:', firstTable);
        
        console.log('Fetching menu...');
        const menuRes = await fetch('http://127.0.0.1:5000/api/menu', {
            headers: { 'Cookie': cookie }
        });
        const menus = await menuRes.json();
        const firstMenu = menus[0];
        console.log('Menu 0:', firstMenu.name);

        console.log('Placing order...');
        const orderRes = await fetch('http://127.0.0.1:5000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie
            },
            body: JSON.stringify({
                tableNumber: firstTable.number,
                items: [{ dishId: firstMenu._id, quantity: 1, price: firstMenu.finalPrice }],
                totalAmount: firstMenu.finalPrice
            })
        });
        
        const orderData = await orderRes.json();
        console.log('Order Response code:', orderRes.status);
        console.log('Order Response:', orderData);
        
    } catch (e) {
        console.error(e);
    }
}
test();
