import { Fragment, useState, useMemo, useCallback, useEffect } from 'react'
import get from 'lodash/get'
import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk'
import {
  Canvas,
  SwitchField,
  CaretDownIcon,
  CaretUpIcon,
} from 'datocms-react-ui'

import StatsList from '../../components/StatsList'

import {
  wordsPerMinute,
  spaceConstants,
  calculationsConstants,
  calculationsOptions,
  spaceOptions,
  htmlConstants,
  htmlOptions,
  defaultExposedWordCounterFieldId,
} from '../../lib/constants'
import {
  Fields,
  CountObject,
  SavingCountObject,
  SettingOption,
  Parameters,
  GlobalParameters,
} from '../../lib/types'
import counter from '../../lib/counter'
import { objectsAreEqual } from '../../lib/helpers'
import { structuredTextToString } from '../../lib/structured-text-helpers'

import styles from './FieldAddon.module.css'

type Props = {
  ctx: RenderFieldExtensionCtx
}

export default function FieldAddon({ ctx }: Props) {
  const pluginGlobalParameters: GlobalParameters =
    ctx.plugin.attributes.parameters
  const pluginParameters: Parameters = ctx.parameters
  const fieldPath: string = ctx.fieldPath
  const locale: string = ctx.locale
  const isLocalized: boolean = ctx?.field.attributes.localized

  function getExposedWordCounterFieldId() {
    if (pluginParameters?.exposedWordCounterFieldId) {
      return pluginParameters.exposedWordCounterFieldId
    }

    if (pluginGlobalParameters?.exposedWordCounterFieldId && isLocalized) {
      return `${pluginGlobalParameters.exposedWordCounterFieldId}.${locale}`
    }

    if (isLocalized) {
      const [fieldPathWithoutLocale]: string[] =
        ctx.fieldPath.split(/\.(?=[^.]+$)/)
      return `${fieldPathWithoutLocale}_${defaultExposedWordCounterFieldId}.${locale}`
    }

    return `${fieldPath}_${defaultExposedWordCounterFieldId}`
  }
  const exposedWordCounterFieldId: Parameters['exposedWordCounterFieldId'] =
    getExposedWordCounterFieldId()
  const hasExposedWordCounterField: boolean =
    get(ctx.formValues, exposedWordCounterFieldId) !== undefined

  const validationLength: any = ctx.field.attributes.validators?.length

  const calculationsSettings: SettingOption[] =
    pluginParameters?.calculationsToShow ||
    pluginGlobalParameters?.calculationsToShow ||
    calculationsOptions
  const spaceSettings: SettingOption =
    pluginParameters?.includeSpace ||
    pluginGlobalParameters?.includeSpace ||
    spaceOptions[0]
  const htmlSettings: SettingOption =
    pluginParameters?.includeHTML ||
    pluginGlobalParameters?.includeHTML ||
    htmlOptions[0]

  const fieldValue: any = get(ctx.formValues, fieldPath)
  const fieldValueString: string =
    ctx.field.attributes.field_type === Fields.structuredTextField
      ? structuredTextToString(fieldValue)
      : String(fieldValue)

  const fieldStats: CountObject = counter(fieldValueString)

  function getExposedWordCounter() {
    if (hasExposedWordCounterField && exposedWordCounterFieldId) {
      ctx.toggleField(exposedWordCounterFieldId, false)

      const fullExposedWordCounter: any = get(
        ctx.formValues,
        exposedWordCounterFieldId,
      )
      const exposedWordCounter: SavingCountObject = JSON.parse(
        fullExposedWordCounter,
      )

      return exposedWordCounter
    }
    return undefined
  }
  const exposedWordCounter: SavingCountObject | undefined =
    getExposedWordCounter()

  const saveExposedWordCount = useCallback(
    (newExposedWordCounter: SavingCountObject) => {
      // If the exposed word counter field is present, we want to expose the newExposedWordCounter
      if (hasExposedWordCounterField) {
        const wordCounterPath: string = exposedWordCounterFieldId

        ctx.toggleField(wordCounterPath, false)

        const countsAreEqual = objectsAreEqual(
          exposedWordCounter,
          newExposedWordCounter,
        )

        if (!countsAreEqual) {
          ctx.setFieldValue(
            wordCounterPath,
            JSON.stringify(newExposedWordCounter),
          )
        }
      }
    },
    [
      ctx,
      exposedWordCounterFieldId,
      hasExposedWordCounterField,
      exposedWordCounter,
    ],
  )

  const showSpacesSwitch: boolean =
    spaceSettings.value !== spaceConstants.includeSpaces &&
    spaceSettings.value !== spaceConstants.excludeSpaces &&
    calculationsSettings.some(
      (setting) =>
        setting.value === calculationsConstants.numberOfCharacters ||
        setting.value === calculationsConstants.numberOfSpecialCharacters,
    )

  const showHTMLSwitch: boolean =
    htmlSettings.value !== htmlConstants.includeHTML &&
    htmlSettings.value !== htmlConstants.excludeHTML &&
    calculationsSettings.some(
      (setting) =>
        setting.value === calculationsConstants.numberOfCharacters ||
        setting.value === calculationsConstants.numberOfSpecialCharacters,
    )

  const [showSpaces, setShowSpaces] = useState<boolean>(
    showSpacesSwitch
      ? exposedWordCounter?.settings?.includeSpace || false
      : spaceSettings.value === spaceConstants.includeSpaces &&
          spaceSettings.value !== spaceConstants.excludeSpaces,
  )
  const [showHTML, setShowHTML] = useState<boolean>(
    showHTMLSwitch
      ? exposedWordCounter?.settings?.includeHTML || false
      : htmlSettings.value === htmlConstants.includeHTML &&
          htmlSettings.value !== htmlConstants.excludeHTML,
  )
  const [showInfo, setShowInfo] = useState<boolean>(false)
  const [showCommonWords, setShowCommonWords] = useState<boolean>(false)

  const wordCount: SavingCountObject = useMemo(() => {
    const {
      words,
      characters,
      specialCharacters,
      sentences,
      paragraphs,
      commonWords,
      readingTime,
    } = fieldStats

    const defaultStats: SavingCountObject = {
      words,
      characters,
      specialCharacters,
      sentences,
      paragraphs,
      commonWords,
      readingTime,
      settings: {
        includeSpace: showSpaces,
        includeHTML: showHTML,
      },
    }

    if (!showSpaces && !showHTML) {
      return {
        ...defaultStats,
        characters: fieldStats.charactersExcludingSpacesAndHTMLElements,
        specialCharacters:
          fieldStats.specialCharactersExcludingSpacesAndHTMLElements,
        words: fieldStats.wordsExcludingHTMLElements,
        commonWords: fieldStats.commonWordsExcludingHTMLElements,
      }
    }

    if (!showSpaces) {
      return {
        ...defaultStats,
        characters: fieldStats.charactersExcludingSpaces,
        specialCharacters: fieldStats.specialCharactersExcludingSpaces,
      }
    }

    if (!showHTML) {
      return {
        ...defaultStats,
        words: fieldStats.wordsExcludingHTMLElements,
        characters: fieldStats.charactersExcludingHTMLElements,
        specialCharacters: fieldStats.specialCharactersExcludingHTMLElements,
        commonWords: fieldStats.commonWordsExcludingHTMLElements,
      }
    }

    return defaultStats
  }, [showSpaces, showHTML, fieldStats])

  useEffect(() => {
    saveExposedWordCount(wordCount)
  }, [saveExposedWordCount, wordCount])

  if (calculationsSettings.length === 0) {
    return (
      <Canvas ctx={ctx}>
        <p className="body">
          Words: <span className="text-bold">{wordCount.words}</span>
        </p>
      </Canvas>
    )
  }

  return (
    <Canvas ctx={ctx}>
      {!showInfo && (
        <button className={styles.button} onClick={() => setShowInfo(true)}>
          <CaretDownIcon
            className={`${styles.buttonIcon} ${
              fieldStats.characters > validationLength?.max ||
              fieldStats.characters < validationLength?.min
                ? styles.buttonIconError
                : ''
            }`.trim()}
          />
          <span className="body">
            Words: <span className="text-bold">{wordCount.words}</span>
          </span>
        </button>
      )}

      {showInfo && (
        <>
          <StatsList>
            <dt>
              <button
                className={styles.button}
                onClick={() => {
                  setShowInfo(false)
                  setTimeout(() => {
                    ctx.updateHeight(0)
                  }, 1)
                }}
              >
                <CaretUpIcon
                  className={`${styles.buttonIcon} ${
                    fieldStats.characters > validationLength?.max ||
                    fieldStats.characters < validationLength?.min
                      ? styles.buttonIconError
                      : ''
                  }`.trim()}
                />
                <span className="body">Words</span>
              </button>
            </dt>
            <dd>{wordCount.words}</dd>

            {calculationsSettings.some(
              (setting) =>
                setting.value === calculationsConstants.numberOfCharacters,
            ) ? (
              <>
                <dt>Characters</dt>
                <dd>
                  <span
                    className={
                      fieldStats.characters > validationLength?.max ||
                      fieldStats.characters < validationLength?.min
                        ? ' text-error'
                        : ''
                    }
                  >
                    {wordCount.characters}
                    {validationLength?.max &&
                      (validationLength?.min
                        ? fieldStats.characters >= validationLength?.min
                        : true) && (
                        <>
                          {' '}
                          {showSpaces ? (
                            <span className="body--medium">
                              / {validationLength?.max}
                            </span>
                          ) : (
                            <span className="body--medium">
                              ({fieldStats.characters} / {validationLength?.max}
                              )
                            </span>
                          )}
                        </>
                      )}
                    {validationLength?.min &&
                      fieldStats.characters < validationLength?.min && (
                        <>
                          {' '}
                          <span className="body--medium">
                            ({validationLength?.min - fieldStats.characters}{' '}
                            characters needed)
                          </span>
                        </>
                      )}
                  </span>
                </dd>
              </>
            ) : (
              <></>
            )}

            {calculationsSettings.some(
              (setting) =>
                setting.value ===
                calculationsConstants.numberOfSpecialCharacters,
            ) ? (
              <>
                <dt>Special characters</dt>
                <dd>{wordCount.specialCharacters}</dd>
              </>
            ) : (
              <></>
            )}

            {calculationsSettings.some(
              (setting) =>
                setting.value === calculationsConstants.numberOfSentences,
            ) ? (
              <>
                <dt>Sentences</dt>
                <dd>{wordCount.sentences}</dd>
              </>
            ) : (
              <></>
            )}

            {calculationsSettings.some(
              (setting) =>
                setting.value === calculationsConstants.numberOfParagraphs,
            ) ? (
              <>
                <dt>Paragraphs</dt>
                <dd>{wordCount.paragraphs}</dd>
              </>
            ) : (
              <></>
            )}

            {calculationsSettings.some(
              (setting) => setting.value === calculationsConstants.readingTime,
            ) ? (
              <>
                <dt>Reading time</dt>
                <dd>
                  <span className={styles.statsListItem}>
                    {wordCount.readingTime}
                  </span>
                  <span
                    className={`${styles.statsListItem} body--small text-thin`}
                  >
                    Based on {wordsPerMinute} words per minute
                  </span>
                </dd>
              </>
            ) : (
              <></>
            )}
          </StatsList>

          {showSpacesSwitch && (
            <div className={styles.switchField}>
              <SwitchField
                id="showSpaces"
                name="showSpaces"
                label="Include spaces"
                value={showSpaces}
                onChange={() => setShowSpaces(!showSpaces)}
              />
            </div>
          )}

          {showHTMLSwitch && (
            <div className={styles.switchField}>
              <SwitchField
                id="showHTML"
                name="showHTML"
                label="Include HTML elements"
                value={showHTML}
                onChange={() => setShowHTML(!showHTML)}
              />
            </div>
          )}

          {calculationsSettings.some(
            (setting) =>
              setting.value === calculationsConstants.showCommonWords,
          ) && (
            <>
              <button
                className={styles.button}
                onClick={() => {
                  setShowCommonWords(!showCommonWords)
                  if (showCommonWords) {
                    setTimeout(() => {
                      ctx.updateHeight(0)
                    }, 1)
                  }
                }}
              >
                {showCommonWords ? (
                  <CaretUpIcon className={styles.buttonIcon} />
                ) : (
                  <CaretDownIcon className={styles.buttonIcon} />
                )}
                <span className="h2">
                  {`Common words (${
                    Object.keys(wordCount.commonWords).length
                  })`}
                </span>
              </button>

              {showCommonWords && (
                <StatsList list>
                  {Object.keys(wordCount.commonWords).map((word) => (
                    <Fragment key={word}>
                      <dt>{word}</dt>
                      <dd>{wordCount.commonWords[word]}</dd>
                    </Fragment>
                  ))}
                </StatsList>
              )}
            </>
          )}
        </>
      )}
    </Canvas>
  )
}
