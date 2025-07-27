FROM golang:1.21-alpine AS builder

WORKDIR /app

# go mod と go sum をコピー
COPY go.mod go.sum ./

# 依存関係をダウンロード
RUN go mod download

# ソースコードをコピー
COPY . .

# バイナリをビルド
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main cmd/server/main.go

# 本番用イメージ
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# バイナリをコピー
COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
