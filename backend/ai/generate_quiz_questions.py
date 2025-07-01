import sys
import json5
import json
import openai

client = openai.AzureOpenAI(
    api_version="2024-02-01",
    azure_endpoint="https://mavericks-secureapi.azurewebsites.net/api/azureai",
    api_key="e68b8434df0335a2"
)

def generate_quiz():
    topic_title = sys.argv[1]

    prompt = f"""
    You are an expert training quiz designer. 
    Return strictly valid JSON. Do not wrap with Markdown or triple backticks.

    Generate 2 multiple-choice, easy to intermediate level difficulty, quiz questions on:
    Topic: "{topic_title}"
    Context: For a college graduate who just completed intermediate level training on {topic_title} topic.

    Each question should have:
      - question_text
      - options: list of 4 options (A, B, C, D)
      - correct_answer: letter (A/B/C/D)

    ✅ Output must be valid JSON:
    {{
      "quiz": [
        {{
          "question_text": "What is ...?",
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
          "correct_answer": "B"
        }},
        ...
      ]
    }}
    """

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You generate valid JSON quizzes for a training platform."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.5,
        max_tokens=2048
    )

    raw_response = res.choices[0].message.content.strip()

    try:
        json_start = raw_response.find('{')
        cleaned = raw_response[json_start:]
        cleaned = cleaned.replace("‘", "'").replace("’", "'").replace("“", '"').replace("”", '"')

        parsed = json5.loads(cleaned)
        print(json.dumps(parsed))  # stdout for Node

    except Exception as e:
        print(json.dumps({"error": str(e), "raw": raw_response}))


if __name__ == "__main__":
    generate_quiz()
