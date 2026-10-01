/// <reference types="@webgpu/types" />
import { useEffect, useRef } from "react";

// WebGPU liquid glass for the navbar.
//
// A shader can't read the DOM behind it, so it refracts the page's real background images instead:
// the paper texture (body background, fixed + cover) and any hero <img data-glass-backdrop> under
// the bar, mapped to the exact pixels the browser shows (object-fit: cover + object-position).
// The middle stays transparent so the CSS backdrop blur keeps showing live content scrolling under
// the bar; the shader draws the curved rim: refraction, chromatic dispersion, fresnel and specular.

const PAPER = "/assets/images/paper.jpg";

const SHADER = /* wgsl */ `
struct U {
  canvas: vec2f, nav: vec2f, navPos: vec2f, viewport: vec2f, pointer: vec2f,
  time: f32, radius: f32,
  heroRect: vec4f,   // viewport px of the hero <img> box (z = 0: none)
  heroUV: vec4f,     // uv = (p - heroRect.xy) * xy + zw, i.e. object-fit: cover
  paperUV: vec4f,    // uv = p * xy + zw (body background, fixed + cover)
  tint: vec4f,       // rgb + strength
  heroDim: f32, light: f32, dpr: f32, _pad: f32,
};
@group(0) @binding(0) var<uniform> u: U;
@group(0) @binding(1) var smp: sampler;
@group(0) @binding(2) var paper: texture_2d<f32>;
@group(0) @binding(3) var hero: texture_2d<f32>;

@vertex fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
  let p = vec2f(f32((i << 1u) & 2u), f32(i & 2u));
  return vec4f(p * 2.0 - 1.0, 0.0, 1.0);
}

fn box(q: vec2f, h: vec2f, r: f32) -> f32 {
  let d = abs(q) - h + r;
  return length(max(d, vec2f(0.0))) + min(max(d.x, d.y), 0.0) - r;
}

// What the browser paints at viewport point p (before our glass).
fn backdrop(p: vec2f) -> vec3f {
  var c = textureSampleLevel(paper, smp, p * u.paperUV.xy + u.paperUV.zw, 0.0).rgb;
  let hp = p - u.heroRect.xy;
  if (u.heroRect.z > 0.0 && all(hp >= vec2f(0.0)) && all(hp <= u.heroRect.zw)) {
    let h = textureSampleLevel(hero, smp, hp * u.heroUV.xy + u.heroUV.zw, 0.0);
    c = mix(c, h.rgb * (1.0 - u.heroDim), h.a);
  }
  return c;
}

@fragment fn fs(@builtin(position) fc: vec4f) -> @location(0) vec4f {
  let p = fc.xy / u.dpr;                       // css px inside the bar
  let h = u.nav * 0.5;
  let q = p - h;
  let r = min(u.radius, min(h.x, h.y));
  let d = box(q, h, r);                        // < 0 inside
  let cover = clamp(0.5 - d, 0.0, 1.0);        // antialiased edge
  if (cover <= 0.0) { return vec4f(0.0); }

  // Glass profile: a rounded bevel, steep at the rim and flat in the middle.
  let bezel = min(24.0, min(h.x, h.y) * 0.75);
  let t = clamp(-d / bezel, 0.0, 1.0);         // 0 at the rim -> 1 on the flat top
  let s = 1.0 - t;
  let slope = s * s * (3.0 - 2.0 * s);
  let e = 0.75;
  let n = normalize(vec2f(box(q + vec2f(e, 0.0), h, r) - box(q - vec2f(e, 0.0), h, r),
                          box(q + vec2f(0.0, e), h, r) - box(q - vec2f(0.0, e), h, r)) + 1e-5);

  // Light bends inward through the bevel; a slow ripple makes it liquid.
  let ripple = sin(p.x * 0.05 + u.time * 1.1) * cos(p.y * 0.11 - u.time * 0.8);
  let bend = -n * slope * 30.0 + vec2f(ripple, ripple * 0.5) * (0.6 + 2.0 * slope);
  let vp = u.navPos + p;

  // Frosted, dispersed sample: red bends least, blue most.
  let blur = mix(2.0, 9.0, t);
  var taps = array<vec2f, 8>(
    vec2f(0.0, 0.0), vec2f(0.53, 0.32), vec2f(-0.44, 0.61), vec2f(-0.71, -0.29),
    vec2f(0.19, -0.83), vec2f(0.88, -0.27), vec2f(-0.12, 0.95), vec2f(-0.95, 0.18));
  var col = vec3f(0.0);
  for (var i = 0; i < 8; i++) {
    let o = taps[i] * blur;
    col.r += backdrop(vp + bend * 0.92 + o).r;
    col.g += backdrop(vp + bend * 1.00 + o).g;
    col.b += backdrop(vp + bend * 1.10 + o).b;
  }
  col = mix(col / 8.0, u.tint.rgb, u.tint.a);

  // Lighting: fresnel rim lit from the top-left, a dimmer bounce bottom-right, and a soft spot
  // that follows the pointer along the surface.
  let L = normalize(vec2f(-0.55, -0.85));
  let fres = pow(s, 3.5);
  let rimLit = fres * (0.25 + 0.75 * max(dot(n, L), 0.0)) + fres * 0.35 * max(dot(n, -L), 0.0);
  let pd = length(p - u.pointer);
  let spot = exp(-pd * pd / 9000.0) * 0.16 + fres * exp(-pd * pd / 30000.0) * 0.55;
  let shade = smoothstep(0.0, 1.0, s) * max(dot(n, vec2f(0.0, 1.0)), 0.0) * 0.18;

  // Bevel shows the refraction; the flat middle stays clear for the CSS blur of live content.
  let a = (1.0 - smoothstep(0.15, 0.95, t)) * 0.9;
  let glow = rimLit * mix(0.75, 0.55, u.light) + spot;
  let rgb = col * a * (1.0 - shade) + vec3f(glow);
  return vec4f(rgb, clamp(a + glow, 0.0, 1.0)) * cover;
}
`;

type Tex = { texture: GPUTexture; width: number; height: number };

const loadTexture = async (device: GPUDevice, url: string): Promise<Tex> => {
  const bitmap = await createImageBitmap(await (await fetch(url)).blob());
  const texture = device.createTexture({
    size: [bitmap.width, bitmap.height],
    format: "rgba8unorm",
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
  });
  device.queue.copyExternalImageToTexture({ source: bitmap }, { texture }, [bitmap.width, bitmap.height]);
  return { texture, width: bitmap.width, height: bitmap.height };
};

// object-fit: cover as a uv transform: uv = (p - boxOrigin) * scale + offset.
const coverUV = (boxW: number, boxH: number, imgW: number, imgH: number, posX: number, posY: number) => {
  const k = Math.max(boxW / imgW, boxH / imgH);
  const w = imgW * k, h = imgH * k;
  return [1 / w, 1 / h, -((boxW - w) * posX) / w, -((boxH - h) * posY) / h];
};

const percent = (v: string) => (v.endsWith("%") ? parseFloat(v) / 100 : v === "right" || v === "bottom" ? 1 : v === "center" ? 0.5 : 0);

interface Props {
  // "light" = milky glass on paper pages, "dark" = smoky glass over the hero images.
  tone: "light" | "dark";
  // Told whether the shader is running, so the CSS-only glass can step aside.
  onActive?: (active: boolean) => void;
}

const LiquidGlass = ({ tone, onActive }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toneRef = useRef(tone);
  toneRef.current = tone;
  const onActiveRef = useRef(onActive);
  onActiveRef.current = onActive;

  useEffect(() => {
    const canvas = canvasRef.current;
    const nav = canvas?.parentElement;
    if (!canvas || !nav || !navigator.gpu) return;
    let stopped = false;
    let frame = 0;
    const cleanups: (() => void)[] = [];

    (async () => {
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter || stopped) return;
      const device = await adapter.requestDevice();
      if (stopped) return device.destroy();
      device.lost.then(info => {
        if (stopped) return;
        console.warn("Liquid glass: GPU device lost, using the CSS fallback:", info.message);
        stopped = true;
        onActiveRef.current?.(false);
      });
      device.addEventListener("uncapturederror", e => console.error("Liquid glass:", (e as GPUUncapturedErrorEvent).error.message));

      const context = canvas.getContext("webgpu")!;
      const format = navigator.gpu.getPreferredCanvasFormat();
      context.configure({ device, format, alphaMode: "premultiplied" });

      const module = device.createShaderModule({ code: SHADER });
      const pipeline = device.createRenderPipeline({
        layout: "auto",
        vertex: { module, entryPoint: "vs" },
        fragment: { module, entryPoint: "fs", targets: [{ format }] },
      });
      const uniforms = new Float32Array(32);
      const uniformBuffer = device.createBuffer({ size: uniforms.byteLength, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
      const sampler = device.createSampler({ magFilter: "linear", minFilter: "linear" });

      const paper = await loadTexture(device, PAPER);
      const empty = device.createTexture({ size: [1, 1], format: "rgba8unorm", usage: GPUTextureUsage.TEXTURE_BINDING });
      const heroes = new Map<string, Promise<Tex>>();
      let heroTex: Tex | null = null;
      let heroSrc = "";
      let bindGroup: GPUBindGroup | null = null;
      const bind = () => {
        bindGroup = device.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: uniformBuffer } },
            { binding: 1, resource: sampler },
            { binding: 2, resource: paper.texture.createView() },
            { binding: 3, resource: (heroTex?.texture ?? empty).createView() },
          ],
        });
      };
      bind();
      if (stopped) return;

      let pointer = [-1e5, -1e5];
      const onPointer = (e: PointerEvent) => {
        const box = nav.getBoundingClientRect();
        pointer = [e.clientX - box.left, e.clientY - box.top];
      };
      window.addEventListener("pointermove", onPointer, { passive: true });
      cleanups.push(() => window.removeEventListener("pointermove", onPointer));

      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const start = performance.now();
      onActiveRef.current?.(true);

      const draw = () => {
        if (stopped) return;
        frame = requestAnimationFrame(draw);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const box = nav.getBoundingClientRect();
        const w = Math.max(1, Math.round(box.width * dpr)), h = Math.max(1, Math.round(box.height * dpr));
        if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }

        // The hero image under the bar, if any.
        const img = [...document.querySelectorAll<HTMLImageElement>("img[data-glass-backdrop]")]
          .find(el => { const b = el.getBoundingClientRect(); return el.complete && b.bottom > box.top && b.top < box.bottom; });
        const src = img?.currentSrc || "";
        if (src !== heroSrc) {
          heroSrc = src;
          heroTex = null;
          bind();
          if (src) {
            if (!heroes.has(src)) heroes.set(src, loadTexture(device, src));
            heroes.get(src)!.then(tex => { if (heroSrc === src && !stopped) { heroTex = tex; bind(); } }).catch(() => {});
          }
        }
        let heroRect = [0, 0, 0, 0], heroUV = [0, 0, 0, 0], dim = 0;
        if (img && heroTex) {
          const b = img.getBoundingClientRect();
          const [px, py = "50%"] = getComputedStyle(img).objectPosition.split(" ");
          heroRect = [b.left, b.top, b.width, b.height];
          heroUV = coverUV(b.width, b.height, heroTex.width, heroTex.height, percent(px), percent(py));
          dim = parseFloat(img.dataset.glassDim || "0");
        }
        const vw = window.innerWidth, vh = window.innerHeight;
        const radius = parseFloat(getComputedStyle(nav).borderTopLeftRadius) || 0;
        const light = toneRef.current === "light";

        uniforms.set([
          w, h, box.width, box.height, box.left, box.top, vw, vh, pointer[0], pointer[1],
          still ? 0 : (performance.now() - start) / 1000, radius,
          ...heroRect, ...heroUV, ...coverUV(vw, vh, paper.width, paper.height, 0.5, 0.5),
          ...(light ? [1, 1, 1, 0.42] : [0.07, 0.09, 0.16, 0.38]),
          dim, light ? 1 : 0, dpr, 0,
        ]);
        device.queue.writeBuffer(uniformBuffer, 0, uniforms);

        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
          colorAttachments: [{ view: context.getCurrentTexture().createView(), loadOp: "clear", storeOp: "store", clearValue: [0, 0, 0, 0] }],
        });
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup!);
        pass.draw(3);
        pass.end();
        device.queue.submit([encoder.finish()]);
      };
      draw();
      cleanups.push(() => device.destroy());
    })().catch(error => {
      console.error("Liquid glass unavailable, using the CSS fallback:", error);
      onActiveRef.current?.(false);
    });

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      cleanups.forEach(fn => fn());
      onActiveRef.current?.(false);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full rounded-[inherit] pointer-events-none" />;
};

export default LiquidGlass;
