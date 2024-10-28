#!/bin/bash

# Define variables
API_KEY="your_api_key"
ENDPOINT="https://newsapi.org/v2/everything"
POST_URL="http://localhost:3001/news"
DATE=$(date -v -1d +%Y-%m-%d)  # Get yesterday's date on macOS
STATES=("AL" "AK" "AZ" "AR" "CA" "CO" "CT" "DE" "FL" "GA" "HI" "ID" "IL" "IN" "IA" "KS" "KY" "LA" "ME" "MD" "MA" "MI" "MN" "MS" "MO" "MT" "NE" "NV" "NH" "NJ" "NM" "NY" "NC" "ND" "OH" "OK" "OR" "PA" "RI" "SC" "SD" "TN" "TX" "UT" "VT" "VA" "WA" "WV" "WI" "WY") # List of states
#STATES=("AL" "AK")
# Initialize counters
inserted_count=0
duplicated_count=0
total_response_size=0

# Loop through each state
for state in "${STATES[@]}"; do
    # Fetch articles from NewsAPI
    response=$(curl -s -G "$ENDPOINT" \
        --data-urlencode "q=$state legislation" \
        --data-urlencode "from=$DATE" \
        --data-urlencode "apiKey=$API_KEY")

    # Print the size of the response
    response_size=$(echo "$response" | wc -c)
    total_response_size=$((total_response_size + response_size))
    echo "Response size for $state: ${response_size} bytes"

    # Extract and limit articles from response
    while read -r article; do
        title=$(echo "$article" | jq -r '.title')

        # Skip if the title contains [Removed]
        if [[ "$title" == *"[Removed]"* ]]; then
            echo "Skipping article with title: $title"
            continue
        fi

        date=$(echo "$article" | jq -r '.publishedAt')
        state=$state  # Assign the state variable
        description=$(echo "$article" | jq -r '.description')
        link=$(echo "$article" | jq -r '.url')
        topic=$(echo "$article" | jq -r '.source.name')

        # Create JSON payload
        payload=$(jq -n \
            --arg title "$title" \
            --arg date "$date" \
            --arg state "$state" \
            --arg description "$description" \
            --arg link "$link" \
            --arg topic "$topic" \
            '{
                title: $title,
                date: $date,
                state: $state,
                description: $description,
                link: $link,
                topic: $topic
            }')
#        echo "$payload"

        # Post to backend
        http_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$POST_URL" \
                    -H "Content-Type: application/json" \
                    -d "$payload")

        # Check if the POST request was successful
        #echo "POST response code: $http_code"
        if [ "$http_code" -eq 409 ]; then
            duplicated_count=$((duplicated_count + 1))
        elif [ "$http_code" -eq 201 ]; then
            inserted_count=$((inserted_count + 1))
        else
            echo "Unexpected response code: $http_code"
        fi
    done < <(echo "$response" | jq -c '.articles[]')
done

# Echo the summary
echo "Total news articles added: $inserted_count"
echo "Total duplicated articles skipped: $duplicated_count"
echo "Total response size for all states: ${total_response_size} bytes"