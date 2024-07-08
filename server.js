const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Configurar middlewares
app.use(bodyParser.json());
app.use(express.static('public'));

// Conectar a la base de datos SQLite
const db = new sqlite3.Database(':memory:');

// Crear la tabla de tareas
db.serialize(() => {
    db.run("CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, completed BOOLEAN)");
});

// Rutas
app.get('/api/tasks', (req, res) => {
    db.all("SELECT * FROM tasks", (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json({tasks: rows});
    });
});

app.post('/api/tasks', (req, res) => {
    const { name } = req.body;
    db.run("INSERT INTO tasks (name, completed) VALUES (?, ?)", [name, false], function(err) {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json({id: this.lastID, name, completed: false});
    });
});

app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM tasks WHERE id = ?", id, function(err) {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json({deletedID: id});
    });
});

// Nueva ruta para ver los datos almacenados en la base de datos
app.get('/api/debug', (req, res) => {
    db.all("SELECT * FROM tasks", (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json({tasks: rows});
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
