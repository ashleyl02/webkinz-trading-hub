document.getElementById("type-button").click();

function openCollection(evt, collectiontype) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tab-links");
    for (i = 0; i< tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(collectiontype).style.display = "block";
    evt.currentTarget.className += " active";
}

function loadCollection(jsonFile, collectiontype) {
    fetch(jsonFile)
        .then(response => response.json())
        .then(items => {
            const collection = document.getElementById(collectiontype);
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
                collection.appendChild(card);
            });
        })
        .catch(error => console.error(`Error loading collection: ${jsonFile}`, error));
}

loadCollection('../data-builder/type-collections.json', 'type');
loadCollection('../data-builder/theme-collections.json', 'theme');
loadCollection('../data-builder/color-collections.json', 'color');
loadCollection('../data-builder/misc-collections.json', 'misc');