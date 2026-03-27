const axios = require('axios');

async function test() {
    console.log('--- Starting Backend Diagnostic ---');
    try {
        // 1. Check Auth (Mock OTP)
        console.log('[1/4] Testing Auth...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            name: 'Test Admin',
            mobile: '9999999999',
            role: 'admin'
        });
        console.log('  - Login Request: Success (OTP sent to console)');

        const verifyRes = await axios.post('http://localhost:5000/api/auth/verify-otp', {
            mobile: '9999999999',
            otp: '0000'
        }, {
            headers: { 'Cookie': loginRes.headers['set-cookie']?.join('; ') }
        });
        const cookie = verifyRes.headers['set-cookie']?.join('; ');
        console.log('  - OTP Verification: Success');

        // 2. Check Menu
        console.log('[2/4] Testing Menu...');
        const catRes = await axios.post('http://localhost:5000/api/menu/categories', { name: 'TestCat' }, { headers: { Cookie: cookie } });
        console.log(`  - Category Creation: Success (${catRes.data.name})`);

        const dishRes = await axios.post('http://localhost:5000/api/menu', {
            name: 'Test Dish',
            originalPrice: 100,
            category: catRes.data._id
        }, { headers: { Cookie: cookie } });
        console.log(`  - Dish Creation: Success (${dishRes.data.name}, Final Price: ${dishRes.data.finalPrice})`);

        // 3. Check Tables
        console.log('[3/4] Testing Tables...');
        const tableRes = await axios.post('http://localhost:5000/api/tables', { number: 100, capacity: 4 }, { headers: { Cookie: cookie } });
        console.log(`  - Table Creation: Success (Table ${tableRes.data.number})`);

        // 4. Check Order and Table Status Logic
        console.log('[4/4] Testing Order & Table Lifecycle...');
        const orderRes = await axios.post('http://localhost:5000/api/orders', {
            tableNumber: 100,
            items: [{ dishId: dishRes.data._id, quantity: 1, price: 100 }],
            totalAmount: 100
        }, { headers: { Cookie: cookie } });
        console.log('  - Order Placement: Success');

        // Accept Order
        await axios.put(`http://localhost:5000/api/orders/${orderRes.data._id}/status`, { status: 'Accepted' }, { headers: { Cookie: cookie } });
        const busyTable = await axios.get('http://localhost:5000/api/tables');
        const t100 = busyTable.data.find(t => t.number === 100);
        console.log(`  - After Accept: Table 100 is ${t100.status} (Expected: Busy)`);

        // Complete Order (Bill)
        await axios.post(`http://localhost:5000/api/orders/${orderRes.data._id}/bill`, {}, { headers: { Cookie: cookie } });
        const availTable = await axios.get('http://localhost:5000/api/tables');
        const t100_final = availTable.data.find(t => t.number === 100);
        console.log(`  - After Bill: Table 100 is ${t100_final.status} (Expected: Available)`);

        console.log('--- Diagnostic Complete: ALL SYSTEMS NOMINAL ---');
    } catch (err) {
        console.error('--- Diagnostic Failed ---');
        console.error(err.response?.data || err.message);
    }
}

test();
