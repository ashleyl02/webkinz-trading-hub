const collections = [
    { name: "color", file: "../data/collections/color-collections.json" },
    { name: "misc", file: "../data/collections/misc-collections.json" },
    { name: "theme", file: "../data/collections/theme-collections.json" },
    { name: "type", file: "../data/collections/type-collections.json" }
];

async function loadAllItems() {
    try {
        const allItems = [];

        for (const collection of collections) {
            const response = await fetch(collection.file);
            const categories = await response.json();

            const itemPromises = categories.map(async category => {
                const itemFile = `../data/items/${collection.name}-items/${category.id}-items.json`;
                const response = await fetch(itemFile);
                return await response.json();
            });

            const categoryItems = await Promise.all(itemPromises);

            allItems.push(...categoryItems.flat());
        }

        const uniqueItems = [...new Map(allItems.map(item => [item.id, item])).values()];

        uniqueItems.sort((a, b) => a.title.localeCompare(b.title));

        displayItems(uniqueItems);
    } catch (error) {
        console.error("Error loading all items:", error);
    }
}

function displayItems(items) {
    const container = document.getElementById("items");

    items.forEach(item => {
        if (item.is_tradeable) {
            const card = document.createElement("div");
            card.className = "item-card";
            const img = document.createElement("img");
            img.src = item.image_url;
            img.alt = item.title;
            const caption = document.createElement("p");
            caption.textContent = item.title;

            const buttonContainer = document.createElement("div");
            buttonContainer.className = "button-container";

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
}

loadAllItems();