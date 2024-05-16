# DaoFP
The Dao of Functional Programming.
The PDF is there:

https://github.com/BartoszMilewski/Publications/blob/master/TheDaoOfFP/DaoFP.pdf


## Korean translation via LLM Installation

LLM을 이용한 한국어 번역은 다음과 같이 처리할 예정입니다.

bun을 이용하여 typescript를 실행하고, llm은 openai api를 이용할 예정입니다.
bun이 없으시다면 [bun.sh](https://www.bun.sh) 에서 install 을 해주세요.

model은 사용 가능한 모델 중 한영 번역이 가장 매끄러운 gpt-4o를 사용할 예정이며, [openai api](https://openai.com/api) 에서 api key를 발급받으신 후, .env 파일에 다음과 같이 키를 추가해 주세요.

```
OPENAI_API_KEY=<<API KEY>>
```

다음의 커맨드를 통해 번역과 pdf생성을 진행할 수 있습니다.

```bash
bun run build {{chapter number}}
# 예시
# bun run build 8
```

컴파일은 pdflatex을 통해 진행합니다. 설치가 되어있지 않다면 다음 커맨드를 통해 설치를 진행해주세요. (MacOS 기준)

```bash
brew cask install mactex
```

한번 번역을 거친 라인은 ./kr/filename.json 파일에 캐싱됩니다. 특정 문장이 제대로 번역이 수행되지 않았다면, 해당 키-값만 삭제하고 다시 번역을 시도해주세요.