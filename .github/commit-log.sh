#!/bin/bash

HEAD="${1}"
BASE="${2}"

git fetch origin "$HEAD" >/dev/null 2>&1
git fetch origin "$BASE" >/dev/null 2>&1

COMMIT_LOG=$(git log "origin/$BASE..origin/$HEAD" --no-merges --pretty=format:"%s" | \
  sed -E 's/ *\(#[0-9]+\)*//g' | \
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

    # Trim leading/trailing non-alphanumeric characters, except parentheses
    gsub(/^[^[:alnum:]()]+|[^[:alnum:]()]+$/, "", output_line);

    # Append tickets or placeholder to the output
    printf "- %s (%s)\n", output_line, tickets ? tickets : "CMDCT-";
  }')

# No diff between branches, so exit
if [ -z "$COMMIT_LOG" ]; then
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

  # Escape slashes and other special characters for sed
  ESCAPED_REPLACEMENT=$(printf '%s\n' "$REPLACEMENT" | sed 's/[\/&]/\\&/g')
  TEMPLATE=$(echo "$TEMPLATE" | sed "s|^$SEARCH|$ESCAPED_REPLACEMENT|")
fi

# Strip comments
TEMPLATE=$(echo "$TEMPLATE" | perl -0777 -pe 's/^[ \t]*<!--.*?-->[ \t]*\n?//gm')

# Replace commits placeholder
export COMMIT_LOG
BODY=$(perl -pe 'BEGIN { undef $/; $commit = $ENV{"COMMIT_LOG"} } s/- Description of work \(CMDCT-\)/$commit/' <<< "$TEMPLATE")

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
  git show "origin/$BASE:$FILE" > "$TEMP_DIR/yarn.lock.new"
  git show "origin/$HEAD:$FILE" > "$TEMP_DIR/yarn.lock.old"
  git show "origin/$BASE:$DIRNAME/package.json" > "$TEMP_DIR/package.json.new"
  git show "origin/$HEAD:$DIRNAME/package.json" > "$TEMP_DIR/package.json.old"

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
