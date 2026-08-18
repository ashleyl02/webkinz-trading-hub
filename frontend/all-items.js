const collections = [
    { name: "color", file: "../data/collections/color-collections.json" },
    { name: "misc", file: "../data/collections/misc-collections.json" },
    { name: "theme", file: "../data/collections/theme-collections.json" },
    { name: "type", file: "../data/collections/type-collections.json" }
];

const ITEMS_PER_PAGE = 50;
let currentPage = 1;
let itemCount = 0;

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

        const tradeableItems = uniqueItems.filter(item => item.is_tradeable);

        tradeableItems.sort((a, b) => a.title.localeCompare(b.title));
        itemCount = tradeableItems.length;

        displayItems(tradeableItems);
    } catch (error) {
        console.error("Error loading all items:", error);
    }
}

function displayItems(items) {
    const container = document.getElementById("items");
    container.innerHTML = "";

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedItems = items.slice(startIndex, endIndex);

    paginatedItems.forEach(item => {
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
    });

    setupPagination(items);
}

function setupPagination(items) {
    const pageNumbers = document.getElementById("page-numbers");
    const prev = document.getElementById("prev");
    const next = document.getElementById("next");

    const totalPages = Math.ceil(itemCount / ITEMS_PER_PAGE);

    pageNumbers.innerHTML = `Page ${currentPage} of ${totalPages}`;

    prev.onclick = (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            displayItems(items);
        }
    };

    next.onclick = (event) => {
        event.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            displayItems(items);
        }
    };
}

loadAllItems();