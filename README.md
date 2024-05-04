# DaoFP
The Dao of Functional Programming.
The PDF is there:

https://github.com/BartoszMilewski/Publications/blob/master/TheDaoOfFP/DaoFP.pdf


## Korean translation via LLM Installation

LLM을 이용한 한국어 번역은 다음과 같이 처리할 예정입니다.

bun을 이용하여 typescript를 실행하고, llm은 openai api를 이용할 예정입니다.
bun이 없으시다면 bun.sh 에서 install 을 해주세요.


model은 사용 가능한 모델 중 한영 번역이 가장 매끄러운 gpt-4를 사용할 예정이며, [openai api](https://openai.com/api) 에서 api key를 발급받으신 후, .env 파일에 다음과 같이 키를 추가해 주세요.

```
OPENAI_API_KEY=<<API KEY>>
```

초기에 .tex 파일 전체를 처리하려 했으나, gpt-4 의 응답 길이를 초과하는 것으로 보입니다. 이에 각 문장들을 tex에서 추출하여 이를 번역하고 원 파일에 적용한 후에 tex를 compile 하려 합니다.

