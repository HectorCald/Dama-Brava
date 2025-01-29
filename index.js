import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    // Comprobamos si el dominio no tiene el prefijo www
    if (req.headers.host === 'damabrava.com') {
        // Redirigimos a www.damabrava.com manteniendo el resto de la URL
        return res.redirect(301, `https://www.damabrava.com${req.url}`);
    }
    // Continuamos con el siguiente middleware si no es necesario redirigir
    next();
});


// Configuración de vistas y middleware básico
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesión
app.use(session({
    secret: 'mi-secreto',
    resave: true, // Cambiado a true
    saveUninitialized: false,
    cookie: { 
        secure: false, // Cambia a true si usas HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://hector:hectorCald17@cluster0.nqszi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
}).then(() => {
    console.log('Conectado a MongoDB');
}).catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
});

// Esquemas
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const productSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    gramaje: String,
    imagenUrl: String,
});

const recipeSchema = new mongoose.Schema({
    nombreReceta: String,
    descripcion: String,
    linkReceta: String,
    imagenUrl: String,
});

// Modelos
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Recipe = mongoose.model('Recipe', recipeSchema);

// Configuración de Multer para manejo de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/uploads')); // Ruta absoluta
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Middleware de autenticación
const verificarAutenticacion = (req, res, next) => {
    console.log('Estado de autenticación:', req.session.usuarioAutenticado);
    if (req.session && req.session.usuarioAutenticado === true) {
        next();
    } else {
        res.status(401).json({ message: 'No autorizado' });
    }
};

app.get('/verificar-auth', (req, res) => {
    res.json({ 
        authenticated: req.session.usuarioAutenticado === true,
        sessionID: req.sessionID
    });
});

// Middleware de redirección HTTPS
app.use((req, res, next) => {
    if (req.headers.host === 'damabrava-web-a396e1ccb037.herokuapp.com') {
        res.redirect(301, 'https://www.damabrava.com' + req.url);
    } else {
        next();
    }
});

// Rutas de vistas
app.get('/', (req, res) => {
    res.redirect('/inicio');
});

app.get('/inicio', (req, res) => {
    try {
        res.render('index');
    } catch (err) {
        console.error('Error al renderizar /inicio:', err);
        res.status(500).send(`Error al renderizar la página: ${err.message}`);
    }
});

app.get('/productos', (req, res) => {
    try {
        res.render('productos');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error al renderizar productos');
    }
});

app.get('/login', (req, res) => {
    try {
        const usuarioAutenticado = req.session.usuarioAutenticado || false;
        res.render('login', { usuarioAutenticado });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error al renderizar login');
    }
});

app.get('/recetas', (req, res) => {
    try {
        res.render('receta');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error al renderizar recetas');
    }
});

app.get('/nosotros', (req, res) => {
    try {
        res.render('nosotros');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error al renderizar nosotros');
    }
});

app.get('/adm', verificarAutenticacion, (req, res) => {
    try {
        res.render('adm', { usuarioAutenticado: true });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error al renderizar admin');
    }
});

// Rutas de autenticación
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Por favor, ingrese usuario y contraseña' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Establece la sesión antes de enviar la respuesta
        req.session.usuarioAutenticado = true;
        req.session.save((err) => {
            if (err) {
                console.error('Error al guardar la sesión:', err);
                return res.status(500).json({ message: 'Error al iniciar sesión' });
            }
            // Envía la respuesta solo después de que la sesión se haya guardado
            res.status(200).json({ 
                message: 'Login exitoso',
                authenticated: true
            });
        });
    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login');
    });
});

// API de usuarios
app.put('/api/usuarios/cambiar-password', async (req, res) => {
    const { username, currentPassword, newPassword } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        if (user.password !== currentPassword) {
            return res.status(403).json({ error: "Contraseña actual incorrecta" });
        }

        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error al cambiar la contraseña" });
    }
});

// API de productos
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Product.find();
        res.json(productos);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

app.post('/api/productos', verificarAutenticacion, upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, precio, gramaje } = req.body;
        // Aquí deberías implementar la lógica para subir la imagen a un servicio como S3 o Cloudinary
        const imagenUrl = '/ruta/a/imagen'; // Esto debe ser reemplazado con la URL real

        const nuevoProducto = new Product({
            nombre,
            precio: Number(precio),
            gramaje,
            imagenUrl
        });

        const productoGuardado = await nuevoProducto.save();
        res.status(201).json(productoGuardado);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error al agregar producto" });
    }
});

app.put('/api/productos/:id', verificarAutenticacion, upload.single('imagen'), async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, gramaje } = req.body;
        // Aquí deberías implementar la lógica para subir la imagen a un servicio como S3 o Cloudinary
        const imagenUrl = req.file ? '/ruta/a/imagen' : undefined;

        const productoActualizado = await Product.findByIdAndUpdate(id, {
            nombre,
            precio: Number(precio),
            gramaje,
            ...(imagenUrl && { imagenUrl })
        }, { new: true });

        if (!productoActualizado) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json(productoActualizado);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error al actualizar producto" });
    }
});

app.delete('/api/productos/:id', verificarAutenticacion, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error al eliminar producto" });
    }
});

// API de recetas
app.get('/api/recetas', async (req, res) => {
    try {
        const recetas = await Recipe.find();
        res.json(recetas);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error al obtener recetas" });
    }
});

app.post('/api/recetas', verificarAutenticacion, upload.single('imagen'), async (req, res) => {
    try {
        const { nombreReceta, descripcion, linkReceta } = req.body;
        // Aquí deberías implementar la lógica para subir la imagen a un servicio como S3 o Cloudinary
        const imagenUrl = '/ruta/a/imagen'; // Esto debe ser reemplazado con la URL real

        const nuevaReceta = new Recipe({
            nombreReceta,
            descripcion,
            linkReceta,
            imagenUrl
        });

        const recetaGuardada = await nuevaReceta.save();
        res.status(201).json(recetaGuardada);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error al agregar receta" });
    }
});

app.put('/api/recetas/:id', verificarAutenticacion, upload.single('imagen'), async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreReceta, descripcion, linkReceta } = req.body;
        // Aquí deberías implementar la lógica para subir la imagen a un servicio como S3 o Cloudinary
        const imagenUrl = req.file ? '/ruta/a/imagen' : undefined;

        const recetaActualizada = await Recipe.findByIdAndUpdate(id, {
            nombreReceta,
            descripcion,
            linkReceta,
            ...(imagenUrl && { imagenUrl })
        }, { new: true });

        if (!recetaActualizada) {
            return res.status(404).json({ error: "Receta no encontrada" });
        }

        res.json(recetaActualizada);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error al actualizar receta" });
    }
});

app.delete('/api/recetas/:id', verificarAutenticacion, async (req, res) => {
    try {
        await Recipe.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error al eliminar receta" });
    }
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).send('Error interno del servidor');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});