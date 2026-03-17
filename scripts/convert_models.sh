#!/bin/bash

RAW=./models_raw
OUT=./public/models

mkdir -p $OUT

echo "Optimizing GLB models..."

for file in $RAW/*.glb; do

  name=$(basename "$file")
  base="${name%.*}"

  echo "Processing $base"

  gltf-transform optimize \
  "$file" \
  "$OUT/$base.glb" \
  --compress draco \
  --texture-compress webp \
  --texture-size 1024 \
  --prune \
  --simplify 0.85

done

echo "Done."