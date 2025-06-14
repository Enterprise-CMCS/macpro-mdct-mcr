#!/bin/bash

# Usage:
#   ./.github/commit-log.sh head_branch base_branch
#   ./.github/commit-log.sh head_branch base_branch --local
# 
# Use --local to compare local branches

HEAD="${1}"
BASE="${2}"
IS_LOCAL=false

if [[ "$3" == "--local" ]]; then
  IS_LOCAL=true
fi

if [ "$IS_LOCAL" = false ]; then
  PREFIX="origin/"
else
  PREFIX=""
fi

# Validate branches
if ! git rev-parse --verify "${PREFIX}${HEAD}" >/dev/null 2>&1; then
  echo "Branch ${PREFIX}${HEAD} not found"
  # Use code 2 in GitHub Action for message output
  exit 2
fi

if ! git rev-parse --verify "${PREFIX}${BASE}" >/dev/null 2>&1; then
  echo "Branch ${PREFIX}${BASE} not found"
  # Use code 3 in GitHub Action for message output
  exit 3
fi

HEAD_REF="${PREFIX}${HEAD}"
BASE_REF="${PREFIX}${BASE}"

# Create log without merge commits
COMMIT_LOG=$(git log "$BASE_REF..$HEAD_REF" --no-merges --pretty=format:"%s" | \
  # Remove PR link appended on merge by GitHub, e.g. (#123)
  sed -E 's| \(#[0-9]+\)$||g' | \
  awk '{
    orig_line = $0;
    lowercased_line = tolower($0);
    tickets = "";
    output_line = orig_line;

    # Remove original ticket(s)
    gsub(/[Cc][Mm][Dd][Cc][Tt][ -]?[0-9]+/, "", output_line);

    # Remove square brackets and contents leftover from ticket removal
    gsub(/\[[^]]*\]/, "", output_line);

    # Match all tickets using the lowercased line
    while (match(lowercased_line, /cmdct[ -]?[0-9]+/)) {
      ticket = substr(lowercased_line, RSTART, RLENGTH);
      ref = ticket;

      # Normalize ticket number
      gsub(/[^0-9]/, "", ref);
      ticket_str = "CMDCT-" ref;

      # Create a tickets string
      if (tickets !~ ticket_str) {
        tickets = tickets ? tickets ", " ticket_str : ticket_str;
      }

      # Remove matched ticket, on to next match
      lowercased_line = substr(lowercased_line, RSTART + RLENGTH);
    }

    # Trim leading/trailing non-alphanumeric characters,
    # except parentheses and double quotes
    gsub(/^[^[:alnum:]()"]+|[^[:alnum:]()"]+$/, "", output_line);

    # Append tickets or placeholder to the output
    printf "- %s (%s)\n", output_line, tickets ? tickets : "CMDCT-";
  }')

# No diff between branches, so exit
if [ -z "$COMMIT_LOG" ]; then
  echo "No commits between ${HEAD_REF} and ${BASE_REF}"
  # Use code 1 in GitHub Action for message output
  exit 1
fi

TEMPLATE_PATH=".github/PULL_REQUEST_TEMPLATE/${BASE}-deployment.md"
DEFAULT_TEMPLATE=".github/PULL_REQUEST_TEMPLATE/val-deployment.md"

if [ -f "$TEMPLATE_PATH" ]; then
  TEMPLATE=$(cat "$TEMPLATE_PATH")
else
  TEMPLATE=$(cat "$DEFAULT_TEMPLATE")
  # Replace PR heading
  SEARCH="## val release"
  REPLACEMENT="## ${BASE} release"

  # Escape special character `&` for sed
  ESCAPED_REPLACEMENT=$(printf '%s\n' "$REPLACEMENT" | sed -E 's|[&]|\\&|g')
  TEMPLATE=$(echo "$TEMPLATE" | sed -E "s|^$SEARCH|$ESCAPED_REPLACEMENT|")
fi

# Replace commits placeholder
export COMMIT_LOG
BODY=$(
  perl -0777 -pe '
    BEGIN {
      $commit = $ENV{"COMMIT_LOG"};
    }

    s/- Description of work \(CMDCT-\)/$commit/
  ' <<< "$TEMPLATE"
)

# Create dependency updates table
TABLE_HEADERS="| directory | package | prior version | upgraded version |
|-|-|-|-|"
TABLE_BODY=""

# Check for yarn.lock files in diff
YARN_LOCK_FILES=$(
  git diff --name-only "origin/$BASE..origin/$HEAD" \
    -- "**/yarn.lock" "yarn.lock"
)

for FILE in $YARN_LOCK_FILES; do
  DIRNAME=$(dirname "$FILE")

  # Create temp copies of yarn.lock and package.json files
  TEMP_DIR=$(mktemp -d)
  trap 'rm -Rf "$TEMP_DIR"' EXIT
  git show "$BASE_REF:$FILE" > "$TEMP_DIR/yarn.lock.new"
  git show "$HEAD_REF:$FILE" > "$TEMP_DIR/yarn.lock.old"
  git show "$BASE_REF:$DIRNAME/package.json" > "$TEMP_DIR/package.json.new"
  git show "$HEAD_REF:$DIRNAME/package.json" > "$TEMP_DIR/package.json.old"

  # Run diff script
  DIFF_OUTPUT=$(
    node ./scripts/yarn-lock-diff.cjs \
      "$TEMP_DIR/yarn.lock.new" \
      "$TEMP_DIR/yarn.lock.old" \
      "$TEMP_DIR/package.json.new" \
      "$TEMP_DIR/package.json.old"
  )

  if [[ -n "$DIFF_OUTPUT" && "$DIFF_OUTPUT" != "[]" ]]; then
    if [ "$DIRNAME" = "." ]; then
      DIRECTORY="/"
    else
      DIRECTORY="/$DIRNAME"
    fi

    ADD_DIRNAME=$(
      echo "$DIFF_OUTPUT" | jq --arg d "$DIRECTORY" '
        .[] |= . + {directory: $d}
      '
    )
    PARSED_ROW=$(
      echo "$ADD_DIRNAME" | jq -r '
        .[] |
        "| `\(.directory)` | `\(.package)` | \(.priorVersion) | \(.upgradedVersion) |"
      '
    )
    TABLE_BODY+="$PARSED_ROW"$'\n'
  fi
done

# Remove dependency updates placeholder
BODY=$(echo "$BODY" | perl -0777 -pe 's/^### Dependency updates\b.*?(?=^### |\z)//sm')

if [ -n "$TABLE_BODY" ]; then
  TABLE_BODY=$(echo "$TABLE_BODY" | sort -u)

  # Insert dependency updates table
  BODY+=$'\n\n### Dependency updates\n\n'
  BODY+="$TABLE_HEADERS"
  BODY+="$TABLE_BODY"
fi

echo "$BODY"
