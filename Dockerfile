# Use a specific version of the Jupyter base image to ensure consistency
FROM jupyter/base-notebook:latest

USER root

# Install any additional system dependencies if necessary
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Python packages
RUN pip install --no-cache-dir \
    numpy \
    pandas \
    matplotlib \
    ipykernel

# Copy your application's requirements.txt and install Python dependencies
COPY requirements.txt /tmp/
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Switch back to the non-root user
USER $NB_UID

# Wipe existing temp files before building
RUN rm -rf /tmp/* 

# Copy package.json into the image and set the owner
COPY --chown=$NB_UID:$NB_GID package.json /tmp/package.json

# Install jq to parse package.json
RUN apt-get update && apt-get install -y jq

# Extract values from package.json and set them as build arguments
ARG APP_NAME
ARG APP_VERSION
ARG APP_DESCRIPTION
ARG MAIN_SCRIPT
ARG TEST_COMMAND
ARG AUTHOR
ARG LICENSE

# Use jq to parse package.json and set ARG values
RUN export APP_NAME=$(jq -r .name /tmp/package.json) && \
    export APP_VERSION=$(jq -r .version /tmp/package.json) && \
    export APP_DESCRIPTION=$(jq -r .description /tmp/package.json) && \
    export MAIN_SCRIPT=$(jq -r .main /tmp/package.json) && \
    export TEST_COMMAND=$(jq -r .scripts.test /tmp/package.json) && \
    export AUTHOR=$(jq -r .author /tmp/package.json) && \
    export LICENSE=$(jq -r .license /tmp/package.json)

# Embed metadata into the image as labels using ARG values
LABEL org.opencontainers.image.title="${APP_NAME}" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.description="${APP_DESCRIPTION}" \
      org.opencontainers.image.authors="${AUTHOR}" \
      org.opencontainers.image.licenses="${LICENSE}"

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    zsh \ 
    git \
    iproute2 \
    nodejs \
    npm \
    python3-pip \
    python3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install NPM packages
RUN npm install --prefix /tmp

# Move node_modules to the home directory
RUN cp -a /tmp/node_modules /home/jovyan/

# Upgrade pip and install Python packages
RUN pip3 install --upgrade pip && \
    pip3 install ipykernel numpy pandas matplotlib && \
    python3 -m ipykernel install --user

# Change shell to Zsh
RUN chsh -s $(which zsh)

# Verify installation of key components
RUN node -v && npm -v && python3 --version && ipython3 --version && \
    jupyter notebook --version

# Switch to jovyan user
USER $NB_UID

# Clone the existing .ENV, if it exists, then write environment and Docker details to the .env file
RUN if [ -f /tmp/.env ]; then cp /tmp/.env /tmp/.env.bak; fi && \
    echo "USER=$(whoami)" >> /tmp/.env && \
    echo "WORKDIR=$(pwd)" >> /tmp/.env && \
    echo "LOCAL_IP=$(ip -4 addr show eth0 | grep 'inet' | awk '{print $2}' | cut -d/ -f1)" >> /tmp/.env && \
    echo "PUBLIC_IP=$(curl -s https://api.ipify.org)" >> /tmp/.env && \
    echo "JUPYTER_CONFIG_DIR=/home/jovyan/.jupyter" >> /tmp/.env

# Define a volume for persistent data, expose ports for application access, and set the default command
VOLUME ["/home/jovyan/${APP_NAME}-data"]
EXPOSE 8888 3000
CMD ["zsh"]

# Install or Update to the latest Agent 7 version on Docker
# Enable APM Instrumentation
RUN bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_script_docker_injection.sh)"

# Install the Datadog Agent
RUN docker run -d --name dd-agent \
    -e DD_API_KEY=580bb19769108f2969f46b72703593b5 \
    -e DD_SITE="us5.datadoghq.com" \
    -e DD_APM_ENABLED=true \
    -e DD_APM_NON_LOCAL_TRAFFIC=true \
    -e DD_APM_RECEIVER_SOCKET=/opt/datadog/apm/inject/run/apm.socket \
    -e DD_DOGSTATSD_SOCKET=/opt/datadog/apm/inject/run/dsd.socket \
    -e DD_DOGSTATSD_NON_LOCAL_TRAFFIC=true \
    -v /opt/datadog/apm:/opt/datadog/apm \
    -v /var/run/docker.sock:/var/run/docker.sock:ro \
    -v /proc/:/host/proc/:ro \
    -v /sys/fs/cgroup/:/host/sys/fs/cgroup:ro \
    -v /var/lib/docker/containers:/var/lib/docker/containers:ro \
    gcr.io/datadoghq/agent:7

# Extend aliases for installed apps with additional useful commands
RUN echo "alias ls='ls --color=auto'" >> ~/.zshrc && \
    echo "alias ll='ls -l'" >> ~/.zshrc && \
    echo "alias l='ls -lA'" >> ~/.zshrc && \
    echo "alias curl='curl -s'" >> ~/.zshrc && \
    echo "alias python='python3'" >> ~/.zshrc && \
    echo "alias pip='pip3'" >> ~/.zshrc && \
    echo "alias node='nodejs'" >> ~/.zshrc && \
    echo "alias npm='npm --silent'" >> ~/.zshrc && \
    echo "alias git='git --no-pager'" >> ~/.zshrc && \
    echo "alias jupyter='jupyter notebook --no-browser --ip=0.0.0.0'" >> ~/.zshrc
