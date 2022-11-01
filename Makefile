.PHONY: ui vendor build ui-agent ui-manager container-agent container-agent-push container-manager container-manager-push release-container-agent-multiversions push container-frontend container-frontend-push

CONTAINER_TAG ?= tsidentity/tornjak-spire-server:latest
CONTAINER_TAG_FRONTEND ?= tsidentity/tornjak-ui:latest
CONTAINER_VERSION_IMAGEPATH ?= tsidentity/tornjak-spire-server
CONTAINER_VERSION_GHCR_IMAGEPATH ?= ghcr.io/spiffe/tornjak-spire-server
CONTAINER_MANAGER_TAG ?= tsidentity/tornjak-manager:latest
GO_FILES := $(shell find . -type f -name '*.go' -not -name '*_test.go' -not -path './vendor/*')
AUTH_SERVER_URI ?= http://localhost:8080
APP_SERVER_URI ?= http://localhost:10000

all: bin/tornjak-agent bin/tornjak-manager ui-agent ui-manager container-agent container-manager container-frontend

bin/tornjak-agent: $(GO_FILES) vendor
	# Build hack because of flake of imported go module
	docker run --rm -v "${PWD}":/usr/src/myapp -w /usr/src/myapp -e GOOS=linux -e GOARCH=amd64 golang:1.16 /bin/sh -c "go build --tags 'sqlite_json' tornjak-backend/cmd/agent/agent.go; go build --tags 'sqlite_json' -mod=vendor -ldflags '-s -w -linkmode external -extldflags "-static"' -o bin/tornjak-agent tornjak-backend/cmd/agent/agent.go"


bin/tornjak-manager: $(GO_FILES) vendor
	# Build hack because of flake of imported go module
	docker run --rm -v "${PWD}":/usr/src/myapp -w /usr/src/myapp -e GOOS=linux -e GOARCH=amd64 golang:1.16 /bin/sh -c "go build --tags 'sqlite_json' -o tornjak-manager tornjak-backend/cmd/manager/manager.go; go build --tags 'sqlite_json' -mod=vendor -ldflags '-s -w -linkmode external -extldflags "-static"' -o bin/tornjak-manager tornjak-backend/cmd/manager/manager.go"


ui-agent:
	npm install --prefix tornjak-frontend
	rm -rf tornjak-frontend/build
	npm run build --prefix tornjak-frontend
	rm -rf ui-agent
	cp -r tornjak-frontend/build ui-agent

ui-manager:
	npm install --prefix tornjak-frontend
	rm -rf tornjak-frontend/build
	REACT_APP_TORNJAK_MANAGER=true npm run build --prefix tornjak-frontend
	rm -rf ui-manager
	cp -r tornjak-frontend/build ui-manager


vendor:
	go mod tidy
	go mod vendor

container-agent: bin/tornjak-agent ui-agent
	docker build --no-cache -f Dockerfile.add-frontend -t ${CONTAINER_TAG} .

container-agent-push: container-agent
	docker push ${CONTAINER_TAG}

container-manager: bin/tornjak-manager ui-manager
	docker build --no-cache -f Dockerfile.tornjak-manager -t ${CONTAINER_MANAGER_TAG} .

container-manager-push: container-manager
	 docker push ${CONTAINER_MANAGER_TAG}

release-container-agent-multiversions: bin/tornjak-agent ui-agent
	for i in $(shell cat SPIRE_BUILD_VERSIONS); do \
		./build-and-push-versioned-container.sh $$i ${CONTAINER_VERSION_IMAGEPATH}; \
	done

release-container-agent-multiversions-ghcr: bin/tornjak-agent ui-agent
	for i in $(shell cat SPIRE_BUILD_VERSIONS); do \
		./build-and-push-versioned-container.sh $$i ${CONTAINER_VERSION_GHCR_IMAGEPATH}; \
	done

container-frontend: 
	docker build --no-cache -f Dockerfile.add-frontend-auth -t ${CONTAINER_TAG_FRONTEND} --build-arg REACT_APP_API_SERVER_URI=${APP_SERVER_URI} --build-arg REACT_APP_AUTH_SERVER_URI=${AUTH_SERVER_URI} .

container-frontend-push: container-frontend
	docker push ${CONTAINER_TAG_FRONTEND}

clean:
	rm -rf bin/
	rm -rf tornjak-frontend/build
	rm -rf ui-agent/
	rm -rf ui-manager/

push:
	docker push ${CONTAINER_TAG}
	docker push ${CONTAINER_MANAGER_TAG}
	docker push ${CONTAINER_TAG_FRONTEND}