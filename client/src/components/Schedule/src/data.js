import { colors } from "@atlaskit/theme";
import jakeImg from "./assets/jake.png";
import finnImg from "./assets/finn.png";
import bmoImg from "./assets/bmo.png";
import princessImg from "./assets/princess.png";

const jake = {
  id: "1",
  name: "Понеділок",
  url: "http://adventuretime.wikia.com/wiki/Jake",
  colors: {
    soft: colors.Y50,
    hard: colors.Y200
  }
};

const BMO = {
  id: "2",
  name: "BMO",
  url: "http://adventuretime.wikia.com/wiki/BMO",
  avatarUrl: bmoImg,
  colors: {
    soft: colors.G50,
    hard: colors.G200
  }
};

const finn = {
  id: "3",
  name: "Finn",
  url: "http://adventuretime.wikia.com/wiki/Finn",
  avatarUrl: finnImg,
  colors: {
    soft: colors.B50,
    hard: colors.B200
  }
};

const princess = {
  id: "4",
  name: "Princess bubblegum",
  url: "http://adventuretime.wikia.com/wiki/Princess_Bubblegum",
  avatarUrl: princessImg,
  colors: {
    soft: colors.P50,
    hard: colors.P200
  }
};
const princess2 = {
  id: "5",
  name: "Princess",
  url: "http://adventuretime.wikia.com/wiki/Princess_Bubblegum",
  avatarUrl: princessImg,
  colors: {
    soft: colors.P50,
    hard: colors.P200
  }
};

export const authors = [jake, BMO, finn, princess, princess2];

export const quotes = [
  {
    id: "1",
    content: "Математика",
    author: BMO
  },
  {
    id: "2",
    content:
      "Sucking at something",
    author: jake
  },
  {
    id: "3",
    content: "You got to focus on what's real, man",
    author: jake
  },
  {
    id: "4",
    content: "Is that where",
    author: finn
  },
  {
    id: "5",
    content: "Homies help homies.",
    author: finn
  },
  {
    id: "6",
    content: "Responsibility",
    author: princess
  },
  {
    id: "7",
    content: "That's it! The answer",
    author: princess
  },
  {
    id: "8",
    content: "People make mistakes",
    author: finn
  },
  {
    id: "9",
    content: "Don't you always ",
    author: finn
  },
  {
    id: "10",
    content: "I should not have",
    author: princess
  },
  {
    id: "11",
    content: "Please! I need",
    author: princess
  },
  {
    id: "12",
    content: "Haven't slept for a",
    author: princess
  }
];

const getByAuthor = (author, items) =>
  items.filter(quote => quote.author === author);

export const authorQuoteMap = authors.reduce(
  (previous, author) => ({
    ...previous,
    [author.name]: getByAuthor(author, quotes)
  }),
  {}
);
