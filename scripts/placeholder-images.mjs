import sharp from 'sharp';

/** One-off: dark gradient stand-ins for images pending generation. */
const gradient = (w, h, from, to) =>
  Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/></svg>`
  );

const jobs = [
  ['src/assets/cars/int-dark.jpg', '#101014', '#050506'],
  ['src/assets/cars/int-tan.jpg', '#131318', '#08080a'],
  ['src/assets/cars/detail-wheel.jpg', '#0e0e12', '#060607'],
];

for (const [out, from, to] of jobs) {
  await sharp(gradient(1376, 768, from, to)).jpeg({ quality: 70 }).toFile(out);
  console.log('stand-in:', out);
}
