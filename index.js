import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import MongoStore from 'connect-mongo';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'due67qujm',
    api_key: process.env.CLOUDINARY_API_KEY || '143896964264728',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'l2dkLSdQ05qrofCVVBQ1z2dT9tE'
});

// Configure Cloudinary storage
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'damabrava',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif']
    }
});

// Configure Multer with Cloudinary
const upload = multer({ storage: cloudinaryStorage });

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de vistas y middleware básico
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesión
app.use(session({
    secret: process.env.SESSION_SECRET || 'mi-secreto',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb+srv://hector:hectorCald17@cluster0.nqszi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        collectionName: 'sessions',
        ttl: 24 * 60 * 60 
    }),
    cookie: { 
        secure: process.env.NODE_ENV || 'production'  === 'production', // true en producción (Vercel), false en local
        httpOnly: true, 
        sameSite: process.env.NODE_ENV || 'production' === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 
    }   
}));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://hector:hectorCald17@cluster0.nqszi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
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
    cloudinaryId: String
});

const recipeSchema = new mongoose.Schema({
    nombreReceta: String,
    descripcion: String,
    linkReceta: String,
    imagenUrl: String,
    cloudinaryId: String
});

// Modelos
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Recipe = mongoose.model('Recipe', recipeSchema);

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

        req.session.usuarioAutenticado = true;
        req.session.save((err) => {
            if (err) {
                console.error('Error al guardar la sesión:', err);
                return res.status(500).json({ message: 'Error al iniciar sesión' });
            }
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
app.put('/api/usuarios/cambiar-password', verificarAutenticacion, async (req, res) => {
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

//API de Agregar productos
app.post('/api/productos', verificarAutenticacion, upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, precio, gramaje } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: "No se ha proporcionado una imagen" });
        }

        const nuevoProducto = new Product({
            nombre,
            precio: Number(precio),
            gramaje,
            imagenUrl: req.file.path,
            cloudinaryId: req.file.filename
        });

        const productoGuardado = await nuevoProducto.save();
        res.status(201).json(productoGuardado);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error al agregar producto" });
    }
});

//API de actualizacion de Productos
app.put('/api/productos/:id', verificarAutenticacion, upload.single('imagen'), async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, gramaje } = req.body;
        
        const producto = await Product.findById(id);
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const productoActualizado = {
            nombre,
            precio: Number(precio),
            gramaje
        };

        // Si hay una nueva imagen, actualiza la imagen
        if (req.file) {
            // Si existe una imagen previa en Cloudinary, la eliminamos
            if (producto.cloudinaryId) {
                await cloudinary.uploader.destroy(producto.cloudinaryId);
            }
            
            productoActualizado.imagenUrl = req.file.path;
            productoActualizado.cloudinaryId = req.file.filename;
        }

        const resultado = await Product.findByIdAndUpdate(id, productoActualizado, { new: true });
        res.json(resultado);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error al actualizar producto" });
    }
});


//API de eliminacion de productos
app.delete('/api/productos/:id', verificarAutenticacion, async (req, res) => {
    try {
        const producto = await Product.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Elimina la imagen de Cloudinary
        if (producto.cloudinaryId) {
            await cloudinary.uploader.destroy(producto.cloudinaryId);
        }

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

//Api de Agregar recetas
app.post('/api/recetas', verificarAutenticacion, upload.single('imagen'), async (req, res) => {
    try {
        const { nombreReceta, descripcion, linkReceta } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: "No se ha proporcionado una imagen" });
        }

        const nuevaReceta = new Recipe({
            nombreReceta,
            descripcion,
            linkReceta,
            imagenUrl: req.file.path,
            cloudinaryId: req.file.filename
        });

        const recetaGuardada = await nuevaReceta.save();
        res.status(201).json(recetaGuardada);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error al agregar receta" });
    }
});

//API de actulizacion de recetas
app.put('/api/recetas/:id', verificarAutenticacion, upload.single('imagen'), async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreReceta, descripcion, linkReceta } = req.body;
        
        const receta = await Recipe.findById(id);
        if (!receta) {
            return res.status(404).json({ error: "Receta no encontrada" });
        }

        const recetaActualizada = {
            nombreReceta,
            descripcion,
            linkReceta
        };

        // Si hay una nueva imagen, actualiza la imagen
        if (req.file) {
            // Si existe una imagen previa en Cloudinary, la eliminamos
            if (receta.cloudinaryId) {
                await cloudinary.uploader.destroy(receta.cloudinaryId);
            }
            
            recetaActualizada.imagenUrl = req.file.path;
            recetaActualizada.cloudinaryId = req.file.filename;
        }

        const resultado = await Recipe.findByIdAndUpdate(id, recetaActualizada, { new: true });
        res.json(resultado);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error al actualizar receta" });
    }
});

//API de eliminacion de recetas
app.delete('/api/recetas/:id', verificarAutenticacion, async (req, res) => {
    try {
        const receta = await Recipe.findById(req.params.id);
        if (!receta) {
            return res.status(404).json({ error: "Receta no encontrada" });
        }

        // Elimina la imagen de Cloudinary
        if (receta.cloudinaryId) {
            await cloudinary.uploader.destroy(receta.cloudinaryId);
        }

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