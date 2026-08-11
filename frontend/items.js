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
            is_tradeable = item.is_tradeable;
            if (is_tradeable) {
                const card = document.createElement("div");
                card.className = "item-card";

                const img = document.createElement("img");
                img.src = item.image_url;
                img.alt = item.title;

                const caption = document.createElement("p");
                caption.textContent = item.title;

                const buttonContainer = document.createElement("div");
                buttonContainer.className = "button-container";

                const wishlistButton = document.createElement("button");
                wishlistButton.className = "wishlist-button";
                buttonContainer.appendChild(wishlistButton);

                const inventoryButton = document.createElement("button");
                inventoryButton.className = "inventory-button";
                buttonContainer.appendChild(inventoryButton);

                card.appendChild(img);
                card.appendChild(caption);
                card.appendChild(buttonContainer);

                container.appendChild(card);
            }
        });
    })
    .catch(error => {
        console.error(`Error loading items: ${jsonFile}`, error);
    });