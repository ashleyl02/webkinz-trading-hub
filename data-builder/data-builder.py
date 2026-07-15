import requests
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

page = requests.get(url, headers=headers, timeout=30)
soup = BeautifulSoup(page.text, "html.parser")

tables = soup.find_all("table")