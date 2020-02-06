#!/usr/bin/env pwsh

Set-StrictMode -Version latest
$ErrorActionPreference = "Stop"

# get package data and set necessary variables
$package = Get-Content -Path "package.json" | ConvertFrom-Json
$testImage="$($package.name):$($package.version)-test"
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
Write-Host "before docker init"
docker build -f docker/Dockerfile -t $testImage .

# check is build successfull
if ($LastExitCode -ne 0) {
    exit 1
}

# remove container if it exists
if (docker ps -q -a -f name=$container) {
    docker rm $container --force
}
# run tests
docker run --name $container $testImage /bin/bash -c $package.scripts."test:ci"

# check if test was successfull
$logs = docker logs $container
docker rm $container
$testResult = $logs[$logs.Count - 1]
if ($testResult -notmatch "^TOTAL: [0-9]+ SUCCESS$") {
    Write-Host "Some test failed.`n$testResult"
    exit 1
}
