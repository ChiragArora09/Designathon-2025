import sys
import json5
import json
import openai

client = openai.AzureOpenAI(
    api_version="2024-02-01",
    azure_endpoint="https://mavericks-secureapi.azurewebsites.net/api/azureai",
    api_key="e68b8434df0335a2"
)

def generate_training_path():
    subject = sys.argv[1]
    topics = sys.argv[2]
    duration = int(sys.argv[3])
    start_date = sys.argv[4]

    prompt = f"""
    Return strictly valid JSON. Do not use Markdown or wrap the response in triple backticks. Only output JSON. Avoid trailing commas.
    Create a structured JSON training plan for fresh graduates on "{subject}" for {duration} days.

    Include the following structure:
    - For each day, define:
        - topic_title
        - description
        - Based on {start_date}, include date for each activity excluding Saturdays and Sundays
        - Compulsary online_activities: list of type 'quiz' or 'coding', each with title and details
        - Compulsary offline_activities: list of type 'lecture' or 'assignment', each with trainer_notes

    Guidelines:
    - Topics to be covered: {topics}
    - If subject is a soft skill, daily hours = 6, else 9
    - Place quizzes or coding challenges after major topics
    - Include a final challenge on the last day
    - Format must be valid JSON (not Markdown or stringified), and look like:
      {{
        "day_wise_plan": [
          {{
            "day": 1,
            "topic_title": "Introduction to Java",
            "description": "Overview of Java and its applications",
            "online_activities": [
              {{
                "type": "quiz",
                "title": "Java Basics Quiz",
                "details": "10 MCQs on Java intro"
              }}
            ],
            "offline_activities": [
              {{
                "type": "lecture",
                "trainer_notes": "Explain JVM, JDK, JRE"
              }}
            ]
          }}
        ]
      }}

    Provide ONLY the raw JSON output.
    """

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an expert training designer and return JSON structured for a SQL-based learning platform."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=2048,
        top_p=0.9,
        frequency_penalty=0.3,
    )

    raw_response = res.choices[0].message.content.strip()

    try:
        json_start = raw_response.find('{')
        cleaned = raw_response[json_start:]
        cleaned = cleaned.replace("‘", "'").replace("’", "'").replace("“", '"').replace("”", '"')
        parsed = json5.loads(cleaned)

        print(json.dumps(parsed))  # <-- This is key: Return as stdout to Node.js
    except Exception as e:
        print(json.dumps({"error": str(e), "raw": raw_response}))


if __name__ == "__main__":
    generate_training_path()
