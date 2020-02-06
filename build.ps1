#!/usr/bin/env pwsh

Set-StrictMode -Version latest
$ErrorActionPreference = "Stop"

# get component data and set necessary variables
$component = Get-Content -Path "component.json" | ConvertFrom-Json
$package = Get-Content -Path "package.json" | ConvertFrom-Json
$buildImage="$($package.name):$($package.version)-build"
$container=$package.name

# create .npmrc with proper npm token 
if (-not (Test-Path -Path "docker/.npmrc")) {
    if ($env:NPM_TOKEN -ne $null) {
        $npmrcContent = "//registry.npmjs.org/:_authToken=$($env:NPM_TOKEN)`npackage-lock=false"
        Set-Content -Path "docker/.npmrc" -Value $npmrcContent
    } else {
        Copy-Item -Path "~/.npmrc" -Destination "docker"
    }
}

# build docker image
docker build -f docker/Dockerfile -t $buildImage .

# set environment variable
$environment = $component.environment
if ($env:ENVIRONMENT -ne $null) {
    $environment = $env:ENVIRONMENT
}

# remove container if it exists
if (docker ps -q -a -f name=$container) {
    docker rm $container --force
}
# create and copy compiled files, then destroy
docker run --name $container $buildImage /bin/bash -c $package.scripts."build:$environment"
# check is build successfull
if ($LastExitCode -ne 0) {
    exit 1
}
docker cp "$($container):/usr/src/app/dist" ./dist
docker rm $container
