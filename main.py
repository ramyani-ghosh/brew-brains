import datetime
import os
import threading
import time
import webbrowser
import speech_recognition as sr
from nltk import RegexpTokenizer
from nltk.corpus import stopwords
from textblob import TextBlob as blob
import eng_spacysentiment
from wordcloud import WordCloud
import matplotlib.pyplot as plt
from collections import Counter
from PIL import Image


r = sr.Recognizer()
nlp = eng_spacysentiment.load()

very_pos_words = []
pretty_pos_words = []
pos_words = []
neg_words = []
pretty_neg_words = []
very_neg_words = []
class SimpleGroupedColorFunc(object):
    def __init__(self, color_to_words, default_color):
        self.word_to_color = {word: color
                              for (color, words) in color_to_words.items()
                              for word in words}

        self.default_color = default_color

    def __call__(self, word, **kwargs):
        return self.word_to_color.get(word, self.default_color)

def microphone(duration=40):
    # exec_end_time = datetime.datetime.now() + datetime.timedelta(seconds=10)
    end_time = time.time() + duration
    with open("speechfile.txt", "w") as f:
        while time.time() < end_time:
            try:
                with sr.Microphone() as source:
                    r.adjust_for_ambient_noise(source, duration=0.3)
                    print("Recording... ")
                    audio = r.listen(source)
                    text = r.recognize_google(audio, language="en-US")
                    text = text.lower()
                    if text == "stop":
                        break
                    f.write(text)
                    print(text)
            except sr.RequestError as e:
                print("Could not request results; {0}".format(e))
            except sr.UnknownValueError:
                print("Speak!! I can't hear you.")




# creating function that tokenizes text, lowers letters and removes punctuation, disgarding words included in stopword list
def preprocess_text(text):
    # Tokenise words while ignoring punctuation
    tokeniser = RegexpTokenizer(r'\w+')
    tokens = tokeniser.tokenize(text)

    data_token = [token.lower() for token in tokens]
    processed_words = [w for w in data_token if not w in stop_words]
    return processed_words

def wordcloud(cleaned_text):
    # convert list to string and generate
    unique_string = (" ").join(cleaned_text)
    word_could_dict = Counter(cleaned_text)
    color_to_words = {
        '#5BBF53': very_pos_words,
        '#7FC479' : pretty_pos_words,
        '#9DCA99' : pos_words,
        '#E39593' : neg_words,
        '#DC7E7B': pretty_neg_words,
        '#C54743': very_neg_words

    }
    # Neutral words will be grey (with sentiment between -1 and 1 inclusive)
    default_color = '#C3C2C1'
    wordcloud = WordCloud(background_color="rgba(255,255,255,255)", mode="RGBA", width=295, height=399, collocations=False, random_state=100,
                          stopwords=stop_words).generate(unique_string)
    grouped_color_func = SimpleGroupedColorFunc(color_to_words, default_color)

    # Apply our color function to the word cloud
    wordcloud.recolor(color_func=grouped_color_func)
    wordcloud_image = wordcloud.to_image()
    plt.figure(figsize=(15, 8))
    plt.imshow(wordcloud_image,interpolation="bilinear")
    plt.axis("off")
    # plt.show()
    wordcloud.to_file("image.png")
# very-pos 0.6 ~ 1 29F508
# pretty - pos 0.3 ~ 0.6 86F11C
# pos 0 ~ 0.3 B3F931
# neutral 0 F9F631
# neg F5A608
# pretty - neg F37913
# very-neg red
def sentiment_mapping(list):
    """words positivity or negativity"""
    for i in list:
        polarity = blob(i).sentiment.polarity
        # print(i, polarity)
        if polarity >= 0.6 and polarity <= 1:
            very_pos_words.append(i)
            print("vp",i)
        elif polarity >= 0.3 and polarity < 0.6:
            pretty_pos_words.append(i)
            print("pp",i)
        elif polarity > 0 and polarity < 0.3:
            pos_words.append(i)
            print("p", i)
        elif polarity >= - 0.3 and polarity <0:
            neg_words.append(i)
            print("n", i)
        elif polarity >= -0.6 and polarity < -0.3:
            pretty_neg_words.append(i)
            print("pn", i)
        elif polarity < -0.6:
            very_neg_words.append(i)
            print("vn",i)

if __name__ == '__main__':
    time.sleep(3) 
    url_index = "http://127.0.0.1:5500/"
    webbrowser.open(url_index)  # Open in a new tab
     # Run microphone function in a separate thread for 10 seconds
    microphone()
    # Creating stopword list from nlkt
    f = open("speechfile.txt", "r")
    meta_text = f.read()
    stop_words = stopwords.words('english')
    # Number of unique words
    cleaned_text = preprocess_text(meta_text)
    sentiment_mapping(cleaned_text)
    unique_words = list(set(cleaned_text))
    wordcloud(cleaned_text)
    


