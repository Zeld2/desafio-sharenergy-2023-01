# syntax=docker/dockerfile:1

FROM golang:1.17-alpine AS build
RUN apk update && apk upgrade && apk --update add git

# copia os arquivos da frontend já "compilados".
# isso é muito importante!
WORKDIR /frontend
COPY ui/dist/ ./

WORKDIR /backend

# dependencias do go
COPY server/go.* ./

# instala
RUN go mod download

# copia os arquivo tudo
COPY server/ ./

# builda
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o /server .

# distroless que é mais menor
FROM gcr.io/distroless/static-debian11:debug

COPY --from=busybox:1.35.0-uclibc /bin/sh /bin/sh
COPY --from=busybox:1.35.0-uclibc /bin/ls /bin/ls

# vai ponhar tudo aqui
WORKDIR /server

# copia o binário do servidor
COPY --from=build /server .

# copia a interface
COPY --from=build /frontend /server/public

EXPOSE 3000

ENTRYPOINT ["./server"]
