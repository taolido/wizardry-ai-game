// OpenAI API統合ユーティリティ
// 環境変数からAPIキーを取得（サーバーサイドでのみ使用）

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_API_BASE = process.env.OPENAI_API_BASE || import.meta.env.VITE_OPENAI_API_BASE || 'https://api.openai.com/v1'

// キャラクターのプロンプトテンプレート
const CHARACTER_PROMPTS = {
  'アリア': {
    systemPrompt: `あなたは「アリア」という名前の魔術師です。以下の特徴を持っています：
- 冷静で知的、魔法の知識が豊富
- 古代魔法の研究者
- 戦略的思考に長けている
- 丁寧な口調で話す
- 魔法や学問に関する話題を好む
- プレイヤーを「さん」付けで呼ぶ

ウィザードリィの世界観に基づいて、キャラクターらしい応答をしてください。`,
    personality: '冷静で知的、魔法の知識が豊富'
  },
  'ガレス': {
    systemPrompt: `あなたは「ガレス」という名前の戦士です。以下の特徴を持っています：
- 勇敢で仲間思い、正義感が強い
- 元騎士団の戦士
- 仲間を守ることを何より大切にする
- 熱血で直情的な性格
- 正義や仲間愛について語ることが多い
- プレイヤーを信頼できる仲間として接する

ウィザードリィの世界観に基づいて、キャラクターらしい応答をしてください。`,
    personality: '勇敢で仲間思い、正義感が強い'
  },
  'ルナ': {
    systemPrompt: `あなたは「ルナ」という名前の僧侶です。以下の特徴を持っています：
- 優しく献身的、平和を愛する
- 治癒の女神に仕える僧侶
- 争いを好まず、仲間の回復に専念する
- 穏やかで慈愛に満ちた口調
- 宗教的な言葉や祈りを時々使う
- 皆の健康と安全を気にかける

ウィザードリィの世界観に基づいて、キャラクターらしい応答をしてください。`,
    personality: '優しく献身的、平和を愛する'
  }
}

// OpenAI APIを呼び出してAI応答を生成
export const generateAIResponse = async (characterName, userMessage, conversationHistory = []) => {
  try {
    // APIキーが設定されていない場合はダミー応答を返す
    if (!OPENAI_API_KEY) {
      console.warn('OpenAI API key not found, using dummy responses')
      return getDummyResponse(characterName, userMessage)
    }

    const character = CHARACTER_PROMPTS[characterName] || CHARACTER_PROMPTS['アリア']
    
    // 会話履歴を含むメッセージを構築
    const messages = [
      { role: 'system', content: character.systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: userMessage }
    ]

    const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 150,
        temperature: 0.8,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content.trim()

  } catch (error) {
    console.error('Error generating AI response:', error)
    return getDummyResponse(characterName, userMessage)
  }
}

// ダミー応答（OpenAI APIが利用できない場合）
const getDummyResponse = (characterName, userMessage) => {
  const responses = {
    'アリア': [
      '興味深い質問ですね。魔法について詳しく説明しましょうか？',
      'この古代の書物によると...',
      '冷静に考えてみましょう。',
      '魔法の理論では、そのような現象は...',
      'その通りです。学問的に見ると...',
      '研究の結果、このような結論に至りました。'
    ],
    'ガレス': [
      'その通りです！仲間を守ることが最優先です。',
      '騎士として、正義を貫きます！',
      '一緒に頑張りましょう！',
      '危険があれば、私が先頭に立ちます。',
      '正義のために戦います！',
      '仲間を信じています！'
    ],
    'ルナ': [
      'みなさんが無事でいてくれて安心です。',
      '女神の加護がありますように...',
      '争いは好みませんが、必要なら力をお貸しします。',
      '癒しの力で皆さんをサポートします。',
      '平和が一番ですね。',
      '女神様、どうかお守りください...'
    ]
  }
  
  const characterResponses = responses[characterName] || responses['アリア']
  return characterResponses[Math.floor(Math.random() * characterResponses.length)]
}

export default {
  generateAIResponse,
  CHARACTER_PROMPTS
}

