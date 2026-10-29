import { describe, expect, it } from 'vitest'
import { getSlidesEmbedUrl, getSlidesOpenUrl } from './slides'

describe('getSlidesEmbedUrl', () => {
  it('embeds a Drive file via its /preview URL', () => {
    expect(getSlidesEmbedUrl('https://drive.google.com/file/d/FILE123/view?usp=sharing')).toBe(
      'https://drive.google.com/file/d/FILE123/preview'
    )
  })

  it('extracts the id from legacy Drive open?id= links', () => {
    expect(getSlidesEmbedUrl('https://drive.google.com/open?id=FILE123&resourcekey=x')).toBe(
      'https://drive.google.com/file/d/FILE123/preview'
    )
  })

  it('extracts the id from Drive uc?export links', () => {
    expect(getSlidesEmbedUrl('https://drive.google.com/uc?export=download&id=FILE123')).toBe(
      'https://drive.google.com/file/d/FILE123/preview'
    )
  })

  it('embeds a published presentation using the /d/e/ id, not the literal "e"', () => {
    expect(
      getSlidesEmbedUrl('https://docs.google.com/presentation/d/e/2PACX-abc/pub?start=false')
    ).toBe(
      'https://docs.google.com/presentation/d/e/2PACX-abc/embed?start=false&loop=false&delayms=3000'
    )
  })

  it('embeds an editable presentation by its document id', () => {
    expect(getSlidesEmbedUrl('https://docs.google.com/presentation/d/DOC456/edit#slide=id.p')).toBe(
      'https://docs.google.com/presentation/d/DOC456/embed?start=false&loop=false&delayms=3000'
    )
  })

  it('returns unrecognised URLs unchanged', () => {
    const url = 'https://example.com/deck.pdf'
    expect(getSlidesEmbedUrl(url)).toBe(url)
  })
})

describe('getSlidesOpenUrl', () => {
  it('opens a Drive file via its /view URL', () => {
    expect(getSlidesOpenUrl('https://drive.google.com/open?id=FILE123')).toBe(
      'https://drive.google.com/file/d/FILE123/view'
    )
  })

  it('opens a published presentation via /pub', () => {
    expect(getSlidesOpenUrl('https://docs.google.com/presentation/d/e/2PACX-abc/embed')).toBe(
      'https://docs.google.com/presentation/d/e/2PACX-abc/pub'
    )
  })

  it('opens an editable presentation in present mode', () => {
    expect(getSlidesOpenUrl('https://docs.google.com/presentation/d/DOC456/edit')).toBe(
      'https://docs.google.com/presentation/d/DOC456/present'
    )
  })

  it('returns unrecognised URLs unchanged', () => {
    const url = 'https://example.com/deck'
    expect(getSlidesOpenUrl(url)).toBe(url)
  })
})
