const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (e) {
    res.status(500).send({ message: 'Ошибка по умолчанию.' });
  }
};

const createCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner });
    res.status(201).send(card);
  } catch (e) {
    if (e.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
    } else {
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    }
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
    }
    const cardDelete = await Card.findByIdAndRemove(cardId);
    return res.status(200).send(cardDelete);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
    } return res.status(500).send({ message: 'Ошибка по умолчанию.' });
  }
};

const likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
    }
    const cardL = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    return res.status(200).send(cardL);
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
    } return res.status(500).send({ message: 'Ошибка по умолчанию.' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
    }
    return res.status(200).send(card);
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
    } return res.status(500).send({ message: 'Ошибка по умолчанию.' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
