export async function uploadToCloudinary(file) {
  const sigRes = await fetch("/api/cloudinary-sign");

  if (!sigRes.ok) {
    const err = await sigRes.text();
    throw new Error("Failed to get signature: " + err);
  }

  const {
    cloudName,
    timestamp,
    apiKey,
    folder: cloudFolder,
    signature,
  } = await sigRes.json();

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  const form = new FormData();

  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("signature", signature);
  form.append("folder", cloudFolder);

  const uploadRes = await fetch(url, {
    method: "POST",
    body: form,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    throw new Error("Cloudinary upload failed: " + err);
  }

  const data = await uploadRes.json();
  console.log("Cloudinary upload result:", data); // ✅ helpful for debugging
  return data;
}
