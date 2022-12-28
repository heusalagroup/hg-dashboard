#!/bin/bash
cd "$(dirname "$0")/.."
#set -x

FORMAT='%-16s %-12s %-30s %s\n'

ROOT_BRANCH="$(
    git branch \
     | grep -E '^\*' \
     | sed -re 's/^\* *//' \
     | tr -d '\n'
)"

printf "$FORMAT" "$ROOT_BRANCH" "." "." "."

cat .gitmodules |grep -F path|awk '{print $3}'|while read DIR; do  
  (
    cd $DIR
    MODULE=$(echo $DIR|sed -re 's@^.*/src/@@'|tr '/' '.')
    CONTEXT=$(echo $DIR|awk -F'/' '{print $1}')
    BRANCH="$(
      git branch \
       | grep -E '^\*' \
       | sed -re 's/^\* *//' \
       | tr -d '\n'
    )"

    printf "$FORMAT" "$BRANCH" "$CONTEXT" "$MODULE" "$DIR"
  ); 
done
