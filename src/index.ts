import express, { Application } from 'express';
import { json, urlencoded } from 'body-parser';
import { createAuthRoutes } from './infrastructure/routes/AuthRoutes';
import { InMemoryUserRepository } from './infrastructure/repositories/UserRepository';

// 1. Buat instance Express
const app: Application = express();

// 2. Middleware parsing
app.use(json());
app.use(urlencoded({ extended: true }));

// 3. Inisialisasi dependency
const userRepository = new InMemoryUserRepository(); 

// 4. Routing - harus sebelum middleware 404
app.use('/api/auth', createAuthRoutes(userRepository));

// 5. Middleware 404 (setelah routing)
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// 6. Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
