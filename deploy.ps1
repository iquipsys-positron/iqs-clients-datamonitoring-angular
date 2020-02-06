#!/usr/bin/env pwsh

Set-StrictMode -Version latest
$ErrorActionPreference = "Stop"

# get component data and set necessary variables
$component = Get-Content -Path "component.json" | ConvertFrom-Json
$package = Get-Content -Path "package.json" | ConvertFrom-Json
$buildImage="$($package.name):$($package.version)-build"
$container=$package.name

# check for dist folder 
if (-not (Test-Path -Path "./dist")) {
    Write-Host "Error! dist folder not found in $(Get-Location)"
    exit 1
}

# get s3 bucket name
$s3Bucket = $component.s3_bucket
if ($env:S3_BUCKET -ne $null) {
    $s3Bucket = $env:S3_BUCKET
}

# check if current aws profile have access to s3 bucket and switch profile if it's requered
$s3BucketAcl = aws s3api get-bucket-acl --bucket $s3Bucket | ConvertFrom-Json
if ($s3BucketAcl -eq $null) {
    # set environment variable
    $environment = $component.environment
    if ($env:ENVIRONMENT -ne $null) {
        $environment = $env:ENVIRONMENT
    }

    # set current aws account
    if ($env:ENVIRONMENT -eq "stage") {
        aws configure set aws_access_key_id $env:STAGE_AWS_ACCESS_KEY_ID
        aws configure set aws_secret_access_key $env:STAGE_AWS_SECRET_ACCESS_KEY
    } elseif ($env:ENVIRONMENT -eq "prod") {
        aws configure set aws_access_key_id $env:PROD_AWS_ACCESS_KEY_ID
        aws configure set aws_secret_access_key $env:PROD_AWS_SECRET_ACCESS_KEY
    }
}

# upload to s3
aws s3 sync ./dist/$($package.name) s3://$s3Bucket/$($component.s3_app_name) --delete
