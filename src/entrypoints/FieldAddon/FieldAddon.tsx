import { Fragment, useState, useMemo } from 'react'
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
  defaultExposedWordCounterFieldId,
} from '../../lib/constants'
import {
  Fields,
  CountObject,
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
  const fieldKey: string = ctx.field.attributes.api_key
  const locale: string = ctx.locale
  const pluginGlobalParameters: GlobalParameters =
    ctx.plugin.attributes.parameters
  const pluginParameters: Parameters = ctx.parameters

  const calculationsSettings: SettingOption[] =
    pluginParameters?.calculationsToShow ||
    pluginGlobalParameters?.calculationsToShow ||
    calculationsOptions
  const spaceSettings: SettingOption =
    pluginParameters?.includeSpace ||
    pluginGlobalParameters?.includeSpace ||
    spaceOptions[0]

  const fieldValue: any = get(ctx.formValues, ctx.fieldPath)
  const fieldValueString: string =
    ctx.field.attributes.field_type === Fields.structuredTextField
      ? structuredTextToString(fieldValue)
      : String(fieldValue)

  const fieldStats: CountObject = counter(fieldValueString)

  // If the exposed word counter field is present, we want to expose the wordStats
  const exposedWordCounterFieldId: Parameters['exposedWordCounterFieldId'] =
    pluginParameters?.exposedWordCounterFieldId ||
    `${fieldKey}_${defaultExposedWordCounterFieldId}`
  const hasExposedWordCounterField: boolean =
    ctx.formValues[exposedWordCounterFieldId] !== undefined

  if (hasExposedWordCounterField) {
    const fields: any[] = Object.entries(ctx.fields).map(([_, field]) => field)
    const wordCounterField: any = fields.find(
      (field) => field.attributes.api_key === exposedWordCounterFieldId
    )
    const isJsonField: boolean =
      wordCounterField?.attributes.field_type === Fields.jsonField

    if (isJsonField) {
      const isWordCounterFieldLocalized: boolean =
        wordCounterField?.attributes.localized
      const wordCounterPath: string = isWordCounterFieldLocalized
        ? `${exposedWordCounterFieldId}.${locale}`
        : exposedWordCounterFieldId

      ctx.toggleField(wordCounterPath, false)

      const fullExposedWordCounter: any = get(
        ctx.formValues,
        exposedWordCounterFieldId
      )
      const exposedWordCounter: any = isWordCounterFieldLocalized
        ? JSON.parse(fullExposedWordCounter[locale])
        : JSON.parse(fullExposedWordCounter)

      const newExposedWordCounter: any = fieldStats
      const countsAreEqual = objectsAreEqual(
        exposedWordCounter,
        newExposedWordCounter
      )

      if (!countsAreEqual) {
        ctx.setFieldValue(
          wordCounterPath,
          JSON.stringify(newExposedWordCounter)
        )
      }
    }
  }

  const [showSpaces, setShowSpaces] = useState<boolean>(
    spaceSettings.value === spaceConstants.includeSpaces &&
      spaceSettings.value !== spaceConstants.excludeSpaces
  )
  const [showInfo, setShowInfo] = useState<boolean>(false)
  const [showCommonWords, setShowCommonWords] = useState<boolean>(false)

  const showSpacesSwitch: boolean = useMemo(() => {
    return (
      spaceSettings.value !== spaceConstants.includeSpaces &&
      spaceSettings.value !== spaceConstants.excludeSpaces &&
      calculationsSettings.some(
        (setting) =>
          setting.value === calculationsConstants.numberOfCharacters ||
          setting.value === calculationsConstants.numberOfSpecialCharacters
      )
    )
  }, [spaceSettings, calculationsSettings])

  if (calculationsSettings.length === 0) {
    return (
      <Canvas ctx={ctx}>
        <p className="body">
          Words: <span className="text-bold">{fieldStats.words}</span>
        </p>
      </Canvas>
    )
  }

  return (
    <Canvas ctx={ctx}>
      {!showInfo && (
        <button className={styles.button} onClick={() => setShowInfo(true)}>
          <CaretDownIcon className={styles.buttonIcon} />
          <span className="body">
            Words: <span className="text-bold">{fieldStats.words}</span>
          </span>
        </button>
      )}

      {showInfo && (
        <>
          <StatsList>
            <dt>
              <button
                className={styles.button}
                onClick={() => setShowInfo(false)}
              >
                <CaretUpIcon className={styles.buttonIcon} />
                <span className="body">Words</span>
              </button>
            </dt>
            <dd>{fieldStats.words}</dd>

            {calculationsSettings.some(
              (setting) =>
                setting.value === calculationsConstants.numberOfCharacters
            ) ? (
              <>
                <dt>Characters</dt>
                <dd>
                  {showSpaces
                    ? fieldStats.characters
                    : fieldStats.charactersExcludingSpaces}
                </dd>
              </>
            ) : (
              <></>
            )}

            {calculationsSettings.some(
              (setting) =>
                setting.value ===
                calculationsConstants.numberOfSpecialCharacters
            ) ? (
              <>
                <dt>Special characters</dt>
                <dd>
                  {showSpaces
                    ? fieldStats.specialCharacters
                    : fieldStats.specialCharactersExcludingSpaces}
                </dd>
              </>
            ) : (
              <></>
            )}

            {calculationsSettings.some(
              (setting) =>
                setting.value === calculationsConstants.numberOfSentences
            ) ? (
              <>
                <dt>Sentences</dt>
                <dd>{fieldStats.sentences}</dd>
              </>
            ) : (
              <></>
            )}

            {calculationsSettings.some(
              (setting) =>
                setting.value === calculationsConstants.numberOfParagraphs
            ) ? (
              <>
                <dt>Paragraphs</dt>
                <dd>{fieldStats.paragraphs}</dd>
              </>
            ) : (
              <></>
            )}

            {calculationsSettings.some(
              (setting) => setting.value === calculationsConstants.readingTime
            ) ? (
              <>
                <dt>Reading time</dt>
                <dd>
                  <span className={styles.statsListItem}>
                    {fieldStats.readingTime}
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

          {Object.keys(fieldStats.commonWords).length > 0 &&
            calculationsSettings.some(
              (setting) =>
                setting.value === calculationsConstants.showCommonWords
            ) && (
              <>
                <button
                  className={styles.button}
                  onClick={() => setShowCommonWords(!showCommonWords)}
                >
                  {showCommonWords ? (
                    <CaretUpIcon className={styles.buttonIcon} />
                  ) : (
                    <CaretDownIcon className={styles.buttonIcon} />
                  )}
                  <span className="h2">
                    {`Common words (${
                      Object.keys(fieldStats.commonWords).length
                    })`}
                  </span>
                </button>

                {showCommonWords && (
                  <StatsList list>
                    {Object.keys(fieldStats.commonWords).map((word) => (
                      <Fragment key={word}>
                        <dt>{word}</dt>
                        <dd>{fieldStats.commonWords[word]}</dd>
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
