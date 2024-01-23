import {
  S3,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3'

import config from '../../../config.js'

import { FileRepository } from './file.repository.js'

export default class FileS3Repository implements FileRepository {
  private readonly s3: S3

  constructor() {
    this.s3 = new S3({
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey
      }
    })
  }

  async download(filename: string): Promise<Uint8Array | undefined> {
    try {
      const command = new GetObjectCommand({
        Bucket: config.aws.s3.bucketName,
        Key: filename
      })

      const response = await this.s3.send(command)
      return response.Body?.transformToByteArray()
    } catch (error) {
      return undefined
    }
  }

  async upload(file: Buffer, filename: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: config.aws.s3.bucketName,
      Key: filename,
      Body: file
    })

    await this.s3.send(command)
  }

  async delete(filename: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: config.aws.s3.bucketName,
      Key: filename
    })

    await this.s3.send(command)
  }
}
