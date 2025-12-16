const express = require("express");
const router = express.Router();
const Book = require("../models/book.models");
const { model } = require("mongoose");

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
    book = await Book.findById(id);
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
    const books = await Book.find();
    console.log("GET ALL", books);
    if (books.length === 0) {
      return res.status(204).json([]);
    }
    res.json(books);
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

  const book = new Book({
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


// Obtener un libro por ID GET ONE
router.get("/:id", getBook, async(req, res) => {
  res.json(res.book);
});


// PUT
router.put("/:id", getBook, async (req, res) => {
  try {
    const book = res.book;
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genre = req.body.genre || book.genre;
    book.publication_date = req.body.publication_date || book.publication_date;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
})


// PATCH

router.patch("/:id", getBook, async (req, res) => {

  if(!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date){
    return  res.status(400).json({
      message: "Al menos uno de los campos (titulo, autor, genero, fecha de publicacion) debe ser proporcionado para la actualizacion parcial",
    });
  }

   try {
    const book = res.book;
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genre = req.body.genre || book.genre;
    book.publication_date = req.body.publication_date || book.publication_date;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
})


// DELETE
router.delete("/:id", getBook, async (req, res) => {
  try {
    const book = res.book;
    await book.deleteOne({_id: book._id});
    res.json({ message: "Libro eliminado" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

module.exports = router
