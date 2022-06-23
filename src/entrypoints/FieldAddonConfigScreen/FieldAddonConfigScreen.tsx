import { RenderManualFieldExtensionConfigScreenCtx } from 'datocms-plugin-sdk'
import {
  Canvas,
  Form,
  SelectField,
  FieldGroup,
  TextField,
} from 'datocms-react-ui'

import {
  spaceOptions,
  calculationsOptions,
  defaultExposedWordCounterFieldId,
} from '../../lib/constants'
import { Parameters, GlobalParameters } from '../../lib/types'

type Props = {
  ctx: RenderManualFieldExtensionConfigScreenCtx
}

export default function FieldExtensionConfigScreen({ ctx }: Props) {
  const pluginParameters: Parameters = ctx.parameters
  const pluginGlobalParameters: GlobalParameters =
    ctx.plugin.attributes.parameters

  return (
    <Canvas ctx={ctx}>
      <Form>
        <FieldGroup>
          <SelectField
            name="calculationsToShow"
            id="calculationsToShow"
            label="Calculations to show"
            value={
              pluginParameters?.calculationsToShow ||
              pluginGlobalParameters?.calculationsToShow ||
              calculationsOptions
            }
            selectInputProps={{
              isMulti: true,
              options: calculationsOptions,
            }}
            onChange={(newValue) => {
              ctx.setParameters({
                ...pluginParameters,
                calculationsToShow: newValue,
              })
            }}
          />

          <SelectField
            name="includeSpace"
            id="includeSpace"
            label="Include space"
            hint="For calculating characters you can choose to include spaces in the count."
            value={
              pluginParameters?.includeSpace ||
              pluginGlobalParameters?.includeSpace ||
              spaceOptions[0]
            }
            selectInputProps={{
              options: spaceOptions,
            }}
            onChange={(newValue) => {
              ctx.setParameters({
                ...pluginParameters,
                includeSpace: newValue,
              })
            }}
          />

          <TextField
            name="exposedWordCounterFieldId"
            id="exposedWordCounterFieldId"
            label="Exposed word counter field id"
            hint={`The id of the field that will be used to store the word counter. This needs to be a JSON field. Only change if your exposed word counter fieldId isn't the default '{fieldId}_${defaultExposedWordCounterFieldId}'.`}
            value={
              pluginParameters?.exposedWordCounterFieldId
            }
            onChange={(newValue) => {
              ctx.setParameters({
                ...pluginParameters,
                exposedWordCounterFieldId: newValue,
              })
            }}
          />
        </FieldGroup>
      </Form>
    </Canvas>
  )
}
