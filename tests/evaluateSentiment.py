import json

# Load the test dataset
with open("./testData/sentimentTestSamples.json", "r") as file:
    test_samples = json.load(file)

# Function to asynchronously call sentimentAnalyzer.js and get the sentiment score
async def get_sentiment_score_async(text):
    process = await asyncio.create_subprocess_exec('node', 'sentimentAnalyzer.js', text, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
    stdout, stderr = await process.communicate()
    if stderr:
        raise Exception(f"Error in sentiment analysis: {stderr.decode()}")
    return float(stdout.decode().strip())

# Evaluate the model asynchronously
async def evaluate_model_async():
    correct_predictions = 0
    for sample in test_samples:
        score = await get_sentiment_score_async(sample["text"])
        predicted_label = 'positive' if score > 0 else ('negative' if score < 0 else 'neutral')
        if predicted_label == sample["label"]:
            correct_predictions += 1

    # Calculate accuracy
    accuracy = (correct_predictions / len(test_samples)) * 100
    print(f"Accuracy: {accuracy}%")

import asyncio
if __name__ == "__main__":
    asyncio.run(evaluate_model_async())
