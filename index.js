import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import session from 'express-session';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

// Conectar a MongoDB
mongoose.connect('mongodb+srv://hector:hectorCald17@cluster0.nqszi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
}).then(() => {
    console.log('Conectado a MongoDB');
}).catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
});

// Definir esquema y modelo de usuario
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

// Definir esquema y modelo de producto
const productSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    gramaje: String,
    imagenUrl: String,
});

const Product = mongoose.model('Product', productSchema);

// Definir esquema y modelo de receta
const recipeSchema = new mongoose.Schema({
    nombreReceta: String,
    descripcion: String,
    linkReceta: String,
    imagenUrl: String,
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Configura multer para manejar archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generar nombre único
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Preservar la extensión original
    }
});

const upload = multer({ storage });

app.use(session({
    secret: 'mi-secreto', // Cambia esto por una clave secreta en producción
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Usa `true` si estás usando HTTPS
}));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const verificarAutenticacion = (req, res, next) => {
    if (req.session && req.session.usuarioAutenticado) {
        next(); // El usuario está autenticado, continuar con la solicitud
    } else {
        return res.redirect('/login');
    }
};

// Rutas para renderizar las vistas
app.get('/', (req, res) => res.render('index.ejs'));
app.get('/inicio', (req, res) => res.render('index.ejs'));
app.get('/productos', (req, res) => res.render('productos.ejs'));
app.get('/login', (req, res) => {
    const usuarioAutenticado = req.session.usuarioAutenticado || false;
    res.render('login.ejs', { usuarioAutenticado });
});
app.get('/recetas', (req, res) => res.render('receta.ejs'));
app.get('/nosotros', (req, res) => res.render('nosotros.ejs'));
app.get('/adm', verificarAutenticacion, (req, res) => {
    res.render('adm.ejs', { usuarioAutenticado: true });
});

// Manejo de inicio de sesión
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });
        
        if (!user) {
            return res.redirect('/login');
        }

        req.session.usuarioAutenticado = true;
        res.redirect('/adm');
    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        res.status(500).send('Error del servidor');
    }
});

// Ruta para cerrar sesión
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar la sesión:', err);
            return res.status(500).send('Error al cerrar la sesión');
        }
        res.redirect('/login');
    });
});

// API para obtener productos
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Product.find();
        res.json(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error al obtener productos");
    }
});

// Ruta para agregar un producto
app.post('/api/productos', verificarAutenticacion, upload.single('imagen'), async (req, res) => {
    const { nombre, precio, gramaje } = req.body;
    const imagenUrl = `/uploads/${req.file.filename}`; // Guardar la URL de la imagen

    const nuevoProducto = new Product({
        nombre,
        precio: Number(precio),
        gramaje,
        imagenUrl
    });

    try {
        const productoGuardado = await nuevoProducto.save();
        res.status(201).json(productoGuardado);
    } catch (error) {
        console.error("Error al agregar producto:", error);
        res.status(500).json({ error: "Error al agregar producto" });
    }
});

// API para actualizar un producto
app.put('/api/productos/:id', verificarAutenticacion, upload.single('imagen'), async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, gramaje } = req.body;
    let imagenUrl;

    if (req.file) {
        imagenUrl = `/uploads/${req.file.filename}`; // Actualizar URL si se sube una nueva imagen
    }

    try {
        const productoActualizado = await Product.findByIdAndUpdate(id, {
            nombre,
            precio: Number(precio),
            gramaje,
            imagenUrl: imagenUrl || undefined // Mantener la URL anterior si no se sube una nueva imagen
        }, { new: true });

        if (!productoActualizado) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.status(200).json(productoActualizado);
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ error: "Error al actualizar producto" });
    }
});

// API para eliminar un producto
app.delete('/api/productos/:id', verificarAutenticacion, async (req, res) => {
    const { id } = req.params;

    try {
        await Product.findByIdAndDelete(id);
        res.sendStatus(204); // No Content
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ error: "Error al eliminar producto" });
    }
});

// API para obtener recetas
app.get('/api/recetas', async (req, res) => {
    try {
        const recetas = await Recipe.find();
        res.json(recetas);
    } catch (error) {
        console.error("Error al obtener recetas:", error);
        res.status(500).send("Error al obtener recetas");
    }
});

// API para agregar una nueva receta
app.post('/api/recetas', verificarAutenticacion, upload.single('imagen'), async (req, res) => {
    const { nombreReceta, descripcion, linkReceta } = req.body;
    const imagenUrl = req.file ? `/uploads/${req.file.filename}` : ''; // Guardar la URL de la imagen

    const nuevaReceta = new Recipe({
        nombreReceta,
        descripcion,
        linkReceta,
        imagenUrl
    });

    try {
        const recetaGuardada = await nuevaReceta.save();
        res.status(201).json(recetaGuardada);
    } catch (error) {
        console.error("Error al agregar receta:", error);
        res.status(500).json({ error: "Error al agregar receta" });
    }
});

// API para eliminar una receta
app.delete('/api/recetas/:id', verificarAutenticacion, async (req, res) => {
    const { id } = req.params;

    try {
        await Recipe.findByIdAndDelete(id);
        res.sendStatus(204); // No Content
    } catch (error) {
        console.error("Error al eliminar receta:", error);
        res.status(500).json({ error: "Error al eliminar receta" });
    }
});

// API para actualizar una receta
app.put('/api/recetas/:id', verificarAutenticacion, upload.single('imagen'), async (req, res) => {
    const { id } = req.params;
    const { nombreReceta, descripcion, linkReceta } = req.body;
    let imagenUrl;

    if (req.file) {
        imagenUrl = `/uploads/${req.file.filename}`; // Actualizar URL si se sube una nueva imagen
    }

    try {
        const recetaActualizada = await Recipe.findByIdAndUpdate(id, {
            nombreReceta,
            descripcion,
            linkReceta,
            imagenUrl: imagenUrl || undefined // Mantener la URL anterior si no se sube una nueva imagen
        }, { new: true });

        if (!recetaActualizada) {
            return res.status(404).json({ error: "Receta no encontrada" });
        }

        res.status(200).json(recetaActualizada);
    } catch (error) {
        console.error("Error al actualizar receta:", error);
        res.status(500).json({ error: "Error al actualizar receta" });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
