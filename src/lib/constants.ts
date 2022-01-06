export const fieldsConstants = {
  richText: 'rich_text',
  text: 'text',
  string: 'string'
}

export const fieldsOptions = [
  { label: 'String fields', value: fieldsConstants.string },
  { label: 'Text fields', value: fieldsConstants.text },
  { label: 'Rich-text fields', value: fieldsConstants.richText },
]


export const calculationsConstants = {
  numberOfCharacters: '1',
  numberOfSpecialCharacters: '2',
  numberOfSentences: '3',
  numberOfParagraphs: '4',
  showCommonWords: '5'
}

export const calculationsOptions = [
  { label: 'Number of characters', value: calculationsConstants.numberOfCharacters },
  { label: 'Number of special characters', value: calculationsConstants.numberOfSpecialCharacters },
  { label: 'Number of sentences', value: calculationsConstants.numberOfSentences },
  { label: 'Number of paragraphs', value: calculationsConstants.numberOfParagraphs },
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

