#!/usr/bin/env pwsh

Set-StrictMode -Version latest
$ErrorActionPreference = "Stop"

# get package data and set necessary variables
$package = Get-Content -Path "package.json" | ConvertFrom-Json
$buildImage="$($package.name):$($package.version)-build"
$testImage="$($package.name):$($package.version)-test"

# clean up build directories
if (Test-Path -Path "./dist") {
    Remove-Item -Recurse -Force "./dist"
}

# remove docker images
docker rmi $buildImage --force
docker rmi $testImage --force
docker image prune --force
