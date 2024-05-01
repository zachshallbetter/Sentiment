// sentimentAnalyzer.js

// Importing necessary modules and utilities
import { enhancedNormalizeText, correctSpelling, tokenizeAndStem } from './utils/textUtilities';
import { TextAnalysisUtilities } from './utils/analysisUtilities';

// Create an instance of TextAnalysisUtilities
const textAnalysis = new TextAnalysisUtilities();

// Function to handle command line input for sentiment analysis
async function handleCommandLineInput() {
    if (process.argv.length > 2 && typeof process.argv[2] === 'string') {
        const inputText = process.argv[2];
        console.log(`Analyzing sentiment for: "${inputText}"`);

        // Process text through multiple stages and log transformations
        const textStages = [
            { type: "normalize", text: inputText },
            { type: "correctSpelling", text: null }, // Placeholder, will be set after normalization
            { type: "tokenizeAndStem", text: null }  // Placeholder, will be set after spelling correction
        ];

        // Normalize the text to prepare it for analysis without altering its sentiment
        textStages[0].result = enhancedNormalizeText(textStages[0].text);
        textStages[1].text = textStages[0].result;

        // Correct spelling while ensuring accuracy to avoid misleading the sentiment analysis
        textStages[1].result = correctSpelling(textStages[1].text);
        textStages[2].text = textStages[1].result;

        // Tokenize and stem the corrected text, being cautious with sentiment-altering stems
        textStages[2].result = tokenizeAndStem(textStages[2].text);

        // Calculate the sentiment score based on accurately reflected sentiment of the stemmed tokens
        const score = await textAnalysis.analyzeSentiment(textStages[2].result.join(' '));
        const changes = [];
        if (inputText !== textStages[1].result) {
            changes.push(`\x1b[31m- Changes Detected:\x1b[0m Original Input vs. Corrected Text`);
        }
        if (textStages[0].result !== textStages[1].result) {
            changes.push(`\x1b[33m- Changes Detected:\x1b[0m Normalized Text vs. Corrected Text`);
        }
        changes.forEach(change => console.log(change));
        console.log(`\x1b[32m- Final Sentiment Score:\x1b[0m ${score}`);
        
        // Refine sentiment category determination with nuanced analysis
        const sentimentDetails = await textAnalysis.determineSentimentCategory(score);

        console.log(`Sentiment Analysis:`, sentimentDetails);
    } else {
        console.log("No input text provided for sentiment analysis or input is not a valid string.");
    }
}
// Enhanced function to analyze sentiment from a file

// Call the function to handle command line input
handleCommandLineInput();

// Expected final result
// {
//     "actions": [
//       {
//         "actionType": "response",
//         "actionDetails": "Specific response based on category"
//       },
//       {
//         "actionType": "filter",
//         "actionDetails": "Exclude or highlight based on criteria"
//       }
//     ],
//     "textDetails": {
//       "originalText": "RawText",
//       "cleanedText": "CleanedText",
//       "normalizedText": "NormalizedText",
//       "correctedText": "CorrectedText",
//       "contextualInsights": "ContextualInsights",
//       "clarityCheckedText": "ClearText",
//       "expectedText": "ExpectedText",
//       "sentimentScore": "SentimentScore",
//       "categories": "CategoriesForAction"
//     }
//   }
