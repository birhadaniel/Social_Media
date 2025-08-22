export async function fetchPosts(limit = 10) {
  const res = await fetch(`/api/posts?limit=${limit}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}
