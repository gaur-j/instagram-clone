export async function uploadToCloudinary(file) {
  // 1️⃣ Get signed params from our API
  const signRes = await fetch("/api/cloudinary-sign");
  const { cloudName, apiKey, timestamp, folder, signature } =
    await signRes.json();

  // 2️⃣ Upload directly to Cloudinary
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("folder", folder);
  formData.append("signature", signature);

  const uploadRes = await fetch(url, { method: "POST", body: formData });
  const data = await uploadRes.json();

  if (!uploadRes.ok) throw new Error(data.error?.message || "Upload failed");
  return data;
}
