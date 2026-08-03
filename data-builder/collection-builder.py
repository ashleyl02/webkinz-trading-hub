import requests
import json
from bs4 import BeautifulSoup
from pathlib import Path

url = "https://webkinzguide.com/wiki/Item_Collections"
headers = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) "
        "Gecko/20100101 Firefox/140.0"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}

page = requests.get(url, headers=headers)
output = Path("../data/collections")
output.mkdir(parents=True, exist_ok=True)
soup = BeautifulSoup(page.text, "html.parser")

tables = soup.find_all("table")

collections_names = ["type", "theme", "color", "misc"]
collections = []

count = 0

for table in tables:
    for cell in table.find_all("td"):
        img = cell.find("img")
        links = cell.find_all("a")

        if not img or not links:
            continue

        title = links[-1].text.strip()
        image_url = "https:" + img["src"]
        page_url = "https://webkinzguide.com" + links[-1]["href"]

        collection_id = (
            title.lower().replace("&", "and").replace(" ", "-")
        )

        collections.append({
            "id": collection_id,
            "title": title,
            "image_url": image_url,
            "page_url": page_url
        })
    output_file = output / f"{collections_names[count]}-collections.json"

    with open(output_file, "w") as final:
        json.dump(collections, final, indent=4)
    collections = []
    count += 1