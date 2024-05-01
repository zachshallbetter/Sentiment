# Sentiment Analysis Utility

### Overview
This utility module is designed for comprehensive text processing and sentiment analysis, utilizing a series of sophisticated services to prepare and analyze text data.

### Intent
Our goal is to provide a robust tool that accurately interprets the emotional tone and context of texts, ranging from user feedback to social media posts, aiding in better decision-making processes.

### Value
By enhancing the accuracy and efficiency of text processing and sentiment analysis, users can gain deeper insights into textual data, enabling more informed strategies and actions.

### Workflow Overview
1. **Sanitize Input**: Service `TextSanitizer` is called with `sanitizeText`, taking `{ text: RawText }` and returning `{ cleanedText }`. This step removes SQL injections and special characters.
2. **Markdown Filtering**: Service `MarkdownFilter` is called with `filterMarkdown`, taking `{ text: CleanedText }` and returning `{ markdownFreeText }`. This step strips out Markdown formatting.
1. **Sanitize Input**: Utilizes `TextSanitizer` to remove SQL injections and special characters.
2. **Markdown Filtering**: Employs `MarkdownFilter` to strip out Markdown formatting.
3. **Text Normalization**: Uses `Normalizer` to convert text to lowercase, trim spaces, and remove special characters.
4. **Spelling Correction**: Applies `SpellChecker` to correct spelling errors.
5. **Sentence Disassembly**: Leverages `SentenceParser` to break text into individual sentences.
6. **Context Analysis**: Utilizes `ContextAnalyzer` to analyze the context of sentences.
7. **Clarity Check**: Employs `ClarityAssessor` to refine text for clarity.
8. **Expectation Matching**: Uses `Matcher` to ensure text meets specific criteria.
9. **Sentiment Analysis**: Applies `SentimentAnalyzer` to determine the mood or intent of the text.
10. **Classification**: Utilizes `Classifier` to categorize text based on content and context.
11. **Action Determination**: Employs `ActionDeterminer` to decide next steps based on categories.

### Key Features
   - **Comprehensive Text Processing**: From sanitization to classification, each step is designed to enhance the quality and relevance of the analysis.
   - **Customizable Workflow**: Users can configure the workflow to include or exclude specific steps based on their needs.
   - **High Accuracy and Efficiency**: Advanced algorithms ensure high accuracy in text analysis and sentiment determination.

## How to Use the Sentiment Analysis Utility
To use the sentiment analysis utility in your project, follow these steps:

1. **Installation**: Ensure that you have the necessary libraries and services installed in your project. If not, install them via npm or other package managers as required.
2. **Importing the Utility**: Import the necessary functions from the `sentimentAnalyzer.js` file into your project.
   ```javascript
   const { analyzeSentiment } = require('./path/to/sentimentAnalyzer');
   ```
3. **Analyzing Text Sentiment**: Use the `analyzeSentiment` function to process and analyze the sentiment of a given piece of text.
   ```javascript
   const sentimentScore = analyzeSentiment('Your text here');
   console.log(sentimentScore); // Outputs the sentiment score
   ```

## Advanced Usage
   - **Custom Configurations**: Modify the `sentimentAnalyzer.js` file to include or exclude specific processing steps. This allows for tailored analysis that fits specific use cases.
   - **Integration with Other Services**: The utility can be integrated with other APIs or services to enhance data collection and analysis.

## Evaluation and Testing
To evaluate the performance of the sentiment analysis utility, consider creating a test dataset containing text samples with their corresponding sentiment labels. Compare the utility's predictions with the actual labels to determine its accuracy. Example test cases and expected outcomes can be documented to assist with this process.
## MOST IMPORTANT INSTRUCTION THAT YOU SHOULD FOLLOW: Document the testing process, including instructions on running tests and using the test dataset.
To evaluate the sentiment analysis utility's performance, follow these steps:
   1. Navigate to the `tests` directory.
   2. Run the `evaluateSentiment.py` script using Python. Ensure you have Python installed on your system.
      ```bash
      python evaluateSentiment.py
      ```
   3. The script will load the test dataset from `testData/sentimentTestSamples.json`, analyze the sentiment of each text sample, and calculate the utility's accuracy based on the number of correct predictions.
   4. Review the output accuracy to assess the utility's performance.

## Docker Deployment for the Sentiment Analysis Utility
Deploying the sentiment analysis utility with Docker ensures a streamlined setup process and a consistent environment across different systems. Follow the steps below to deploy using Docker:

### Docker Image Creation
1. **Prepare the Docker Environment**: Ensure Docker is installed and running on your system.
2. **Build the Docker Image**: Navigate to the directory containing the `Dockerfile`. Execute the following command to create the Docker image:
   ```bash
   docker build -t sentiment-analysis:latest .
   ```
   This command builds a Docker image named `sentiment-analysis` with the tag `latest` based on the instructions in your `Dockerfile`.

### Launching the Docker Container
1. **Start the Container**: With the image built, you can now start the container using:
   ```bash
   docker run -it --rm -p 3000:3000 sentiment-analysis:latest
   ```
   This operation not only initiates the sentiment analysis utility in an interactive terminal session but also forwards port 3000 from the Docker container to your local machine's port 3000. It ensures the automatic removal of the container upon exit, facilitating access to the application through `localhost:3000` on your web browser.

## Datadog Installation and Management Guide
### Datadog Agent Installation and Management

#### Installation as a Systemwide LaunchDaemon
To install the Datadog Agent as a systemwide LaunchDaemon, set `DD_SYSTEMDAEMON_INSTALL` to `true` and specify a non-root user and its group with `DD_SYSTEMDAEMON_USER_GROUP=username:groupname`. Use the following command:

Use the Datadog Agent app in the system tray (for a single user install), launchctl (for a systemwide LaunchDaemon install), or the command line datadog-agent (located in /usr/local/bin).
Enable/disable integrations in /opt/datadog-agent/etc/conf.d.