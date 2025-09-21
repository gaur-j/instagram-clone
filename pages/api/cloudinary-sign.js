import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true,
});

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "instagram-clone";

  // ✅ Sign ONLY timestamp and folder
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_SECRET_KEY
  );

  res.status(200).json({
    cloudName: process.env.CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    folder,
    signature,
  });
}
