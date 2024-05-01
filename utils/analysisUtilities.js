import { promises, constants } from 'fs';
import { AggressiveTokenizer, BayesClassifier, PorterStemmer, SentimentAnalyzer } from 'natural';
import { analyzeSentiment } from '../analyzer';
import { correctSpelling, enhancedNormalizeText } from '/utils/textUtilities';

class TextAnalysisUtilities {
    constructor() {
        this.tokenizer = new AggressiveTokenizer();
        this.classifier = new BayesClassifier();
        this.stemmer = PorterStemmer;
        this.analyzer = new SentimentAnalyzer("English", this.stemmer, "afinn");
    }

    async fileExists(filePath) {
        try {
            await promises.access(filePath, constants.F_OK | constants.R_OK);
            console.log(`File at ${filePath} found and accessible.`);
            return true;
        } catch (error) {
            console.error(`File at ${filePath} not found or not accessible:`, error);
            return false;
        }
    }

    async comprehendWiderContext(text) {
        const preprocessedText = enhancedNormalizeText(text);
        const correctedText = correctSpelling(preprocessedText);
        const postProcessedText = this.postProcessText(correctedText);
        const tokens = this.tokenizer.tokenize(postProcessedText);
        const stemmedTokens = tokens.map(token => this.stemmer.stem(token));

        const sentimentScore = await analyzeSentiment(stemmedTokens.join(' '));
        console.log(`Sentiment score: ${sentimentScore}`);

        let frequencyMap = stemmedTokens.reduce((acc, token) => {
            acc[token] = (acc[token] || 0) + 1;
            return acc;
        }, {});

        let mainTopic = Object.entries(frequencyMap).sort((a, b) => b[1] - a[1])[0][0];
        console.log(`Main topic: ${mainTopic}`);

        const contextEnhancedSentiment = await analyzeSentiment(stemmedTokens.join(' '), mainTopic);
        console.log(`Context-enhanced sentiment score: ${contextEnhancedSentiment}`);

        return {
            sentiment: contextEnhancedSentiment,
            topic: mainTopic
        };
    }

    async determineSentimentCategory(sentimentScore) {
        const sentimentRanges = [
            { min: 0.75, category: "Very Positive", explanation: "This score is classified as very positive." },
            { min: 0.25, category: "Positive", explanation: "This score is classified as positive." },
            { min: -0.25, category: "Neutral", explanation: "This score is classified as neutral." },
            { min: -0.75, category: "Negative", explanation: "This score is classified as negative." },
            { min: -Infinity, category: "Very Negative", explanation: "This score is classified as very negative." },
            { min: -Infinity, category: "Unknown", explanation: "This score is not within any known range." }
        ];
        const customWordlist = require('../config/customWordlist.json');
        const sentimentCategories = Object.keys(customWordlist);
        sentimentCategories.forEach(category => {
            const min = customWordlist[category];
            sentimentRanges.push({ min, category, explanation: `This score is classified as ${category}.` });
        });

        const { category, explanation } = sentimentRanges.find(range => sentimentScore > range.min);
        console.log(`Sentiment category: ${category}, Explanation: ${explanation}`);
        return { category, explanation, sentimentScore };
    }

    saveClassifier(classifier, filePath) {
        classifier.save(filePath, function(err) {
            if (err) {
                console.error("Error saving classifier:", err);
            } else {
                console.log(`Classifier saved to ${filePath}`);
            }
        });
    }

    loadClassifier(filePath, callback) {
        BayesClassifier.load(filePath, null, function(err, loadedClassifier) {
            if (err) {
                console.error("Error loading classifier:", err);
            } else {
                callback(loadedClassifier);
                console.log("Classifier loaded.");
            }
        });
    }

    postProcessText(text) {
        let correctedText = text;
        const customCorrections = require('../config/customWordlist.json').corrections;
        Object.keys(customCorrections).forEach(pattern => {
            const regex = new RegExp(pattern, "gi");
            correctedText = correctedText.replace(regex, customCorrections[pattern]);
        });
        
        return correctedText;
    }

    async analyzeSentiment(text) {
        console.log("Analyzing sentiment for the text.");
        const textUtilities = require('./textUtilities');
        const sentimentAnalyzer = require('../analyzer');

        const normalizedText = textUtilities.enhancedNormalizeText(text);
        const correctedText = textUtilities.correctSpelling(normalizedText);
        const tokens = textUtilities.tokenizeAndStem(correctedText);

        try {
            const sentimentScore = await sentimentAnalyzer.analyzeSentiment(tokens.join(' '));
            return sentimentScore;
        } catch (error) {
            console.error("Error in sentiment analysis:", error);
            throw error;
        }
    }
}

export const TextAnalysisUtilities = TextAnalysisUtilities;
