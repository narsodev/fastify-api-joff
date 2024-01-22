import { S3, PutObjectCommand } from '@aws-sdk/client-s3'
import config from '../../config.js'

export default class FileRepository {
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

  async upload(file: Buffer, filename: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: config.aws.s3.bucketName,
      Key: filename,
      Body: file
    })

    await this.s3.send(command)
  }
}
