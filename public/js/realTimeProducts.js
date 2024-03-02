const WebSocket = require('ws');
const fs = require('fs').promises;
const path = require('path');

const wss = new WebSocket.Server({ port: 8080 });

let products = [];


async function readProducts() {
    const filePath = path.join(__dirname, '..', 'data', 'products.json');
    try {
        const data = await fs.readFile(filePath, 'utf8');
        products = JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo products.json:', error);
    }
}


async function writeProducts() {
    const filePath = path.join(__dirname, '..', 'data', 'products.json');
    try {
        await fs.writeFile(filePath, JSON.stringify(products, null, 2), 'utf8');
    } catch (error) {
        console.error('Error al escribir en el archivo products.json:', error);
    }
}


function sendProductList() {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(products));
        }
    });
}

wss.on('connection', ws => {
    ws.send(JSON.stringify(products));

    ws.on('message', async message => {
        const data = JSON.parse(message);
        if (data.action === 'add') {
            products.push(data.product);
            await writeProducts(); 
        } else if (data.action === 'delete') {
            products = products.filter(product => product.id !== data.productId);
            await writeProducts(); 
        }

        sendProductList();
    });
});


readProducts();
