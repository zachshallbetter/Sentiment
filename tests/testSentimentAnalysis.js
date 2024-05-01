// sentimentAnalyzer.js

// Importing necessary modules and utilities
const natural = require('natural');
const fs = require('fs');
const { normalizeText } = require('./textUtilities');
const { loadCustomWordlist } = require('./analysisUtilities');

// Initializing sentiment analyzer components
const Analyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;
const aggressiveTokenizer = new natural.AggressiveTokenizer();
const wordTokenizer = new natural.WordTokenizer();
const stopwords = natural.stopwords;
const customWordlistPath = 'config/customWordlist.json';
const formattedWordlist = loadCustomWordlist(customWordlistPath);

// Initialize the sentiment analysis tool with custom wordlist support
let customSentimentWordlist = {};
Object.entries(formattedWordlist).forEach(([sentiment, words]) => {
    Object.entries(words).forEach(([word, score]) => {
        customSentimentWordlist[word] = score;
    });
});

// Initialize the sentiment analysis tool with custom wordlist support
const analyzer = new Analyzer("English", stemmer, "afinn", { wordlist: customSentimentWordlist });

// Function to analyze the sentiment of a given text
function analyzeSentiment(text) {
    // Preprocess the text before sentiment analysis
    const normalizedText = normalizeText(text);
    // Tokenization and stemming with both tokenizers
    const aggressiveTokens = aggressiveTokenizer.tokenize(normalizedText);
    const wordTokens = wordTokenizer.tokenize(normalizedText);
    const stemmedAggressiveTokens = aggressiveTokens.map(token => stemmer.stem(token));
    const stemmedWordTokens = wordTokens.map(token => stemmer.stem(token));
    // Stopword removal for both token sets
    const filteredAggressiveTokens = stemmedAggressiveTokens.filter(token => !stopwords.includes(token));
    const filteredWordTokens = stemmedWordTokens.filter(token => !stopwords.includes(token));
    // Calculate sentiment score using the custom wordlist for both token sets
    const aggressiveScore = analyzer.getSentiment(filteredAggressiveTokens);
    const wordScore = analyzer.getSentiment(filteredWordTokens);
    // Return the average of aggressiveScore and wordScore as a single sentiment score
    const combinedScore = (aggressiveScore + wordScore) / 2;
    return combinedScore;
}

// Export the function for use in other parts of the application
module.exports = analyzeSentiment;
