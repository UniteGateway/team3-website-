#!/usr/bin/env python3
"""Builds the captioned video reels (desktop 16:9 + mobile 9:16) from Mixkit stock clips.

Usage: python3 build/reels.py <source-clip-folder>
Source clips are Mixkit free stock videos saved as hd-<id>.mp4 (720p). Output goes to
assets/video/ plus build/reels.json (caption timings read by build.py).
Every scene lasts T seconds with an X-second blend into the next, so scene i starts at i*(T-X).
"""
import json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T, X = 3.8, 0.8           # scene length, cross-dissolve length

# reel -> list of (clip id, start second, mobile crop centre 0..1, title, subtitle)
REELS = {
    'values': [
        ('23006', 1, .40, 'Strategy', 'Every engagement starts with a plan'),
        ('921', 1, .45, 'Creative edge', 'Ideas that stand out'),
        ('101536', 2, .62, 'Vision', 'Seeing what’s next'),
        ('101547', 1, .55, 'Dedication', 'Focused on your outcomes'),
        ('2378', 2, .50, 'Quality', 'Precision in every detail'),
        ('23006', 22, .45, 'Teamwork', 'One team. One partner.'),
    ],
    'services': [
        ('921', 2, .45, 'Branding', 'Strategy, identity & campaigns'),
        ('101547', 4, .55, 'Technology', 'Software, apps & cloud'),
        ('47051', 1, .50, 'Artificial Intelligence', 'AI agents & automation'),
        ('41278', 1, .40, 'Digital Marketing', 'SEO, performance & social'),
        ('23006', 12, .40, 'Consulting', 'Strategy to execution'),
        ('46353', 2, .50, 'Media & Film', 'Corporate films & content'),
    ],
}


def run(cmd):
    subprocess.run(cmd, check=True)


def build(name, scenes, src):
    n = len(scenes)
    for mode in ('d', 'm'):
        args, filt = ['ffmpeg', '-loglevel', 'error', '-y'], []
        for k, (cid, start, cx, *_ ) in enumerate(scenes):
            args += ['-ss', str(start), '-t', str(T), '-i', os.path.join(src, f'hd-{cid}.mp4')]
            if mode == 'd':
                filt.append(f'[{k}]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=25,format=yuv420p,setsar=1[s{k}]')
            else:
                filt.append(f'[{k}]crop=ih*0.5625:ih:(iw-ih*0.5625)*{cx}:0,scale=540:960,fps=24,format=yuv420p,setsar=1[s{k}]')
        prev = 's0'
        for k in range(1, n):
            out = 'v' if k == n - 1 else f'a{k}'
            filt.append(f'[{prev}][s{k}]xfade=transition=fade:duration={X}:offset={k * (T - X):.2f}[{out}]')
            prev = out
        crf = '30' if mode == 'd' else '31'
        out = os.path.join(ROOT, 'assets', 'video', f'reel-{name}{"" if mode == "d" else "-m"}.mp4')
        run(args + ['-filter_complex', ';'.join(filt), '-map', '[v]', '-an', '-c:v', 'libx264', '-profile:v', 'main',
                    '-preset', 'slow', '-crf', crf, '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out])
    poster = os.path.join(ROOT, 'assets', 'video', f'reel-{name}-poster.jpg')
    run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', '1.2', '-i', os.path.join(ROOT, 'assets', 'video', f'reel-{name}.mp4'),
         '-frames:v', '1', '-q:v', '5', poster])
    return [{'t': round(k * (T - X), 2), 'title': s[3], 'sub': s[4]} for k, s in enumerate(scenes)], round(n * (T - X) + X, 2)


PRODUCT_REEL = [('collabiz', 'COLLABIZ', 'Business collaboration platform'), ('bizo', 'BIZO', 'AI-powered business intelligence'),
                ('solbid', 'SOLBID', 'Solar bidding marketplace'), ('leaddna', 'LeadDNA', 'Lead intelligence'),
                ('prizo', 'PRIZO', 'Buyer-side AI deal assistant'), ('sungate', 'SUNGATE', 'Community solar energy'),
                ('hnw', 'HNW', 'Health & wealth membership'), ('adbuz', 'ADBUZ', 'Creator & advertising marketplace'),
                ('unite-exim', 'UNITE EXIM', 'Global trade platform'), ('beyou', 'BEYOU', 'Inclusive community')]


def build_products():
    """Product home-page images: slow zoom (Ken Burns) per scene, dissolving into the next."""
    import tempfile
    from PIL import Image
    tmp = tempfile.mkdtemp()
    n, fr = len(PRODUCT_REEL), 25
    for mode in ('d', 'm'):
        W, H = (1280, 720) if mode == 'd' else (540, 960)
        args, filt = ['ffmpeg', '-loglevel', 'error', '-y'], []
        for k, (slug, *_ ) in enumerate(PRODUCT_REEL):
            im = Image.open(os.path.join(ROOT, 'assets', 'img', 'products', f'{slug}.webp')).convert('RGB')
            if mode == 'm':  # fit the landscape screen into a portrait frame over a blurred copy
                from PIL import ImageFilter
                bg = im.resize((W * 2, H * 2)).filter(ImageFilter.GaussianBlur(40)).point(lambda v: v * 0.45)
                fg = im.copy(); fg.thumbnail((W * 2 - 60, H * 2))
                bg.paste(fg, ((W * 2 - fg.width) // 2, int(H * 2 * 0.40) - fg.height // 2)); im = bg
            else:
                im = im.resize((W * 2, int(W * 2 * im.height / im.width)))
            f = os.path.join(tmp, f'{mode}{k}.png'); im.save(f)
            frames = int(T * fr)
            args += ['-loop', '1', '-t', str(T), '-i', f]
            filt.append(f'[{k}]scale={W * 2}:-2,zoompan=z=\'1+0.06*on/{frames}\':x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':d={frames}:s={W}x{H}:fps={fr},format=yuv420p,setsar=1[s{k}]')
        prev = 's0'
        for k in range(1, n):
            out = 'v' if k == n - 1 else f'a{k}'
            filt.append(f'[{prev}][s{k}]xfade=transition=fade:duration={X}:offset={k * (T - X):.2f}[{out}]')
            prev = out
        out = os.path.join(ROOT, 'assets', 'video', f'reel-products{"" if mode == "d" else "-m"}.mp4')
        run(args + ['-filter_complex', ';'.join(filt), '-map', '[v]', '-an', '-c:v', 'libx264', '-profile:v', 'main', '-preset', 'slow',
                    '-crf', '36', '-tune', 'stillimage', '-r', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out])
    run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', '1.2', '-i', os.path.join(ROOT, 'assets', 'video', 'reel-products.mp4'),
         '-frames:v', '1', '-q:v', '5', os.path.join(ROOT, 'assets', 'video', 'reel-products-poster.jpg')])
    return [{'t': round(k * (T - X), 2), 'title': t, 'sub': sub, 'href': f'product-{slug}.html'} for k, (slug, t, sub) in enumerate(PRODUCT_REEL)], round(n * (T - X) + X, 2)


if __name__ == '__main__':
    src = sys.argv[1]
    data = {}
    only = sys.argv[2:]  # optional: names of reels to rebuild
    if os.path.exists(os.path.join(ROOT, 'build', 'reels.json')):
        data = json.load(open(os.path.join(ROOT, 'build', 'reels.json')))
    for name, scenes in REELS.items():
        if only and name not in only:
            continue
        caps, dur = build(name, scenes, src)
        data[name] = {'captions': caps, 'duration': dur, 'clips': sorted({s[0] for s in scenes})}
        print('built', name, dur, 's')
    if not only or 'products' in only:
        caps, dur = build_products()
        data['products'] = {'captions': caps, 'duration': dur, 'clips': []}
        print('built products', dur, 's')
    json.dump(data, open(os.path.join(ROOT, 'build', 'reels.json'), 'w'), indent=1)
