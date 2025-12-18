#!/bin/bash
# Script to create placeholder SVG icons
# These are simple placeholders - replace with proper icons for production

for size in 16 48 128; do
  cat > "icon${size}.svg" << SVGEOF
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000" rx="4"/>
  <text x="50%" y="50%" font-family="Arial" font-size="$((size/2))" fill="#ffffff" text-anchor="middle" dy=".3em">N</text>
</svg>
SVGEOF
done

echo "Placeholder SVG icons created. Convert to PNG for production use."
