from Databricks import DatabricksClient
import pandas as pd
import json
from collections import defaultdict
from llm import LLM

cli = DatabricksClient()
model = LLM("gpt-4.1-mini")
# df = cli.execute_query("""select q1.quiz_id, q1.question_id, q1.question_text, q2.quiz_title, q3.attempt_number, q4.confidence_level, q4.is_correct, q4.hint_used, q4.time_taken_seconds from hackathon.apac.quiz_questions q1 
# join hackathon.apac.quizzes q2 on q1.quiz_id=q2.quiz_id
# join hackathon.apac.quiz_attempts q3 on q1.quiz_id=q3.quiz_id
# join hackathon.apac.quiz_responses q4 on q1.question_id=q4.question_id""")

df = pd.read_csv("test_data.csv")
scores = {}

# Grouping the DataFrame once before processing
df = df.groupby('quiz_title').apply(lambda x: x.sample(n=10, random_state=42)).reset_index(drop=True)

# print(df.shape)
grouped = df.drop(["quiz_id", "question_id"], axis=1).groupby('quiz_title')

# Create a dictionary with quiz titles as keys
quiz_data = {}

for quiz_title, group in grouped:
    # Prepare the data for the current quiz_title
    quiz_data[quiz_title] = group[['question_text', 'is_correct', 'attempt_number', 
                                   'hint_used', 'confidence_level', 'time_taken_seconds']].to_dict(orient='records')

# Convert to JSON format only once
json_data = json.dumps(quiz_data, indent=2)

# Define system and user prompt once
system_prompt = """You are an expert skill assessment evaluator.

INPUT:
You will receive a JSON object where:
- Each top-level key represents a skill (quiz title).
- The value for each key is a list of question attempts related to that skill.
- Each question attempt contains behavioral data such as correctness, confidence, hint usage, and time taken.

TASK:
For each quiz title (skill):
1. Analyze the associated attempts.
2. Assign a proficiency rating for that skill on a scale from 0 to 10.

SCORING SCALE:
- 0–2  : Very weak
- 3–4  : Weak
- 5–6  : Average
- 7–8  : Strong
- 9–10 : Excellent

GROUPING:
Group skills into **general categories**:
- AI (e.g., "AI Applications Quiz", "AI Ethics Quiz")
- Life Skills (e.g., "Career Research Quiz", "Budgeting Quiz", "Goal Setting Quiz")
- Social Media (e.g., "Creating Posts Quiz", "Social Media Overview Quiz")
- Technical Skills (e.g., "Web Browsers Quiz", "Spreadsheets Intro Quiz")
- Security Awareness (e.g., "Password Basics Quiz", "Phishing Awareness Quiz")

Return **only the top 5 general skill categories** with their corresponding rating.

OUTPUT FORMAT (STRICT):
{
  "top_5_skills": [
    {"skill": "<Skill Category>", "rating": <rating out of 10>},
    ...
  ]
}

The output should be **strictly** in this format, and you should include only the **top 5 skills** based on their proficiency ratings.

"""

user_prompt = "Evaluate the following skill data and return the skill ratings as instructed."

# Send a single request to the model with all quiz data
response = model.chat(system_prompt, user_prompt + str(json_data))

# Process the response and store the results in `scores`
# print(response)
try:
    scores = json.loads(response)  # Assuming the model returns JSON formatted output
    print(scores["top_5_skills"])
except json.JSONDecodeError:
    print("Error parsing the model response.")