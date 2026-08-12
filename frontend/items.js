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

                /* button html structure:
                    <div class="wishlist-button">
                        <input type="checkbox" id="wishlist-button" />
                        <label for="wishlist-button"></label>
                    </div>
                    <div class="inventory-button">
                        <input type="checkbox" id="inventory-button" />
                        <label for="inventory-button"></label>
                    </div>
                */  

                const wishlistButtonContainer = document.createElement("div");
                wishlistButtonContainer.className = "wishlist-button";
                const wishlistButton = document.createElement("input");
                wishlistButton.type = "checkbox";
                wishlistButton.id = `wishlist-${item.id}`;
                const wishlistLabel = document.createElement("label");
                wishlistLabel.setAttribute("for", wishlistButton.id);
                wishlistButtonContainer.appendChild(wishlistButton);
                wishlistButtonContainer.appendChild(wishlistLabel);

                const inventoryButtonContainer = document.createElement("div");
                inventoryButtonContainer.className = "inventory-button";
                const inventoryButton = document.createElement("input");
                inventoryButton.type = "checkbox";
                inventoryButton.id = `inventory-${item.id}`;
                const inventoryLabel = document.createElement("label");
                inventoryLabel.setAttribute("for", inventoryButton.id);
                inventoryButtonContainer.appendChild(inventoryButton);
                inventoryButtonContainer.appendChild(inventoryLabel);

                buttonContainer.appendChild(wishlistButtonContainer);
                buttonContainer.appendChild(inventoryButtonContainer);

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