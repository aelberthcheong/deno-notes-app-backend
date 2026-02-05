FROM denoland/deno:latest
WORKDIR /app

# Copy dependencies file
COPY deno.json deno.lock ./

# Cache dependencies berdasasrkan import di deno.json(c)
RUN deno install

# Copy sisa kode yang lainnya
COPY . .

ENV NODE_ENV=production
CMD ["deno", "run", "-A", "--cached-only", "main.ts"]