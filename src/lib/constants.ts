import { Fields } from './types'

export const wordsPerMinute = 225

export const fieldsOptions = [
  { label: 'String fields', value: Fields.stringField },
  { label: 'Text fields', value: Fields.textField },
  { label: 'Structured text fields', value: Fields.structuredTextField },
  { label: 'Rich-text fields', value: Fields.richTextField },
]

export const calculationsConstants = {
  numberOfCharacters: '1',
  numberOfSpecialCharacters: '2',
  numberOfSentences: '3',
  numberOfParagraphs: '4',
  showCommonWords: '5',
  readingTime: '6'
}

export const calculationsOptions = [
  { label: 'Number of characters', value: calculationsConstants.numberOfCharacters },
  { label: 'Number of special characters', value: calculationsConstants.numberOfSpecialCharacters },
  { label: 'Number of sentences', value: calculationsConstants.numberOfSentences },
  { label: 'Number of paragraphs', value: calculationsConstants.numberOfParagraphs },
  { label: 'Reading time', value: calculationsConstants.readingTime },
  { label: 'Show common words', value: calculationsConstants.showCommonWords },
]

export const spaceConstants = {
  showSwitch: '1',
  includeSpaces: '2',
  excludeSpaces: '3'
}

export const spaceOptions = [
  { label: 'Show switch to toggle spaces', value: spaceConstants.showSwitch },
  { label: 'Always include spaces', value: spaceConstants.includeSpaces },
  { label: 'Never include spaces', value: spaceConstants.excludeSpaces },
]

