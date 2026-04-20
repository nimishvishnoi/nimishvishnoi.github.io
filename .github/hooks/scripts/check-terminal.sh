#!/bin/bash

# Read input JSON from stdin
input=$(cat)

# Check if the tool being used is run_in_terminal
if echo "$input" | grep -q '"toolName":"run_in_terminal"'; then
  # Deny the tool use
  echo '{"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "deny", "permissionDecisionReason": "Terminal commands are not allowed on this static site project"}}'
  exit 0
else
  # Allow other tools
  echo '{"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "allow"}}'
  exit 0
fi