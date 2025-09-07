export default async function handler(req, res) {
  if (req.method !== "GET") {
    console.log("Invalid method:", req.method);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { CLOUDINARY_NAME, CLOUDINARY_API_KEY } = process.env;

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "instagram-clone";
    const crypto = await import("crypto");
    const signature = crypto
      .createHash("sha1")
      .update(
        `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_SECRET_KEY}`
      )
      .digest("hex");

    return res.status(200).json({
      cloudName: CLOUDINARY_NAME,
      apiKey: CLOUDINARY_API_KEY,
      timestamp,
      signature,
      folder,
    });
  } catch (error) {
    console.error("Cloudinary Sign Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
