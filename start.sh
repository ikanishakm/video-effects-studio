#!/bin/sh
# Start script for Railway - reads PORT env variable
exec npx remotion studio --port "$PORT"
