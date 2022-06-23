export type CountObject = {
  words: number
  characters: number
  charactersExcludingSpaces: number
  specialCharacters: number
  specialCharactersExcludingSpaces: number
  sentences: number
  paragraphs: number
  commonWords: CommonWordsObject
  readingTime: string
}

export type CommonWordsObject = {
  [key: string]: number
}

export type SettingOption = {
  value: string
  label: string
}

export type Parameters = {
  calculationsToShow?: SettingOption[]
  includeSpace?: SettingOption
  exposedWordCounterFieldId?: string
}

export interface GlobalParameters extends Parameters {
  autoApply?: boolean
  fieldsToEnable?: SettingOption[]
}

export enum Fields {
  stringField = 'string',
  textField = 'text',
  structuredTextField = 'structured_text',
  jsonField = 'json'
}