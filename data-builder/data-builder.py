import requests
import json
from bs4 import BeautifulSoup

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
soup = BeautifulSoup(page.text, "html.parser")

tables = soup.find_all("table")

collections = []

for table in tables:
    for cell in table.find_all("td"):
        img = cell.find("img")
        links = cell.find_all("a")

        if not img or not links:
            continue

        title = links[-1].text.strip()
        image_url = "http:" + img["src"]

        collections.append({
            "title": title,
            "image_url": image_url
        })

with open('item-collections.json', 'w') as final:
    json.dump(collections, final, indent=4)