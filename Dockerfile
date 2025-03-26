FROM node:23-alpine AS build

RUN apk add --no-cache \
  git \
  python3 \
  py3-pip \
  build-base


RUN python3 -m venv /venv


RUN /venv/bin/pip install --upgrade pip \
  && git clone https://github.com/suaveolent/hoymiles-wifi.git \
  && /venv/bin/pip install ./hoymiles-wifi

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY app /app


FROM node:23-alpine

RUN apk add --no-cache python3 py3-pip


COPY --from=build /venv /venv
COPY --from=build /app /app

ENV PATH="/venv/bin:$PATH"

WORKDIR /app

EXPOSE 3157
CMD ["node", "start.js"]
