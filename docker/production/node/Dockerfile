ARG NODE_VERSION="16"

FROM node:${NODE_VERSION}-alpine

LABEL org.opencontainers.image.description "Sales Manager Bot is a Discord bot that allows you to manage and secure contents shared by the users of your guild on certain channels."
LABEL org.opencontainers.image.source "https://github.com/la-logia-tetona/sales-manager-bot"

ARG USR="node"
ARG GRP="node"
ARG UID="1000"
ARG GID="1000"

ENV NODE_APP="/usr/local/app" \
    NODE_ENV="production"

# https://linux.die.net/man/8/adduser
# https://qastack.mx/programming/49955097/how-do-i-add-a-user-when-im-using-alpine-as-a-base-image
# https://ostechnix.com/add-delete-and-grant-sudo-privileges-to-users-in-alpine-linux/
# https://www.codegrepper.com/code-examples/shell/alpine+docker+add+user+and+group
# https://wiki.alpinelinux.org/wiki/Setting_up_a_new_user#adduser
RUN addgroup --gid "${GID}" -S "${GRP}" &>/dev/null || true; \
    adduser \
      --home "/home/${USR}" \
      --gecos "" \
      --shell "/bin/sh" \
      --ingroup "${GRP}" \
      --disabled-password \
      --uid "${UID}" \
      "${USR}" &>/dev/null || true; \
    echo "${USR} ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers; \
    mkdir -p ${NODE_APP} && chown "${UID}:${GID}" ${NODE_APP} -R

USER ${UID}:${GID}

COPY ./helpers ${NODE_APP}/helpers
COPY ./locales ${NODE_APP}/locales
COPY ./services ${NODE_APP}/services
COPY ./deploy-commands.js ./i18n.config.js ./index.js ./package.json ./yarn.lock ./docker/production/node/start.sh ${NODE_APP}/

WORKDIR ${NODE_APP}

RUN yarn install --production

CMD [ "sh", "-c", "./start.sh"]