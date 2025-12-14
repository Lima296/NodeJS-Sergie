const express = require("express");
const router = express.Router();
const book = require("../models/book.models");

//MIDDLEWARE
const getBook = async (req, res, next) => {
  let book;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) { //chequea si es un id valido, config propia de mongo, si matecha o no con esa expresion regular
    return res.status(404).json({
      message: "ID de libro no valido",
    });
  }

  try {
    book = await book.findById(id);
    if (!book) {
      return res.status(404).json({
        message: "No se encontro el libro",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }

  res.book = book;
  next();
};

// Obtener todos los libros GET ALL
router.get("/", async (req, res) => {
  try {
    const books = await book.find();
    console.log("get all", books);
    if (books.length === 0) {
      return res.status(204).json([]);
    }
    res(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear un nuevo libro (recurso) POST
router.post("/", async (req, res) => {
  const { title, author, genre, publication_date } = req?.body;
  if (!title || !author || !genre || !publication_date) {
    return res.status(400).json({
      message: "Titulo,autor,genero y fecha de publicacion son obligatorios",
    });
  }

  const book = new book({
    title,
    author,
    genre,
    publication_date,
  });

  try {
    const newBook = await book.save();
    console.log(newBook);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
