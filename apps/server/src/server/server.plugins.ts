/**
 * Override the default ajv keywords to support file type
 *
 * @param ajv
 * @returns
 */
export const ajvFilePlugin = (ajv: any) => {
  ajv.addKeyword('isFileType', {
    compile: (schema: any, parent: any) => {
      console.log(parent)
      parent.type = 'file'
      delete parent.isFileType
      return () => true
    }
  })

  return ajv
}
