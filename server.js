const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

app.post('/api/order', async (req, res) => {
  const { name, phone, address, area, payment, deliveryFee, total, product, productPrice } = req.body;

  if (!name || !phone || !address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Order from ${name}`,
    text: `
You have received a new order:

Name: ${name}
Phone: ${phone}
Address: ${address}
Area: ${area}
Payment method: ${payment}
Product: ${product}
Product Price: ৳${productPrice}
Delivery Fee: ৳${deliveryFee}
Total to Pay: ৳${total}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Order received and email sent' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});