# Gera o site e o entrega pelo FastAPI no mesmo contêiner.
FROM node:20-bookworm-slim AS web-build
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx --no-install next build

FROM python:3.12-slim
WORKDIR /app
COPY rag_service/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY rag_service ./rag_service
COPY --from=web-build /build/out ./out
WORKDIR /app/rag_service
ENV STATIC_SITE_DIR=/app/out
ENV PORT=8000
EXPOSE 8000
CMD ["sh", "-c", "uvicorn site:app --host 0.0.0.0 --port ${PORT}"]

