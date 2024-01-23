export interface FileRepository {
  download(filename: string): Promise<Uint8Array | undefined>
  upload(file: Buffer, filename: string): Promise<void>
  delete(filename: string): Promise<void>
}
