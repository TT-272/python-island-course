# Python 岛 · 像素美术生成提示词

参考图：Terraria 森林生物群系截图（Image 1 = 风格参考，不是编辑目标）
用法：每条提示词可独立使用；分层生成后再在引擎里叠加，效果比一次生成整张好。

---

## 通用否定项（所有提示词共用）

```
no anti-aliasing, no smooth gradients, no blur, no depth of field, no 3D render,
no photo texture, no vector shapes, no soft shadows, no glow,
no text, no letters, no numbers, no UI, no HUD, no watermark, no signature,
no consistent pixel-size drift, no mixed resolutions
```

---

## 1 · 主地图背景（横版全景）

**用途**：地图页底层。这是最重要的一条。
**输出意图**：可直接铺在 440×250 的逻辑画布上，上面再叠建筑与角色。

```
Side-scrolling 2D game background, 16-bit SNES-era pixel art, wide horizontal
landscape, four clearly separated depth layers. No UI, no text.

SKY: flat medium-blue, six hard-edged horizontal bands, lighter toward the horizon.
Three small flat white clouds, each with a one-pixel darker underside.

FAR LAYER: a massive grey-blue rocky cliff massif filling the upper-left and center.
Faceted rock planes in three or four desaturated grey-blue values, dark crevices
between planes, mossy dark-green patches clinging to ledges and the base. Heavy
atmospheric perspective: low contrast, blue-shifted, almost flat.

FAR-MID LAYER: a faint hazy ridge line of desaturated pale blue-green hills,
very low contrast, nearly lost in haze.

MID LAYER: a continuous dense wall of overlapping dark-green tree canopies forming
an unbroken hedge across the entire width. Each canopy is a rounded blob with a
darker green rim, mid-green body, and lighter green leaf-cluster highlights on the
upper-left. The blobs read as individual trees while merging into one solid mass.
Deliberate size variation: a few large, many medium, small ones filling gaps.

NEAR-MID LAYER: six tall slender trees in front of the hedge. Very tall thin trunks
with vertical bark striations, a darker left edge, lighter right edge, and small
branch stubs. Each trunk is topped by a single small rounded green canopy. The
rightmost tree is a pale pink blossom tree.

FOREGROUND: a bright saturated green grass layer with an irregular, bumpy,
hand-placed pixel silhouette. Small grass blades and tufts poke up along it.
Below the grass, dark brown soil grading vertically downward to near-black, with
subtle darker mottling and a few small embedded stones. A small blue pond with a
lighter blue highlight and a green grass rim sits in a shallow depression on the
left. One small violet flower near the pond. A few short green vines hang from the
soil edge.

SCALE: one tiny humanoid character sprite, about one-sixteenth of the image height,
standing on a small grassy ledge near the center.

STYLE: authentic limited-palette pixel art. Every pixel a hard square. Uniform pixel
size across the entire image. Render at a low logical resolution and upscale with
nearest-neighbor.
```

---

## 2 · 高大的树（单株素材）

**用途**：近景重复摆放，构成"人 : 树 ≈ 1 : 5"的体量差。
**输出**：需要**透明底**。

```
A single tall tree game sprite, 16-bit pixel art, on a fully transparent background.

Proportions in logical pixels: trunk about 6 px wide and 60 px tall; canopy about
24 px wide and 20 px tall.

TRUNK: medium brown, vertical bark striations, a darker left edge and a lighter
right edge, one or two short branch stubs.

CANOPY: one small rounded cluster built from overlapping leaf blobs — dark green
outer rim, mid-green body, lighter green highlights on the upper-left, darker
under-shadow at the bottom.

PALETTE: four greens, three browns. Nothing else.

CONSTRAINTS: hard square pixels, uniform pixel size, no anti-aliasing, no outline
glow, no cast shadow on the ground, no ground, no background scenery, no text.
```

---

## 3 · 树冠墙（中层森林带）

**用途**：制造纵深的关键一层。压暗之后，前面的建筑和标签才会"跳出来"。
**输出**：需要**透明底**（树冠线以上全透明）。

```
A seamless horizontal band of dense overlapping tree canopies, for the middle depth
layer of a 2D side-scrolling game. 16-bit pixel art, on a transparent background.

Rounded blobs of clearly varying size packed tightly so they merge into one
continuous hedge with no gaps to the sky. A few large blobs, more medium ones,
small ones filling the gaps. Each blob has a dark green outer rim, mid-green body,
and lighter green leaf-cluster highlights on the upper-left.

Desaturated and slightly blue-shifted, as if seen at middle distance — noticeably
less saturated than the foreground grass.

CONSTRAINTS: transparent above the canopy line. Left-to-right seamlessly tileable.
Hard square pixels, uniform pixel size, no anti-aliasing, no ground, no trunk,
no text, no UI.
```

---

## 4 · 岩壁（远景山体）

**用途**：填补远景，制造"世界很大"的感觉。

```
A large grey-blue cliff massif for the far background layer of a 2D side-scrolling
game, 16-bit pixel art, on a transparent background.

Faceted rock planes in three or four values of desaturated grey-blue. Dark crevices
between planes. Mossy dark-green patches clinging to ledges and the base. The
silhouette reads as a steep natural rock wall with a jagged top edge.

Heavy atmospheric perspective: low contrast, blue-shifted, deliberately flat and
washed out — it must sit far behind the trees.

CONSTRAINTS: hard square pixels, uniform pixel size, no anti-aliasing, no outline,
no text, no sky, no foreground ground.
```

---

## 5 · 主角（小尺寸精灵图）

**用途**：地图上的"你在这里"标记。
**输出**：需要**透明底**。

> ⚠️ 见下文「我的建议」——这张我建议仍然手绘，不要用 AI 生成。

```
A single small humanoid player character sprite for a 2D side-scrolling game,
16-bit pixel art, on a fully transparent background. Facing right, idle standing pose.

Proportions in logical pixels: total height about 22 px, width about 16 px.
Oversized head, very short body — chibi proportions. The head is roughly 40% of
the total height.

DETAILS: spiky auburn-brown hair with two visible points. Light peach face with two
dark single-pixel eyes. Rust-brown short-sleeved top. Bare peach arms. Dark
blue-grey trousers. Dark brown boots.

A one-pixel dark navy outline runs completely around the silhouette.

PALETTE: about ten colours total.

CONSTRAINTS: hard square pixels, uniform pixel size, no anti-aliasing, no ground
shadow, no background, no text, no extra characters, no weapons, no props.
```

---

## 6 · 草皮地表（横向 tile）

**用途**：地表带。要能和土层拼成连续地面。

```
A horizontal ground surface tileset band for a 2D side-scrolling game, 16-bit pixel
art, on a transparent background.

TOP EDGE: bright saturated green grass, two to three pixels thick, with an irregular
bumpy silhouette. Small grass blades and tufts poke up along it. A slightly lighter
highlight row along the very top.

BELOW: dark brown soil grading vertically downward to near-black. Subtle darker
mottling and a few small embedded stones.

Left-to-right seamlessly tileable.

CONSTRAINTS: hard square pixels, uniform pixel size, no anti-aliasing, no text,
no props, no trees, no rocks, no water.
```

---

# ⚠️ 我的建议：不要全部用 AI 生成

这一条比提示词本身重要。

**AI 生成的"像素画"不是真的像素画。**

它模仿的是像素画的**外观**，但输出的图里像素格子大小通常不一致 —— 有的地方 2px 一格，有的地方 3px 一格。对一张**背景板**来说这无所谓，因为它就是一张静态图，贴在后面。

但对**游戏精灵**（主角、建筑、图标）来说这是致命的：

| 需求 | AI 生成 | 手绘点阵 |
|---|---|---|
| 和 16px 网格对齐 | ✗ 做不到 | ✓ |
| 同一角色换表情/姿势 | ✗ 每次都变样 | ✓ 改几个字符 |
| 按状态改色（未解锁压暗） | ✗ 要重新生成 | ✓ 一行代码 |
| 做成动画 | ✗ | ✓ |
| 背景板的丰富度 | ✓ **强** | ✗ 手摆太慢 |

所以正确的分工是：

```
背景层（天空 / 远山 / 树冠墙 / 岩壁 / 地表带）  →  AI 生成，这里它最强
精灵层（主角 / 6 个区域地标 / 图标 / 徽章）      →  手绘点阵，必须网格精确
```

这样既拿到了 AI 的丰富度，又保住了交互元素的可控性。**我上一版的问题恰恰是背景层太薄，而不是精灵层差** —— 所以这次生成应该集中在提示词 1、3、4、6 上。

---

# 运行方式

本会话**没有挂载内置图像生成工具**，`OPENAI_API_KEY` 也未设置，所以我无法直接出图。两个选择：

1. **你拿这些提示词去任意图像工具跑**（Midjourney / GPT Image / 即梦 / 可画 等），把出图给我，我负责裁切、对齐、调色、合成进页面
2. **你设置好 `OPENAI_API_KEY` 之后我用 CLI 跑**（`skills/.system/imagegen/scripts/image_gen.py`，`uv` 已就位）。设置方法：在系统环境变量里加一个 `OPENAI_API_KEY`，值从 https://platform.openai.com/api-keys 取。**不要把 key 贴进对话里。**
