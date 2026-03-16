#!/bin/bash

RAW=./models_raw
OUT=./public/models

mkdir -p $OUT

echo "Converting models to GLB..."

for file in $RAW/*; do
  name=$(basename "$file")
  base="${name%.*}"

  echo "Processing $name"

  gltf-transform optimize \
  "$file" \
  "$OUT/$base.glb" \
  --compress draco \
  --texture-compress webp \
  --texture-size 1024 \
  --prune \
  --weld \
  --simplify 0.8

done

echo "Done."
