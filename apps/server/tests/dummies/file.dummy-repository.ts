import { FileRepository } from '../../src/modules/file/repositories/file.repository'

type Files = Record<string, Uint8Array>

export default class FileDummyRepository implements FileRepository {
  files: Files

  constructor(files: Files = {}) {
    this.files = files
  }

  async download(filename: string): Promise<Uint8Array | undefined> {
    return this.files[filename]
  }

  async upload(file: Buffer, filename: string): Promise<void> {
    this.files[filename] = file
  }

  async delete(filename: string): Promise<void> {
    delete this.files[filename]
  }
}
