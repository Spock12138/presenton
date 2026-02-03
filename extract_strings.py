
import os
import re

root_dir = r"servers/nextjs/presentation-templates"

strings_to_translate = set()

for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(".tsx"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                
                # Find layoutName
                matches = re.findall(r"export const layoutName = '([^']*)'", content)
                strings_to_translate.update(matches)
                
                # Find layoutDescription
                matches = re.findall(r"export const layoutDescription = '([^']*)'", content)
                strings_to_translate.update(matches)
                
                # Find default values
                matches = re.findall(r"\.default\('([^']*)'\)", content)
                strings_to_translate.update(matches)

                # Find titles/descriptions in schema meta
                matches = re.findall(r"title: '([^']*)'", content)
                strings_to_translate.update(matches)
                matches = re.findall(r"description: \"([^\"]*)\"", content)
                strings_to_translate.update(matches)

# Print all strings
for s in sorted(list(strings_to_translate)):
    print(s)
