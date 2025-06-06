#!/bin/bash

HEAD="${1}"
BASE="${2}"

git fetch origin $HEAD >/dev/null 2>&1
git fetch origin $BASE >/dev/null 2>&1

COMMIT_LOG=$(git log origin/$BASE..origin/$HEAD --no-merges --pretty=format:"%s" | \
  sed -E 's/ *\(#[0-9]+\)*//g' | \
  awk '{
    orig_line = $0;
    line = tolower($0);

    # Find ticket in commit message, case-insensitive
    match(line, /cmdct[ -]?[0-9]+/);

    if (RSTART > 0) {
      ticket = substr(orig_line, RSTART, RLENGTH);
      ref = substr(line, RSTART, RLENGTH);

      # Extract number after "cmdct"
      gsub(/[^0-9]/, "", ref);

      # Remove original ticket
      gsub(ticket, "", orig_line);

      # Remove empty square brackets
      gsub(/\[\]/, "", orig_line);

      # Trim leading/trailing spaces, dashes, and colons
      gsub(/^[ \-:]+|[ \-:]+$/, "", orig_line);

      # Add ticket to the end
      printf "- %s (CMDCT-%s)\n", orig_line, ref;
    } else {
      # Add placeholder if no ticket in commit message
      printf "- %s (CMDCT-)\n", orig_line;
    }
  }')

# No commits
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
BODY="${TEMPLATE//- Description of work (CMDCT-)/$COMMIT_LOG}"

# Create dependency updates table
YARN_LOCK_FILES=$(git diff --name-only origin/$BASE..origin/$HEAD -- '*.yarn.lock' '*/yarn.lock')

TABLE_HEADERS="| package | prior version | upgraded version |\n|-|-|-|"
TABLE_BODY=""

for FILE in $YARN_LOCK_FILES; do
  DIFF=$(git diff origin/$BASE..origin/$HEAD -- "$FILE")

  PARSED=$(echo "$DIFF" | awk '
    function print_diff() {
      # Before overwriting pkg, if previous pkg and versions differ, print
      if (pkg != "" && old != "" && new != "" && old != new) {
        printf "| %s | %s | %s |\n", pkg, old, new;
      }
    }

    BEGIN {
      pkg = "";
      old = "";
      new = "";
    }
    {
      # Get package name
      if ($0 ~ /^[^+-].*:\s*$/) {
        print_diff();

        pkg_line = $0;
        sub(/:\s*$/, "", pkg_line);
        sub(/@.*$/, "", pkg_line);
        gsub(/^[ \t]+|[ \t]+$/, "", pkg_line);
        pkg = pkg_line;
        old = "";
        new = "";
      }
      # Get old version number
      else if ($0 ~ /^-  version /) {
        old_line = $0;
        sub(/^-  version "?/, "", old_line);
        sub(/"?$/, "", old_line);
        old = old_line;
      }
      # Get new version number
      else if ($0 ~ /^\+  version /) {
        new_line = $0;
        sub(/^\+  version "?/, "", new_line);
        sub(/"?$/, "", new_line);
        new = new_line;
      }
    }
    END {
      print_diff();
    }
  ')

  while IFS= read -r line; do
    if ! echo "$TABLE_BODY" | grep -Fxq "$line"; then
      TABLE_BODY+="$line"
    fi
  done <<< "$PARSED"
done

if [ -z "$TABLE_BODY" ]; then
  # Remove dependency section entirely if table is empty
  BODY=$(echo "$BODY" | perl -0777 -pe 's/^### Dependency updates\b.*?(?=^### |\z)//sm')
else
  # Insert table in dependency section
  REPLACEMENT=$(cat <<EOF
### Dependency updates

$TABLE_HEADERS
$TABLE_BODY

EOF
)
  BODY=$(echo "$BODY" | perl -0777 -pe 's/^### Dependency updates\b.*?(?=^### |\z)/'"$REPLACEMENT"'/sm')
fi

echo "$BODY"
