import express from 'express';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import multer from 'multer';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import session from 'express-session'; // Módulo para manejar sesiones

// Leer las credenciales del servicio
const serviceAccount = JSON.parse(fs.readFileSync(path.resolve('credentials/firebase-credentials.json'), 'utf-8'));

// Inicializar Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Configuración de Firebase para el cliente
const firebaseConfig = {
    apiKey: "AIzaSyC0x7kpnVa0j9LRfbIYpdYcoAQt40FiQB4",
    authDomain: "damabrava-32e35.firebaseapp.com",
    projectId: "damabrava-32e35",
    storageBucket: "damabrava-32e35.appspot.com",
    messagingSenderId: "980596639374",
    appId: "1:980596639374:web:013c0a7594c90252c86bdf",
    measurementId: "G-ZCLR86GRF5"
};

// Inicializa la aplicación Firebase para el cliente
const firebaseApp = initializeApp(firebaseConfig);
const dbClient = getFirestore(firebaseApp); // Firestore cliente
const storage = getStorage(firebaseApp);

// Inicializa Firestore para Firebase Admin
const dbAdmin = admin.firestore(); // Firestore Admin SDK

// Configura multer para manejar archivos
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const port = 3000;

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
    }
    else{
        return res.redirect('/login');
    }
};

// Función para subir imagen a Firebase Storage
const subirImagen = async (imagen) => {
    try {
        const storageRef = ref(storage, `imagenes/${imagen.originalname}`);
        await uploadBytes(storageRef, imagen.buffer);
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        throw new Error('Error al subir la imagen');
    }
};




// Rutas para renderizar las vistas
app.get('/', (req, res) => res.render('index.ejs'));
app.get('/inicio', (req, res) => res.render('index.ejs'));
app.get('/productos', (req, res) => res.render('productos.ejs'));
app.get('/login', (req, res) => {
    const usuarioAutenticado = req.session.usuarioAutenticado || false; // Obtener el estado de autenticación de la sesión
    res.render('login.ejs', { usuarioAutenticado }); // Pasar la variable al renderizar
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
        // Consulta en la colección 'usuarios' con Firestore Admin SDK
        const userRef = dbAdmin.collection('usuarios');
        const snapshot = await userRef.where('username', '==', username).where('password', '==', password).get();

        if (snapshot.empty) {
            return res.redirect('/login');
        }

        // Si las credenciales son correctas, redirigir a la página de administrador
        req.session.usuarioAutenticado = true; // Aquí se podría guardar más información como el ID de usuario
        res.redirect('/adm');
    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        res.status(500).send('Error del servidor');
        
    }
});

// Ruta para cerrar sesión
app.post('/logout', (req, res) => {
    // Destruir la sesión
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar la sesión:', err);
            return res.status(500).send('Error al cerrar la sesión');
        }
        res.redirect('/login'); // Redirigir al usuario a la página de inicio de sesión
    });
});
// API para actualizar la contraseña de un usuario
app.put('/api/usuarios/cambiar-password', verificarAutenticacion, async (req, res) => {
    const { username, currentPassword, newPassword } = req.body;

    try {
        // Buscar al usuario por el campo 'username'
        const usersRef = dbAdmin.collection('usuarios');
        const snapshot = await usersRef.where('username', '==', username).get();

        if (snapshot.empty) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        let userDoc;
        snapshot.forEach(doc => {
            userDoc = doc;
        });

        const userData = userDoc.data();

        // Verificar si la contraseña actual es correcta
        if (userData.password !== currentPassword) {
            return res.status(400).json({ error: "Contraseña actual incorrecta" });
        }

        // Actualizar la contraseña
        await userDoc.ref.update({ password: newPassword });

        res.status(200).json({ message: "Contraseña actualizada exitosamente" });
        
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        res.status(500).json({ error: "Error al actualizar la contraseña" });
    }
});


// API para obtener productos
app.get('/api/productos', async (req, res) => {
    try {
        // Usar dbClient en lugar de db
        const querySnapshot = await getDocs(collection(dbClient, "productos"));
        const productos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error al obtener productos");
    }
});


// Ruta para agregar un producto
app.post('/api/productos',verificarAutenticacion, upload.single('imagen'), async (req, res) => {
    const { nombre, precio, gramaje } = req.body;
    const imagen = req.file;

    if (!imagen) {
        return res.status(400).json({ error: "La imagen es requerida" });
    }

    try {
        const imagenUrl = await subirImagen(imagen);
        const nuevoProducto = {
            nombre,
            precio: Number(precio),
            gramaje,
            imagenUrl
        };

        const docRef = await addDoc(collection(dbClient, 'productos'), nuevoProducto);
        res.status(201).json({ id: docRef.id, ...nuevoProducto });
    } catch (error) {
        console.error("Error al agregar producto:", error);
        res.status(500).json({ error: "Error al agregar producto" });
    }
});

// API para actualizar un producto
app.put('/api/productos/:id', verificarAutenticacion, upload.single('imagen'), async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, gramaje } = req.body;
    const imagen = req.file;

    try {
        const productoRef = doc(dbClient, 'productos', id);
        let imagenUrl;

        if (imagen) {
            imagenUrl = await subirImagen(imagen);
        } else {
            const productoSnapshot = await getDoc(productoRef);
            if (!productoSnapshot.exists()) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }
            const productoData = productoSnapshot.data();
            imagenUrl = productoData.imagenUrl; // Mantener la URL existente
        }

        await updateDoc(productoRef, {
            nombre,
            precio: Number(precio),
            gramaje,
            imagenUrl
        });

        res.status(200).json({ id, nombre, precio, gramaje, imagenUrl });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ error: "Error al actualizar producto" });
    }
});

// API para eliminar un producto
app.delete('/api/productos/:id', verificarAutenticacion, async (req, res) => {
    const { id } = req.params;

    try {
        const productoRef = doc(dbClient, 'productos', id);
        await deleteDoc(productoRef);
        res.sendStatus(204); // No Content
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ error: "Error al eliminar producto" });
    }
});

// API para obtener recetas
app.get('/api/recetas', async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(dbClient, "recetas"));
        const recetas = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(recetas);
    } catch (error) {
        console.error("Error al obtener recetas:", error);
        res.status(500).send("Error al obtener recetas");
    }
});

// API para agregar una nueva receta
app.post('/api/recetas', verificarAutenticacion, upload.single('imagen'), async (req, res) => {
    const { nombreReceta, descripcion, linkReceta } = req.body;
    const imagen = req.file;

    try {
        const imagenUrl = await subirImagen(imagen);
        const nuevaReceta = { nombreReceta, descripcion, linkReceta, imagenUrl };
        const docRef = await addDoc(collection(dbClient, "recetas"), nuevaReceta);
        res.status(201).json({ id: docRef.id, ...nuevaReceta });
    } catch (error) {
        console.error("Error al agregar receta:", error);
        res.status(500).json({ error: "Error al agregar receta" });
    }
});

// API para eliminar una receta
app.delete('/api/recetas/:id', verificarAutenticacion, async (req, res) => {
    const { id } = req.params;

    try {
        const recetaRef = doc(dbClient, 'recetas', id);
        await deleteDoc(recetaRef);
        res.sendStatus(204); // No Content
    } catch (error) {
        console.error("Error al eliminar receta:", error);
        res.status(500).json({ error: "Error al eliminar receta" });
    }
});

// API para actualizar una receta
app.put('/api/recetas/:id',verificarAutenticacion, upload.single('imagen'), async (req, res) => {
    const { id } = req.params;
    const { nombreReceta, descripcion, linkReceta } = req.body;
    const imagen = req.file;

    try {
        const recetaRef = doc(dbClient, 'recetas', id);
        const recetaSnapshot = await getDoc(recetaRef);
        if (!recetaSnapshot.exists()) {
            return res.status(404).json({ error: "Receta no encontrada" });
        }

        let imagenUrl;
        if (imagen) {
            imagenUrl = await subirImagen(imagen);
        } else {
            const recetaData = recetaSnapshot.data();
            imagenUrl = recetaData.imagenUrl; // Mantener la URL existente
        }

        await updateDoc(recetaRef, {
            nombreReceta,
            descripcion,
            linkReceta,
            imagenUrl
        });

        res.status(200).json({ id, nombreReceta, descripcion, linkReceta, imagenUrl });
    } catch (error) {
        console.error("Error al actualizar receta:", error);
        res.status(500).json({ error: "Error al actualizar receta" });
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
