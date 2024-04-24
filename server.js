const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.put('/savedlists.json', (req, res) => {
  const savedLists = req.body; 

  fs.writeFile(path.join(__dirname, 'public', 'savedlists.json'), JSON.stringify(savedLists), (err) => {
    if (err) {
      console.error('Error al guardar la lista:', err);
      res.status(500).send('Error al guardar la lista');
    } else {
      console.log('Lista guardada correctamente');
      res.sendStatus(200);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
