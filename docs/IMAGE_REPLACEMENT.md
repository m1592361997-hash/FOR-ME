# Image Replacement Guide

Replace image files in place and keep the same paths. The captured JavaScript refers to these exact names.

## Project Cover Textures

- `project01.png` - Stamped
- `project02.png` - Fukuda
- `project03.png` - Reckn
- `project04.png` - A3 Design Inc.
- `project05.png` - Motion Blue
- `project06.png` - MEME Planning
- `project07.png` - Sake of Nada
- `project08.png` - Sougen
- `project09.png` - Utsubo
- `project10.png` - OEDO Food Hall
- `project11.png` - Kuma Hachimitsu
- `project12.png` - Avoidant
- `project13.png` - My Info

## Portfolio Images

Replace both the full image and its tiny blur placeholder where present:

- `portfolio/*.webp`
- `portfolio/tiny/*.webp`

If the replacement full image changes visual proportions, update the paired tiny image with the same composition so the loading blur matches.

## Other Visual Assets

- `texture.png`
- `planeTex.png`
- `resume.png`
- `laxspace-logo.svg`
- `Sandbox.webm`
- `duct_tape.glb`
- `fav/*`

Leave `_next/static/` unchanged unless you are intentionally changing application logic.

