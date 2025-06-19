const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Serve static frontend files from public folder
app.use(express.static('public'));

// Root route to serve index.html explicitly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Optional: Test route to check server status
app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

// Order endpoint
app.post('/api/order', async (req, res) => {
  try {
    const { name, phone, address, area, payment, deliveryFee, product, productPrice } = req.body;
    const total = Number(productPrice) + Number(deliveryFee);

    if (!name || !phone || !address) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,  // use EMAIL_USER in .env
        pass: process.env.EMAIL_PASS,  // use EMAIL_PASS in .env
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,  // Or your receiving email
      subject: `New Order from ${name}`,
      text: `
New order received:

Name: ${name}
Phone: ${phone}
Address: ${address}
Area: ${area}
Payment Method: ${payment}
Product: ${product}
Product Price: ৳${productPrice}
Delivery Fee: ৳${deliveryFee}
Total to Pay: ৳${total}
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
