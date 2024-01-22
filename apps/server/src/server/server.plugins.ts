/**
 * Override the default ajv keywords to support file type
 *
 * @param ajv
 * @returns
 */
export const ajvFilePlugin = (ajv: any) => {
  ajv.addKeyword('isFileType', {
    compile: (schema: any, parent: any) => {
      parent.type = 'file'
      delete parent.isFileType
      return () => true
    }
  })

  return ajv
}
