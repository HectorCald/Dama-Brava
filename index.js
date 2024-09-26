import express from "express";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import multer from "multer";
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Leer las credenciales del servicio
const serviceAccount = JSON.parse(fs.readFileSync(path.resolve('credentials/firebase-credentials.json'), 'utf-8'));

// Inicializar Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC0x7kpnVa0j9LRfbIYpdYcoAQt40FiQB4",
    authDomain: "damabrava-32e35.firebaseapp.com",
    projectId: "damabrava-32e35",
    storageBucket: "damabrava-32e35.appspot.com",
    messagingSenderId: "980596639374",
    appId: "1:980596639374:web:013c0a7594c90252c86bdf",
    measurementId: "G-ZCLR86GRF5"
};

// Inicializa la aplicación Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

// Configura multer para manejar archivos
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Función para subir imagen a Firebase Storage
const subirImagen = async (imagen) => {
    try {
        const storageRef = ref(storage, `imagenes/${imagen.originalname}`);
        await uploadBytes(storageRef, imagen.buffer);
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        console.error("Error al subir la imagen:", error);
        throw new Error("Error al subir la imagen");
    }
};

// Rutas para renderizar las vistas
app.get("/", (req, res) => res.render("index.ejs"));
app.get("/inicio", (req, res) => res.render("index.ejs"));
app.get("/login", (req, res) => res.render("login.ejs"));
app.get("/productos", (req, res) => res.render("productos.ejs"));
app.get("/recetas", (req, res) => res.render("receta.ejs"));
app.get("/nosotros", (req, res) => res.render("nosotros.ejs"));
app.post("/adm", (req, res) => res.render("adm.ejs"));

// API para obtener productos
app.get('/api/productos', async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, "productos"));
        const productos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error al obtener productos");
    }
});

// Ruta para agregar un producto
app.post('/api/productos', upload.single('imagen'), async (req, res) => {
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

        const docRef = await addDoc(collection(db, 'productos'), nuevoProducto);
        res.status(201).json({ id: docRef.id, ...nuevoProducto });
    } catch (error) {
        console.error("Error al agregar producto:", error);
        res.status(500).json({ error: "Error al agregar producto" });
    }
});

// API para actualizar un producto
app.put('/api/productos/:id', upload.single('imagen'), async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, gramaje } = req.body;
    const imagen = req.file;

    try {
        const productoRef = doc(db, 'productos', id);
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
app.delete('/api/productos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const productoRef = doc(db, 'productos', id);
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
        const querySnapshot = await getDocs(collection(db, "recetas"));
        const recetas = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(recetas);
    } catch (error) {
        console.error("Error al obtener recetas:", error);
        res.status(500).send("Error al obtener recetas");
    }
});

// API para agregar una nueva receta
app.post('/api/recetas', upload.single('imagen'), async (req, res) => {
    const { nombreReceta, descripcion, linkReceta } = req.body;
    const imagen = req.file;

    try {
        const imagenUrl = await subirImagen(imagen);
        const nuevaReceta = { nombreReceta, descripcion, linkReceta, imagenUrl };
        const docRef = await addDoc(collection(db, "recetas"), nuevaReceta);
        res.status(201).json({ id: docRef.id, ...nuevaReceta });
    } catch (error) {
        console.error("Error al agregar receta:", error);
        res.status(500).json({ error: "Error al agregar receta" });
    }
});

// API para eliminar una receta
app.delete('/api/recetas/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const recetaRef = doc(db, 'recetas', id);
        await deleteDoc(recetaRef);
        res.sendStatus(204); // No Content
    } catch (error) {
        console.error("Error al eliminar receta:", error);
        res.status(500).json({ error: "Error al eliminar receta" });
    }
});

// API para actualizar una receta
app.put('/api/recetas/:id', upload.single('imagen'), async (req, res) => {
    const { id } = req.params;
    const { nombreReceta, descripcion, linkReceta } = req.body;
    const imagen = req.file;

    try {
        const recetaRef = doc(db, 'recetas', id);
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
