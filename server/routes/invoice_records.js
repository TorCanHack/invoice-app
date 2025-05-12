const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');   


router.get('/invoice', async (req, res) => {
    const filePath = path.join(__dirname, '../data/data.json')
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    } catch (error) {
        console.error('Error reading file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

})

router.get('/invoice/:id', async (req, res) => {
    const filePath = path.join(__dirname, '../data/data.json')
    try {
        const rawData = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(rawData);

        const invoice = data.find(item => item.id === req.params.id);

        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        res.status(200).json(invoice);

    } catch (error) {
        console.error('Error reading file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/invoice', async (req, res) => {
    const filePath = path.join(__dirname, '../data/data.json')
    try {
        const rawData = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(rawData);

        const generateId = () => {
            const letters = String.fromCharCode(
                65 + Math.floor(Math.random() * 26),
                65 + Math.floor(Math.random() * 26),
            );

            const numbers = Math.floor(1000 + Math.random() * 9000).toString().slice(-4);

            return letters + numbers;
        }
        const newInvoice ={
            id: generateId(),
            createdAt: req.body.createdAt || new Date().toISOString(),
            ...req.body,
        }

        data.push(newInvoice);

        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        res.status(201).json(newInvoice);
    } catch (error) {
        console.error('Error writing file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/invoice/:id', async (req, res) => {
    const filePath = path.join(__dirname, '../data/data.json')
    try {
        const rawData = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(rawData);
        const invoiceIndex = data.findIndex(item => item.id === req.params.id);
        if (invoiceIndex === -1) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        const updatedInvoice = {
            ...data[invoiceIndex],
            ...req.body,
            id: data[invoiceIndex].id,
        };
        
        data[invoiceIndex] = updatedInvoice;
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        res.status(200).json(updatedInvoice);
    } catch (error) {
        console.error('Error writing file:', error);
        res.status(500).json({ error: 'Internal server error' });
    } 
}
);

router.delete('/invoice/:id', async (req, res) => {
    const filePath = path.join(__dirname, '../data/data.json')
    try {
        const rawData = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(rawData);
        const invoiceIndex = data.findIndex(item => item.id === req.params.id);
        if (invoiceIndex === -1) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        data.splice(invoiceIndex, 1);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        res.status(200).json(data);
    } catch (error) {
        console.error('Error writing file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
); 
//jik, detergent, harpic, sponge, dustbin leather 



module.exports = router;