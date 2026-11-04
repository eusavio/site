const express = require('express');
const path = require('path');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const port = 3000;

const db = new sqlite3.Database('database.db');

app.use(express.static('public'));

app.get('/api/eventos', (req, res) => {
    const sql = "SELECT * FROM Eventos ORDER BY data ASC";

    db.all(sql, [], (err, rows) => {
        if (err) { res.status(400).json({ error: err.message }); return; }
        res.json({ message: "sucesso", data: rows });
    });
});

app.get('/api/membros', (req, res) => {
    const sql = "SELECT * FROM Membros ORDER BY nome ASC";

    db.all(sql, [], (err, rows) => {
        if (err) { res.status(400).json({ error: err.message }); return; }
        res.json({ message: "sucesso", data: rows });
    });
});

app.get('/api/evento/:id', (req, res) => {
    
    const idProcurado = req.params.id;

    const sql = "SELECT * FROM Eventos WHERE id = ?";

    db.get(sql, [idProcurado], (err, row) => {
        if (err) { 
            res.status(400).json({ error: err.message }); 
            return; 
        }

        if (!row) { 
            res.status(404).json({ message: "Evento não encontrado" }); 
            return; 
        }

        res.json({ message: "sucesso", data: row });
    });
});

app.get('/api/evento/:id/membros', (req, res) => {
    const idProcurado = req.params.id;

    const sql = "SELECT m.* FROM Membros m INNER JOIN evento_membro me ON m.id = me.membro_id INNER JOIN Eventos e ON e.id = me.evento_id WHERE e.id = ?";

    db.all(sql, [idProcurado], (err, rows) => {
        if (err) { 
            res.status(400).json({ error: err.message }); 
            return; 
        }

        res.json({ message: "sucesso", data: rows });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});

app.get('/eventos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'eventos', 'eventos.html'));
});

app.get('/evento/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'evento-detalhe', 'evento-detalhe.html'));
});

app.get('/sobre', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'sobre', 'sobre.html'));
});

app.get('/api/membros', (req, res) => {
    db.all('SELECT * FROM Membros ORDER BY nome ASC', [], (err, rows) => {
        if (err) { res.status(400).json({ error: err.message }); return; }
        res.json({ message: 'sucesso', data: rows });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});