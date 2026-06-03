#!/usr/bin/env python3
"""Convertir imágenes JPG a WebP manteniendo la calidad."""

import os
from pathlib import Path
from PIL import Image

def convert_images_to_webp():
    source_dir = Path("public/images/rural")
    dest_dir = Path("public/images/animacion")
    
    # Crear directorio destino si no existe
    dest_dir.mkdir(parents=True, exist_ok=True)
    
    # Obtener todas las imágenes JPG
    jpg_files = list(source_dir.glob("*.jpg")) + list(source_dir.glob("*.jpeg"))
    
    if not jpg_files:
        print("No se encontraron imágenes JPG")
        return
    
    converted = 0
    failed = 0
    
    print(f"Iniciando conversión de {len(jpg_files)} imágenes...")
    print("-" * 50)
    
    for jpg_file in jpg_files:
        try:
            # Abrir imagen
            img = Image.open(jpg_file)
            
            # Crear nombre archivo de salida
            output_file = dest_dir / jpg_file.stem.replace(".", "_") 
            output_file = output_file.with_suffix(".webp")
            
            # Convertir a WebP con calidad 90 (muy alta, sin cambios perceptibles)
            img.save(output_file, "WEBP", quality=90)
            
            converted += 1
            print(f"✓ Convertido: {jpg_file.name} → {output_file.name}")
            
        except Exception as e:
            failed += 1
            print(f"✗ Error en {jpg_file.name}: {str(e)}")
    
    print("-" * 50)
    print(f"\n=== Conversión completada ===")
    print(f"Total: {len(jpg_files)} imágenes")
    print(f"Exitosas: {converted}")
    print(f"Fallidas: {failed}")

if __name__ == "__main__":
    convert_images_to_webp()
