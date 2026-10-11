# DC.dev: generación de las imágenes del avatar

Herramienta utilizada: ImageGen integrada. Las tres operaciones conservaron la referencia del usuario como identidad; los assets finales se recortaron, optimizaron y empaquetaron para el canvas. La base neutral y el atlas son imágenes raster, sin un modelo GLB.

## Retrato frontal

```text
Use case: identity-preserve. Asset: transparent hero cutout for David Cevallos's DC.dev portfolio. Use attached character reference sheet as identity/style authority. Generate ONE FRONT-FACING character portrait from top of hair to slightly below the waist, shoulders relaxed level and arms naturally by sides, hands outside crop. Match the exact young Ecuadorian man in reference: tan skin, dark brown eyes, short dark styled textured hair with fade, thick eyebrows, facial beauty marks, clean shaven, WHITE crewneck T-shirt, THIN gold chain, neck tattoo reading TALENT. Neutral friendly closed mouth. Premium hand sculpted 3D plasticine, matte clay, refined natural proportions, no toy exaggeration, no photographic skin.
Camera completely frontal, fixed orthographic portrait, centered straight spine, hair centered at x50% and y8%, eyes at y27%, waist at y92%, ample transparent margins 12% each side, portrait aspect ratio 896:1104. Exact identity, clothes and soft diffuse warm lighting of attached sheet. No background, no chair, no desk, no laptop, no labels or reference collage, no extra jewelry, no watermarks. TRUE TRANSPARENT RGBA. This will be the reference for a consistent pose atlas with only the head moving.
```

## 21 poses

```text
Create a production sprite ATLAS of the attached David clay avatar for a website cursor-following head. EXACT canvas 3150 x 1800 pixels. EXACT 7 columns x 3 rows of equally sized 450 x 600 cells. No gaps, no lines, no labels. TRUE transparent RGBA in ALL empty regions. Each cell contains one full copy of this SAME avatar from top of hair to below waist. Each figure has identical scale, same static torso, shoulders, arms, white shirt, thin gold chain, TALENT neck tattoo, warm studio lighting and centered body anchor. Waist baseline at 590 pixels of each cell; shoulders center at x225; top of hair ~25px, eyes ~145px. Preserve exact face identity, thick eyebrows, swept dark hair, tan skin and beauty marks of reference. Only the HEAD orientation changes, smoothly and subtly; torso absolutely frontal and fixed. Matte sculpted 3D plasticine consistent with attached reference. Calm neutral closed mouth throughout.
Columns left to right: face turned toward VIEWER'S LEFT 30 degrees, left20, left10, STRAIGHT CENTER0, right10, right20, right30. This is screen direction, not anatomical left. Every eye looks in the same direction as its head.
Row1: chin slightly raised and eyes looking UP (~12 degree pitch), all seven yaw angles.
Row2: neutral chin LEVEL pitch0, all seven yaw angles. Middle cell row2 column4 is exactly the attached neutral face.
Row3: chin slightly lowered and eyes looking DOWN (~12 degree pitch), all seven yaw angles.
The head pivot at neck stays in exactly the same location in all 21 cells. Do not rotate whole body, do not tilt whole image, no exaggerated yaw or side profiles. Align all 21 figures precisely for animation. Thin alpha contours, no shadows outside character. ONE atlas only, 21 consistent poses, NO captions, NO reference sheet text, no labels, no borders, no objects.
```

## Parpadeo

```text
Create TWO animation frames of the exact attached clay avatar, side by side on a TRUE transparent background. Exactly 2 columns by 1 row, equal portrait cells, no border no gap no labels. Identical face, identity, hair, facial moles, centered head, shirt, thin gold chain and neck tattoo TALENT, torso and lighting in both cells. Cell 1: eyes halfway closed during a natural blink. Cell 2: eyes completely closed during same blink. Neutral CLOSED MOUTH unchanged. ONLY eyelids change; everything else absolutely identical to attached portrait. Frame portrait aspect 237x316, combined canvas 948x632 or same exact 3:2 ratio. Keep full frontal chest up figure and entire head. No smile, no talking, no pose change, no text, no background, no watermark.
```
