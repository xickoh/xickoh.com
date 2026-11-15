#!/usr/bin/env python3
"""Compõe o banner do site (640x240) com a arte real do Pixel Fantasy.

Monta uma vila ao anoitecer com os sprites do jogo (casas, taberna, torre do
mago, árvores, bancas, fogueira, personagens) e aplica a luz da noite com os
focos quentes da fogueira e das janelas. Também desenha o favicon.

Precisa do Pillow e da pasta de assets do jogo:
    python3 tools/make_banner.py [caminho/para/pixel_fantasy/assets]
"""
import math
import random
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ASSETS = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT.parent / "pixel_fantasy" / "assets"
W, H = 640, 240
rnd = random.Random(1996)


def load(rel):
    return Image.open(ASSETS / rel).convert("RGBA")


def frame(rel, size, index=0, flip=False):
    im = load(rel).crop((index * size, 0, (index + 1) * size, size))
    return im.transpose(Image.FLIP_LEFT_RIGHT) if flip else im


def trimmed(im):
    return im.crop(im.getbbox())


# --- chão ---------------------------------------------------------------------
def ground():
    tiles = load("tilesets/ground_autotiles.png")
    tile = lambda row: tiles.crop((240, row * 16, 256, row * 16 + 16))
    cobble, light, dark = tile(0), tile(2), tile(3)
    img = Image.new("RGBA", (W, H))
    for ty in range(0, H, 16):
        for tx in range(0, W, 16):
            img.paste(dark, (tx, ty))

    # manchas de relva clara e a praça de calçada, com orla recortada em blocos de 4 px
    def blobs(n, rmin, rmax):
        return [(rnd.randrange(W), rnd.randrange(H), rnd.randint(rmin, rmax)) for _ in range(n)]

    grass_blobs = blobs(26, 22, 60)

    def in_grass(x, y):
        return any((x - bx) ** 2 + ((y - by) * 1.6) ** 2 < r * r for bx, by, r in grass_blobs)

    def in_plaza(x, y):
        wob = 6 * math.sin(x * 0.045) + 4 * math.sin(y * 0.11 + x * 0.02)
        if ((x - 318) / 205) ** 2 + ((y - 196 - wob) / 34) ** 2 < 1:
            return True
        return abs(x - 318 - 10 * math.sin(y * 0.05)) < 26 and y > 196   # caminho para sul

    lpx, cpx, px = light.load(), cobble.load(), img.load()
    for y in range(H):
        for x in range(W):
            qx, qy = x // 4 * 4 + 2, y // 4 * 4 + 2
            if in_plaza(qx, qy):
                px[x, y] = cpx[x % 16, y % 16]
            elif in_grass(qx, qy):
                px[x, y] = lpx[x % 16, y % 16]
    return img, in_plaza


# --- luz da noite ---------------------------------------------------------------
def night(img, lights):
    """Escurece para azul-noite e devolve a cor quente à volta de cada luz (em degraus)."""
    out = Image.new("RGBA", img.size)
    src, dst = img.load(), out.load()
    for y in range(H):
        for x in range(W):
            r, g, b, a = src[x, y]
            lit = 0.0
            for lx, ly, rad, power in lights:
                d = math.hypot(x - lx, (y - ly) * 1.25) / rad
                if d < 1:
                    lit = max(lit, power * (1 - d) ** 1.3)
            lit = min(1.0, math.floor(lit * 7) / 6)                 # degraus, sem gradiente liso
            nr, ng, nb = r * 0.34 + 6, g * 0.36 + 8, b * 0.62 + 30   # noite
            wr, wg, wb = min(255, r * 1.08 + 14), g * 1.0, b * 0.8   # luz quente
            dst[x, y] = (int(nr + (wr - nr) * lit), int(ng + (wg - ng) * lit),
                         int(nb + (wb - nb) * lit), a)
    return out


def banner():
    img, in_plaza = ground()
    things = []                                   # (base_y, x, sprite) → desenhados de trás para a frente

    def put(sprite, x, base):
        things.append((base, x, sprite))

    # floresta ao fundo e a enquadrar os lados
    trees = ["fir_olive", "oak_big_green", "pine_big_teal", "oak_small_green", "pine_green",
             "oak_big_autumn", "oak_small_orange", "oak_big_yellow", "pine_green_alt"]
    for x in range(-20, W, 34):
        t = load(f"environment/trees/{rnd.choice(trees)}.png")
        put(t, x + rnd.randint(-8, 8), rnd.randint(44, 84))
    for x, base, name in [(-14, 236, "oak_small_autumn"), (36, 150, "pine_big_teal"),
                          (598, 240, "oak_small_green"),
                          (-6, 196, "oak_big_green")]:
        put(load(f"environment/trees/{name}.png"), x, base)

    # vila
    put(load("environment/buildings/tavern_ai.png"), 44, 156)
    put(load("environment/buildings/wizard_tower_ai.png"), 262, 138)
    put(load("environment/buildings/house_green_timber_small.png"), 346, 150)
    put(load("environment/buildings/blacksmith_ai.png"), 520, 152)
    put(load("environment/buildings/stall_baker_ai.png"), 150, 232)
    put(load("environment/buildings/stall_greengrocer_ai.png"), 430, 236)
    put(load("environment/plaza/well_ai.png"), 500, 206)
    put(load("environment/props/notice_board/notice_board_ai.png"), 226, 192)
    put(load("environment/camp/barrel.png"), 248, 160)
    put(load("environment/camp/bench.png"), 356, 226)

    # fogueira no centro da praça
    fx, fy = 318, 200
    put(frame("environment/props/bonfire.png", 32, 1), fx - 16, fy)
    fire = load("environment/props/fire.png").crop((32, 0, 64, 48))
    put(fire, fx - 16, fy - 6)

    # gente à volta do lume
    put(trimmed(frame("characters/npcs/rogue/idle.png", 32, 0)), fx - 46, fy + 6)
    put(trimmed(frame("characters/npcs/knight/idle.png", 32, 0, flip=True)), fx + 26, fy + 2)
    put(trimmed(frame("characters/npcs/wizard/idle.png", 32, 1)), 262, 172)
    put(trimmed(frame("characters/npcs/peasant/idle.png", 64, 0)), 196, 218)
    put(trimmed(frame("characters/npcs/barmaid/idle.png", 64, 0, flip=True)), 120, 170)

    # flores e arbustos fora da calçada
    for _ in range(46):
        x, y = rnd.randrange(8, W - 24), rnd.randrange(150, H)
        if in_plaza(x + 8, y) or in_plaza(x + 8, y - 10):
            continue
        if rnd.random() < 0.75:
            put(load(f"environment/plaza/flowers_{rnd.randrange(8)}.png"), x, y)
        else:
            put(load(f"environment/bushes/bush_{rnd.choice(['green', 'lime'])}.png"), x, y)

    for base, x, sprite in sorted(things, key=lambda t: t[0]):
        img.alpha_composite(sprite, (x, base - sprite.height)) if 0 <= x and x + sprite.width <= W \
            and base - sprite.height >= 0 and base <= H else paste_clipped(img, sprite, x, base - sprite.height)

    lights = [
        (fx, fy - 8, 120, 1.0),                        # fogueira
        (130, 120, 70, 0.75), (92, 136, 46, 0.6), (176, 136, 46, 0.6),   # taberna
        (598, 132, 58, 0.85),                          # forja
        (294, 84, 22, 0.5),                            # torre
        (428, 132, 30, 0.45),                          # janela da casa
    ]
    return night(img, lights)


def paste_clipped(img, sprite, x, y):
    layer = Image.new("RGBA", img.size)
    layer.paste(sprite, (x, y))
    img.alpha_composite(layer)


def favicon():
    """A cabeça do herói do jogo, 16x16."""
    hero = trimmed(frame("characters/npcs/knight/idle.png", 32, 0))
    side = min(hero.width, 16)
    head = hero.crop(((hero.width - side) // 2, 0, (hero.width - side) // 2 + side, side))
    out = Image.new("RGBA", (16, 16))
    out.alpha_composite(head, ((16 - side) // 2, 0))
    return out


if __name__ == "__main__":
    banner().convert("RGB").save(ROOT / "src" / "assets" / "banner.png", optimize=True)
    favicon().save(ROOT / "public" / "favicon.png")
    print("ok")
