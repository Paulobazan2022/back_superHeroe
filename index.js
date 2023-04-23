let characters = require("./superhero.json");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const port = 3001;

const getCharacter = (id) => {
  const character = characters.filter((char) => char.id === id);
  return character;
};

app.get("/characters", (req, res) => {
  res.status(200).json(characters);
});

app.get("/characters/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let character = getCharacter(id);
  if (character.length < 1) {
    res.status(404).json({ error :"Personaje no encontrado"});
  } else {
    res.status(200).json(character[0]);
  }
});

app.post("/characters", (req, res) => {
  const info = req.body;

  if (
    !("name" in info) ||
    !("publisher" in info) ||
    !("alter_ego" in info) ||
    !("first_appearance" in info) ||
    !("image" in info) ||
    !("characters" in info)
  ) {
    res.status(400).json({ error : "Es necesario completar todos los campos"});
  } else {
    const charactersId = characters.map((char) => char.id);
    const maxId = Math.max(...charactersId);

    const newCharacter = { id: maxId + 1, ...info };
    characters.push(newCharacter);
    res.status(201).json(newCharacter);
  }
});

app.put("/characters/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let newInfo = req.body;

  let currentChararter = getCharacter(id);

  if (
    !("name" in newInfo) ||
    !("publisher" in newInfo) ||
    !("alter_ego" in newInfo) ||
    !("first_appearance" in newInfo) ||
    !("image" in newInfo) ||
    !("characters" in newInfo) ||
    currentChararter.length < 1) {
    res.status(400).json({ error : "Necesario enviar toda la informacion"});
  }
  
  characters = characters.map((char) =>
    id === char.id ? {id: id, ...newInfo } : char
  );
  res.status(201).json(currentChararter);
  
});

app.patch("/characters/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const newInfo = req.body;

  let currentChararter = getCharacter(id);

  if (currentChararter.length < 1) {
    res.status(404).json();
  }

  currentChararter = { ...currentChararter[0], ...newInfo };
  characters = characters.map((char) =>
    id === char.id ? { ...currentChararter } : char);
  res.status(201).json(newInfo);
});

app.delete("/characters/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let currentChararter = getCharacter(id);
  if (currentChararter < 1) {
    res.status(404).json();
  }

  characters = characters.filter((char) => char.id !== id);
  res.status(204).json();
});

app.listen(port, () => {
  console.log(`Todo funcionando en el puerto http://localhost:${port}`);
});
