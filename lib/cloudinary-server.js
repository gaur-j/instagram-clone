import crypto from "crypto";

export const cloudinarySignature = ({ timestamp, folder }) => {
  const { CLOUDINARY_SECRET_KEY } = process.env;
  const toSign = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_SECRET_KEY}`;
  const signature = crypto.createHash("sha1").update(toSign).digest("hex");
  return signature;
};
