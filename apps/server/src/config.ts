const config = {
  server: {
    port: Number(process.env.PORT ?? 8080)
  }
} as const

export default config
