import requests
import json
from bs4 import BeautifulSoup
from pathlib import Path

headers = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) "
        "Gecko/20100101 Firefox/140.0"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}

output = Path("../data/items")
output.mkdir(parents=True, exist_ok=True)

items = []

with open("../data/collections/type-collections.json", "r") as file: #starting with just one collection, will cover all four later
    collections = json.load(file)

for collection in collections:
    url = collection["page_url"]
    page = requests.get(url, headers=headers)
    soup = BeautifulSoup(page.text, "html.parser")
    tables = soup.find_all("table")
    table = tables[1]

    if table is None:
        print(f"Skipping {url}")
        continue

    for row in table.find_all("tr"):
        cells = row.find_all("td")

        if len(cells) != 3:
            continue

        img = cells[0].find("img")

        if not img:
            continue

        image_url = "https:" + img["src"]

        title = cells[0].get_text(strip=True)

        is_tradeable = cells[2].get_text(strip=True) == "Yes"

        items.append({
            "title": title,
            "image_url": image_url,
            "is_tradeable": is_tradeable
        })

    output_file = output / f"{collection['id']}-items.json"
    with open(output_file, "w") as final:
        json.dump(items, final, indent=4)
    items = []