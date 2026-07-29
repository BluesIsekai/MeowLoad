import requests
import re
import base64
import json

# Step 1: Fetch main page HTML from a user-provided link.
page_content = requests.get(input("Enter URL: ")).text

# Step 2: Extract the 'embed_code' from the page.
embed_code = re.search(r'<script src="https://example.com/(.*)/embed', page_content).group(1)

# Step 3: Set up headers with a referer for requests to bypass restrictions.
headers = {'referer': f'https://example.com/{embed_code}'}

# Step 4: Fetch embedded JavaScript code using the extracted embed_code.
embed_response = requests.get(f'https://example.com/{embed_code}/embed', headers=headers).text

# Step 5: Extract the encoded JSON data.
json_encoded_text = re.search(r'window\[\".*\"\]\=\"(.*)\"\;\(function\(', embed_response).group(1)
json_decoded_text = base64.b64decode(json_encoded_text.encode()).decode()

# Step 6: Parse JSON data to extract keys for further requests.
json_data = json.loads(json_decoded_text)
msgn = json_data['msgn']
playlist_url = json_data['playlist'] + '.m3u8'

# Step 7: Fetch the playlist data and decode it.
playlist_content = requests.get(f'https://example.com/{playlist_url}', headers=headers).text
decoded_playlist = base64.b64decode(playlist_content.encode()).decode()

# Step 8: Process the playlist content (remove parts of filenames).
prefix = decoded_playlist.split('-')[0]
processed_playlist = decoded_playlist.replace(f"{prefix}-", '')

# Print part of the decoded JavaScript (simulated for demo)
print("Decoded JS Example:", base64.b64decode(b'aGV4MmJ1Zj1mdW5jdGlvbihlKXtyZXR1cm4gbmV3IFVpbnQ4QXJyYXkoZS5tYXRjaCgvLnsyfS9nKS5tYXAoZnVuY3Rpb24oZSl7cmV0dXJuIHBhcnNlSW50KGUsMTYpfSkpfSxidWYyc3RyPWZ1bmN0aW9uKGUpe3JldHVybiBuZXcgVGV4dERlY29kZXIoInV0Zi04IikuZGVjb2RlKGUpfQ==').decode())

# Step 9: Optional: Manually input playlist URL, fetch, and decode.
playlist_url_manual = input("Enter playlist URL: ")
playlist_content_manual = requests.get(playlist_url_manual, headers=headers).content
decoded_playlist_manual = base64.b64decode(playlist_content_manual).decode()

# Further process for manual playlist
prefix_manual = decoded_playlist_manual.split('-')[0]
processed_playlist_manual = decoded_playlist_manual.replace(f"{prefix_manual}-", '')

# Step 10: Obtain and save the encryption key from the playlist.
playlist_filename = input("Enter playlist filename: ")
playlist_text = open(playlist_filename).read()
key_url = playlist_text.split('URI="')[1].split('",IV')[0]
with open('res/key.key', 'wb') as key_file:
    key_file.write(requests.get(key_url, headers=headers).content)

# Update playlist to use local key file
playlist_text = playlist_text.replace(key_url, 'res/key.key')

# Step 11: Download and save each .ts file locally
ts_files = re.findall(r'(/\d+.*)', playlist_text)
for i, ts in enumerate(ts_files):
    with open(f'res/{i}.ts', 'wb') as ts_file:
        ts_file.write(requests.get(f'https://example.com{ts}', headers=headers).content)
    playlist_text = playlist_text.replace(ts, f'res/{i}.ts')

# Step 12: Save the modified playlist to a file
with open('res/processed_playlist.m3u8', 'w') as final_playlist:
    final_playlist.write(playlist_text)
@BluesIsekai
Comment
