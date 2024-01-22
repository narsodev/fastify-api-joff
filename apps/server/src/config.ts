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
  },
  auth: {
    jwtSecret: process.env.AUTH_JWT_SECRET ?? '',
    hashRrounds: 10
  },
  swagger: {
    name: 'Fastify API',
    description: 'Fastify API for technical assessment',
    version: '0.1.0',
    route: '/api/docs'
  }
} as const

export default config
