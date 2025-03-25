let books = [];
let isGridView = false;
let currPage = 1;

async function fetchBooks(page = 1) {
  try {
    const res = await fetch(
      `https://api.freeapi.app/api/v1/public/books?page=${page}`
    );
    const responseData = await res.json();
    books = responseData.data.data;
    displayBooks(books);
  } catch (error) {
    console.error(`Error while fetching Data: ${error}`);
  }
}

function displayBooks(booksList) {
  const container = document.getElementById("BooksContainer");
  container.innerHTML = "";
  container.className = isGridView ? "grid-view" : "list-view";

  booksList.forEach((book) => {
    const { title, authors, publisher, publishedDate, imageLinks, infoLink } =
      book.volumeInfo;
    const thumbnail = imageLinks?.thumbnail || "./assets/Logo.svg";

    const bookdiv = document.createElement("div");
    bookdiv.className = "book";
    bookdiv.innerHTML = `
    <img src="${thumbnail}" alt="${title}">
    <div>
      <h3>${title}</h3>
      <p><span>Written By:</span> ${authors ? authors.join(",") : "Unknown"}</p>
      <p><span>Publisher:</span> ${publisher || "Unknown"}</p>
      <p><span>Date:</span> ${publishedDate || "N/A"}</p>
      <a href="${infoLink}" target="_blank">More Info</a>
    <div>
    `;

    container.appendChild(bookdiv);
  });
}

// Changing the view
document.getElementById("ToggleView").addEventListener("click", () => {
  if (isGridView) {
    isGridView = false;
    document.getElementById("ToggleView").textContent = "Grid View";
  } else {
    isGridView = true;
    document.getElementById("ToggleView").textContent = "List View";
  }
  displayBooks(books);
});

// Searching Implementation
document.getElementById("searchBar").addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase();
  const filteredBooks = books.filter((book) => {
    const title = book.volumeInfo.title.toLowerCase();
    return title.includes(searchTerm);
  });
  displayBooks(filteredBooks);
});

// Sorting the books based on title
document.getElementById("SortChar").addEventListener("click", () => {
  books.sort((a, b) => a.volumeInfo.title.localeCompare(b.volumeInfo.title));
  displayBooks(books);
});

// sorting the books base on date;
document.getElementById("SortDate").addEventListener("click", () => {
  books.sort(
    (a, b) =>
      new Date(b.volumeInfo.publishedDate) -
      new Date(a.volumeInfo.publishedDate)
  );
  displayBooks(books);
});

// Updating forward and backward buttons
document.getElementById("Previous").addEventListener("click", () => {
  if (currPage > 1) {
    currPage--;
    document.getElementById("pageNum").textContent = `Page ${currPage} of 21`;
    fetchBooks(currPage);
  }
});

document.getElementById("Next").addEventListener("click", () => {
  if (currPage < 21) {
    currPage++;
    document.getElementById("pageNum").textContent = `Page ${currPage} of 21`;
    fetchBooks(currPage);
  }
});

fetchBooks();
