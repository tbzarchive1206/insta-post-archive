const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listFolder(folderId, apiKey, { fetchImpl = fetch, sleep = wait } = {}) {
  const files = new Map();
  let pageToken = "";
  do {
    const params = new URLSearchParams({
      key: apiKey,
      q: `'${folderId}' in parents and trashed = false`,
      fields: "nextPageToken,incompleteSearch,files(id,name,mimeType,size,createdTime,modifiedTime)",
      pageSize: "1000",
      orderBy: "name",
    });
    if (pageToken) params.set("pageToken", pageToken);
    let data;
    for (let attempt = 0; attempt < 5; attempt++) {
      let response;
      try {
        response = await fetchImpl(`https://www.googleapis.com/drive/v3/files?${params}`, { signal: AbortSignal.timeout(60000) });
      } catch {
        if (attempt === 4) throw new Error(`Drive network failure for folder ${folderId}`);
        await sleep(1000 * 2 ** attempt);
        continue;
      }
      if (response.ok) {
        data = await response.json();
        if (data.incompleteSearch || !Array.isArray(data.files)) throw new Error(`Incomplete Drive listing for folder ${folderId}`);
        break;
      }
      const error = await response.json().catch(() => ({}));
      const reasons = error.error?.errors?.map((item) => item.reason) || [];
      const retryable = response.status === 429 || response.status >= 500 ||
        (response.status === 403 && reasons.some((reason) => /rateLimitExceeded|userRateLimitExceeded/iu.test(reason)));
      if (!retryable || attempt === 4) throw new Error(`Drive API ${response.status} for folder ${folderId}`);
      await sleep(1000 * 2 ** attempt);
    }
    for (const file of data.files) files.set(file.id, file);
    pageToken = data.nextPageToken || "";
  } while (pageToken);
  return [...files.values()];
}
