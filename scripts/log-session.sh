#!/bin/bash
# SageAAA-2026 Session Logger
# Usage: ./log-session.sh "summary" "details"

TURSO_TOKEN="eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzMxMDM2NzcsImlkIjoiMDE5Y2Q1MzQtM2IwMS03NTQ0LWEyYmYtMmNlMjZjYTNkNDdiIiwicmlkIjoiZWI3MDczNDItMzVjYi00MmI4LWIxNjAtNzcyNGRjMTdjZjQyIn0.EyxPqyeJjCJ1CETclK_LGsIU-sXosJxHtWe54QDUW-2JFo5pc6K27rhSgZHqeiMIQZa7yUuWbjDo9l_9tE41Aw"
TURSO_URL="https://agents-bifill.aws-us-east-1.turso.io"

SUMMARY="$1"
DETAILS="$2"
DATE=$(date +%Y-%m-%d)

if [ -z "$SUMMARY" ]; then
    echo "Usage: ./log-session.sh \"summary\" \"details\""
    exit 1
fi

# Escape quotes for JSON
DETAILS_ESCAPED=$(echo "$DETAILS" | sed 's/"/\\"/g' | tr '\n' ' ')

curl -s -X POST "$TURSO_URL" \
    -H "Authorization: Bearer $TURSO_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"statements\":[{\"q\":\"INSERT INTO daily_log (agent_id, date, summary, details, created_at) VALUES (?, ?, ?, ?, datetime('now'))\",\"params\":[\"sageaaa-2026\",\"$DATE\",\"$SUMMARY\",\"$DETAILS_ESCAPED\"]}]}"

echo ""
