# Rolling Scroll Demo

A premium dark single-page demo of a **rolling / tumbling scroll transition**. Full-viewport panels sit on a 3D cylinder and rotate with `perspective` + `rotateX` as you scroll — wheel, trackpad, or touch.

Inspired by [60fps](https://x.com/60fpsdesign/status/2098475619751452859) (“Rolling scroll transition”) crediting [@joshpuckett](https://x.com/joshpuckett).

## Run locally

```bash
npm i
npm run dev
```

Open [http://127.0.0.1:43173](http://127.0.0.1:43173).

## Production build

```bash
npm run build
```

Static files land in `dist/` — the output Cloudflare Pages should publish.

Preview the build:

```bash
npm run preview
```

## Cloudflare Pages

`wrangler.toml` sets `pages_build_output_dir = "./dist"`.

Suggested Pages settings:

- **Build command:** `npm run build`
- **Build output directory:** `dist`

No auth, backend, or API keys.

## How the motion works

Document scroll is the only input. A fixed stage applies CSS 3D perspective; each panel is a face of a cylinder (`rotateX` + `translateZ`). Nearby faces stay in the compositor. A short lerp keeps the roll snappy at 60fps. `scroll-snap` settles on a face after you lift. `prefers-reduced-motion` crossfades instead of tumbling.
