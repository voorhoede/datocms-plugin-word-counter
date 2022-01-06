import { CountObject, CommonWordsObject } from './types'

export default function counter(string: string): CountObject {
  const stringExcludingSpaces = string.replace(/\s/g, '')

  return {
    words: wordCounter(string),
    characters: string.length,
    charactersExcludingSpaces: stringExcludingSpaces.length,
    specialCharacters: specialCharacterCounter(string),
    specialCharactersExcludingSpaces: specialCharacterCounter(stringExcludingSpaces),
    sentences: sentencesCounter(string),
    paragraphs: paragraphsCounter(string),
    commonWords: commonWords(string),
  }
}

function wordCounter(string: string): number {
  const wordRegex = /[ \n|/]/
  const words = string.split(wordRegex).filter(hasNoSpace)
  return words.length
}

function specialCharacterCounter(string: string): number {
  let specialCharacters = 0

  for (let i = 0; i < string.length; i++) {
    const code = string.charCodeAt(i);
    if ((code < 47 || code > 58) && // != numeric (0-9)
      (code < 64 || code > 91) && // != upper alpha (A-Z)
      (code < 96 || code > 123)) { // != lower alpha (a-z)
      specialCharacters++
    }
  }

  return specialCharacters
}

function sentencesCounter(string: string): number {
  const sentenceRegex = /[.!?\n]/
  const sentences = string.split(sentenceRegex).filter(hasNoSpace)
  return sentences.length
}

function paragraphsCounter(string: string): number {
  const paragraphRegex = /[\n]/
  const paragraphs = string.split(paragraphRegex).filter(hasNoSpace)
  return paragraphs.length
}

function commonWords(string: string): CommonWordsObject {
  const wordRegex = /[ \n]/
  const words = string.split(wordRegex)
  const normalizedWords = words
    .map(word => word
      .replace(/["|'-(){}[\]]/g, '')
      .replace(/[.,!?;:]\s*$/, '')
      .toLowerCase()
    )
    .sort()
    .filter(hasNoSpace)

  const wordCount = normalizedWords.reduce((acc: CommonWordsObject, word: string) => {
    acc[word] = (acc[word] || 0) + 1
    return acc
  }, {})

  return Object.entries(wordCount)
    .sort(([, a]: any, [, b]: any) => b - a)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

function hasNoSpace(word: string): boolean {
  return word !== ' ' && word !== ''
}