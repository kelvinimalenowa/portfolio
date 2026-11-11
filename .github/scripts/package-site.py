"""Package committed site paths with content-versioned CSS and JavaScript."""

import hashlib
import re
from pathlib import Path
import subprocess
import sys
from urllib.parse import unquote, urlsplit
import zipfile
from html.parser import HTMLParser

root = Path(__file__).resolve().parents[2]
output = Path(sys.argv[1]).resolve()
paths = subprocess.check_output(
    ["git", "ls-files", "-z", "--", "index.html", "assets", "images"],
    cwd=root,
).decode().split("\0")
files = {
    path: (root / path).read_bytes()
    for path in paths
    if path and Path(path).name != ".DS_Store"
}
html = files["index.html"].decode()
for asset in ("assets/css/portfolio.css", "assets/js/portfolio.js"):
    content = files.pop(asset)
    version = hashlib.sha256(content).hexdigest()[:12]
    path = Path(asset)
    versioned_path = str(path.with_name(f"{path.stem}.{version}{path.suffix}"))
    files[versioned_path] = content
    # Replace the full URL, including any local preview version query.
    html, count = re.subn(
        rf'(?<="){re.escape(asset)}(?:\?[^"]*)?(?=")',
        versioned_path,
        html,
    )
    if count != 1:
        raise ValueError(f"Expected one reference to {asset}, found {count}")


class AssetCheck(HTMLParser):
    def handle_starttag(self, tag, attributes):
        for name, value in attributes:
            if name not in ("src", "href") or not value:
                continue
            url = urlsplit(value)
            if url.scheme or url.netloc or not url.path:
                continue
            if unquote(url.path) not in files:
                raise ValueError(f"Missing deployment asset: {value}")


AssetCheck().feed(html)
files["index.html"] = html.encode()
with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as archive:
    for name, content in sorted(files.items()):
        archive.writestr(name, content)
print(f"Packaged {len(files)} files with versioned CSS and JavaScript.")
