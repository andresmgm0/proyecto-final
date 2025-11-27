const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = "ClaveSecretaParaEntrega8";

app.use(express.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
	next();
});

app.use('/cats', authMiddleware, express.static(path.join(__dirname, 'data', 'cats')));
app.use('/sell', authMiddleware, express.static(path.join(__dirname, 'data', 'sell')));
app.use('/cats_products', authMiddleware, express.static(path.join(__dirname, 'data', 'cats_products')));
app.use('/products', authMiddleware, express.static(path.join(__dirname, 'data', 'products')));
app.use('/products_comments', authMiddleware, express.static(path.join(__dirname, 'data', 'products_comments')));
app.use('/user_cart', authMiddleware, express.static(path.join(__dirname, 'data', 'user_cart')));
app.use('/cart', authMiddleware, express.static(path.join(__dirname, 'data', 'cart')));

app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

// Usuarios para demo
const users = [
	{ id: 1, email: 'user@example.com', password: '1234', name: 'Demo User' },
	{ id: 2, email: 'Testing', password: 'admin', name: 'Test' }
];

//Middleware de autenticación: valida el token JWT o del parámetro de consulta
function authMiddleware(req, res, next) {
	const authHeader = req.headers['authorization'] || '';
	let token = null;
	
	// Obtener token del Header
	if (authHeader.startsWith('Bearer ')) {
		token = authHeader.slice(7);
	}
	
	
	if (!token && req.query && req.query.token) {
		token = req.query.token;
	}
	
	if (!token) {
		return res.status(401).json({ error: "Token no proporcionado" });
	}

	// Verificar token
	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(401).json({ error: "Toquen expirado o invalido" });
		}
		req.user = decoded;
		next();
	});
}

// POST /login
app.post('/login', (req, res) => {
	const body = req.body || {};
	const email = body.email || body.user || body.username;
	const password = body.password || body.pass;

	if (!email || !password) {
		return res.status(400).json({ error: 'Email and password required' });
	}

	const found = users.find(u => (u.email === email || u.email === String(email)) && u.password === String(password));
	if (!found) return res.status(401).json({ error: 'Invalid credentials' });

	const payload = { id: found.id, email: found.email, name: found.name };
	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

	res.json({ token });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
	res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
	console.log(`Backend server running on http://localhost:${PORT}`);
});
