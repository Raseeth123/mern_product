import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'));

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String,
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

app.get('/api/products', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  const { name, price, category, image } = req.body;
  if (!name || !price || !category) return res.status(400).json({ error: 'All fields required' });
  const product = new Product({ name, price, category, image });
  await product.save();
  res.status(201).json(product);
});

app.put('/api/products/:id', async (req, res) => {
  const { name, price, category, image } = req.body;
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { name, price, category, image },
    { new: true }
  );
  res.json(product);
});

app.delete('/api/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
