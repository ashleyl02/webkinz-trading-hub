const params = new URLSearchParams(window.location.search);

const collection = params.get("collection");
const category = params.get("category");

const jsonFile = `../data/items/${collection}-items/${category}-items.json`;

document.getElementById("category-name").textContent = category;
fetch(`../data/collections/${collection}-collections.json`)
    .then(response => response.json())
    .then(collections => {
        const currentCollection = collections.find(item => item.id === category);
        if (currentCollection) {
            document.getElementById("category-name").textContent = currentCollection.title;
        }
    });

fetch(jsonFile)
    .then(response => response.json())
    .then(items => {
        const container = document.getElementById("items");

        items.forEach(item => {
            const card = document.createElement("div");
            card.className = "item-card";

            const img = document.createElement("img");
            img.src = item.image_url;
            img.alt = item.title;

            const caption = document.createElement("p");
            caption.textContent = item.title;

            card.appendChild(img);
            card.appendChild(caption);

            container.appendChild(card);
        });
    })
    .catch(error => {
        console.error(`Error loading items: ${jsonFile}`, error);
    });