import { Button, Box, FormField, TextInput } from "grommet"
import { Add } from "grommet-icons"

const AddPerson = ({ name, onChange, onSubmit }) => {
  return (
    <Box style={{ zIndex: 0 }}>
      <Box
        direction="row"
        flex="grow"
        justify="between"
        align="end"
        background="white"
        style={{
          position: 'fixed',
          bottom: 0,
          width: '100%'
        }} pad="medium"
        elevation="reverse" >
        <Box flex="grow" margin={{ right: "medium" }}>
          <FormField label="Add a name to the list" margin={{ bottom: "0" }}>
            <TextInput placeholder="Insert the name" value={name} onChange={e => onChange(e.target.value)} />
          </FormField>
        </Box>
        <Button
          style={{ height: 48, width: 48, padding: 0 }}
          size="small" icon={<Add size="medium" />}
          onClick={onSubmit} />
      </Box>
    </Box>
  )
}

export default AddPerson;
