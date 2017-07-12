declare module 'react-bootstrap-typeahead' {

  interface TypeaheadProps {
    align?: 'justify' | 'left' | 'right'
    allowNew?: boolean
    defaultSelected?: Array<any>
    disabled?: boolean
    emptyLabel?: string
    labelKey?: string
    maxHeight?: number
    minLength?: number
    multiple?: boolean
    name?: string
    newSelectionPrefix?: string
    onBlur?: (e: Event) => any
    onChange?: (selected: Array<any>) => any
    onInputChange?: (input: string) => any
    options: Array<any>
    paginateResults?: number
    paginationText?: string
    placeholder?: string
    renderMenuItemChildren?: (props: TypeaheadProps, option: any, index: number) => any
    selected?: Array<any>
  }

  export var Typeahead: React.ClassicComponentClass<TypeaheadProps>

  export default Typeahead
}