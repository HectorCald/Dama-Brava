// Rutas para renderizar las vistas
app.post("/adm", (req, res) => {
    res.render("adm.ejs");
});

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/inicio", (req, res) => {
    res.render("index.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/productos", (req, res) => {
    res.render("productos.ejs");
});

app.get("/recetas", (req, res) => {
    res.render("receta.ejs");
});

app.get("/nosotros", (req, res) => {
    res.render("nosotros.ejs");
});