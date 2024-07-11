import express from "express";

const app = express();
const port = 3000;

app.use(express.static("public"));


app.get("/", (req, res) =>{
    res.render("index.ejs");
})

app.get("/inicio", (req, res) =>{
    res.render("index.ejs");
})

app.get("/productos", (req, res) =>{
    res.render("productos.ejs");
})

app.get("/recetas", (req, res) =>{
    res.render("recetas.ejs");
})

app.get("/nosotros", (req, res) =>{
    res.render("nosotros.ejs");
})

app.get("/contacto", (req, res) =>{
    res.render("contacto.ejs");
})

app.listen(port, () =>{
    console.log("Esta corriendo en el puerto 3000");
})