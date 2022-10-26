#!/bin/bash
cd "$(dirname "$0")/.."
#set -x

echo -e "$(
    git branch \
     | grep -E '^\*' \
     | sed -re 's/^\* *//' \
     | tr -d '\n'
    )\t."

cat .gitmodules |grep -F path|awk '{print $3}'|while read DIR; do  
  (
    cd $DIR
    echo -e "$(
    git branch \
     | grep -E '^\*' \
     | sed -re 's/^\* *//' \
     | tr -d '\n'
    )\t$DIR"
  ); 
done
