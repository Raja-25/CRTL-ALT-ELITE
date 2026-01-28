from openai import AzureOpenAI

client = AzureOpenAI(
    api_key="d42b20b2d07e43cba5b37db995cb70da",
    azure_endpoint="https://bh-in-openai-ctrlaltelite.openai.azure.com/",
    api_version="2024-02-01"
)

response = client.chat.completions.create(
    model="gpt-4.1-mini",  # deployment name
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hi"}
    ]
)

print(response.choices[0].message.content)
