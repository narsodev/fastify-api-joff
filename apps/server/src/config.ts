const config = {
  server: {
    port: Number(process.env.PORT ?? 8080)
  },
  aws: {
    region: process.env.AWS_REGION ?? '',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    s3: {
      bucketName: process.env.AWS_S3_BUCKET_NAME ?? ''
    }
  }
} as const

export default config
