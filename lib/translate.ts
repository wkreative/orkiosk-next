const API_URL = 'https://translation.googleapis.com/language/translate/v2'
const cache = new Map<string, string>()

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

export async function translateStrings(
  texts: string[],
  target: string,
  source: string = 'es',
): Promise<string[]> {
  if (target === source) {
    return texts
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
  if (!apiKey) {
    return texts
  }

  const results = new Array<string>(texts.length)
  const pending: Array<{ index: number; text: string }> = []

  texts.forEach((text, index) => {
    if (!text) {
      results[index] = text
      return
    }
    const key = `${target}:${text}`
    const cached = cache.get(key)
    if (cached) {
      results[index] = cached
    } else {
      pending.push({ index, text })
    }
  })

  if (pending.length === 0) {
    return results
  }

  const batches = chunk(pending, 100)
  for (const batch of batches) {
    const body = {
      q: batch.map((item) => item.text),
      target,
      source,
      format: 'text',
    }

    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      batch.forEach((item) => {
        results[item.index] = item.text
      })
      continue
    }

    const data = await response.json()
    const translations = data?.data?.translations ?? []
    translations.forEach((entry: { translatedText: string }, idx: number) => {
      const original = batch[idx]
      if (!original) {
        return
      }
      const translated = entry.translatedText || original.text
      cache.set(`${target}:${original.text}`, translated)
      results[original.index] = translated
    })
  }

  return results
}
