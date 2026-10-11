export function getSafeRedirectPath(path, fallback = "/") {
  if (
    typeof path !== "string" ||
    !path.startsWith("/") ||
    path.startsWith("//")
  ) {
    return fallback;
  }

  try {
    const baseUrl = "https://bazardor.local";
    const target = new URL(path, baseUrl);

    if (target.origin !== baseUrl) {
      return fallback;
    }

    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return fallback;
  }
}

export function getUserDisplayName(user, fallback = "ব্যবহারকারী") {
  return user?.name?.trim() || user?.email?.trim() || fallback;
}

export function getUserInitials(user, fallback = "👤") {
  const displayName = getUserDisplayName(user, "").trim();

  if (!displayName) {
    return fallback;
  }

  const words = displayName.split(/\s+/).filter(Boolean);
  const firstGrapheme = (word) => {
    if (typeof Intl.Segmenter === "function") {
      return new Intl.Segmenter("bn", { granularity: "grapheme" })
        .segment(word)[Symbol.iterator]()
        .next().value?.segment;
    }

    return Array.from(word)[0];
  };

  return words.slice(0, 2).map(firstGrapheme).join("");
}
