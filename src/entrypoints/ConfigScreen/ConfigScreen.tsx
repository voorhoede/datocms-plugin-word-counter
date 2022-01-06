import { RenderConfigScreenCtx } from 'datocms-plugin-sdk'
import {
  Canvas,
  Form,
  SelectField,
  SwitchField,
  FieldGroup,
} from 'datocms-react-ui'

import {
  spaceOptions,
  calculationsOptions,
  fieldsOptions,
} from '../../lib/constants'
import { GlobalParameters } from '../../lib/types'

type Props = {
  ctx: RenderConfigScreenCtx
}

export default function ConfigScreen({ ctx }: Props) {
  const pluginParameters: GlobalParameters = ctx.plugin.attributes.parameters

  return (
    <Canvas ctx={ctx}>
      <p>
        This DatoCMS plugin gives you info for text and string fields about word
        counts.
      </p>

      <Form>
        <FieldGroup>
          <SwitchField
            name="autoApply"
            id="autoApply"
            label="Auto apply to fields"
            hint="If enabled it will automatically apply the word count plugin to all fields set in the settings."
            value={Boolean(pluginParameters?.autoApply)}
            onChange={(newValue: boolean) => {
              ctx.updatePluginParameters({
                ...pluginParameters,
                autoApply: newValue,
              })
              ctx.notice('Settings updated successfully!')
            }}
          />
        </FieldGroup>

        {pluginParameters?.autoApply && (
          <FieldGroup>
            <SelectField
              name="fieldsToEnable"
              id="fieldsToEnable"
              label="Fields where this plugin is enabled"
              hint="These are all fields where the word count plugin will automatically apply."
              value={pluginParameters?.fieldsToEnable || fieldsOptions}
              selectInputProps={{
                isMulti: true,
                options: fieldsOptions,
              }}
              onChange={(newValue) => {
                ctx.updatePluginParameters({
                  ...pluginParameters,
                  fieldsToEnable: newValue,
                })
                ctx.notice('Settings updated successfully!')
              }}
            />

            <SelectField
              name="calculationsToShow"
              id="calculationsToShow"
              label="Calculations to show"
              value={
                pluginParameters?.calculationsToShow || calculationsOptions
              }
              selectInputProps={{
                isMulti: true,
                options: calculationsOptions,
              }}
              onChange={(newValue) => {
                ctx.updatePluginParameters({
                  ...pluginParameters,
                  calculationsToShow: newValue,
                })
                ctx.notice('Settings updated successfully!')
              }}
            />

            <SelectField
              name="includeSpace"
              id="includeSpace"
              label="Include space"
              hint="For calculating characters you can choose to include spaces in the count."
              value={pluginParameters?.includeSpace || spaceOptions[0]}
              selectInputProps={{
                options: spaceOptions,
              }}
              onChange={(newValue) => {
                ctx.updatePluginParameters({
                  ...pluginParameters,
                  includeSpace: newValue,
                })
                ctx.notice('Settings updated successfully!')
              }}
            />
          </FieldGroup>
        )}
      </Form>
    </Canvas>
  )
}
