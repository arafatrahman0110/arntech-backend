const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/order', async (req, res) => {
  try {
    const { name, phone, address, area, payment, deliveryFee, productPrice } = req.body;
    const total = Number(productPrice) + Number(deliveryFee);

    // Email setup using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: 'newpc2445@gmail.com', // Your Gmail to receive order notifications
      subject: 'New Order Received',
      text: `
New order received:

Name: ${name}
Phone: ${phone}
Address: ${address}
Area: ${area}
Payment Method: ${payment}
Product Price: ৳${productPrice}
Delivery Fee: ৳${deliveryFee}
Total: ৳${total}
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error placing order' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
