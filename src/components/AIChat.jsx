import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { MessageCircle, Send, X } from 'lucide-react'

const AIChat = ({ character, onClose, isOpen }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `こんにちは！私は${character.name}です。何かお話ししましょうか？`,
      timestamp: new Date().toLocaleTimeString()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isThinking, setIsThinking] = useState(false)

  // OpenAI APIを使用したAI応答生成
  const generateAIResponse = async (userMessage) => {
    setIsThinking(true)
    
    try {
      // OpenAI API統合（実装済み）
      const { generateAIResponse: apiGenerateResponse } = await import('../utils/openai.js')
      const response = await apiGenerateResponse(character.name, userMessage, messages)
      setIsThinking(false)
      return response
    } catch (error) {
      console.error('AI response generation failed:', error)
      setIsThinking(false)
      
      // フォールバック：ダミー応答
      const responses = {
        'アリア': [
          '興味深い質問ですね。魔法について詳しく説明しましょうか？',
          'この古代の書物によると...',
          '冷静に考えてみましょう。',
          '魔法の理論では、そのような現象は...'
        ],
        'ガレス': [
          'その通りです！仲間を守ることが最優先です。',
          '騎士として、正義を貫きます！',
          '一緒に頑張りましょう！',
          '危険があれば、私が先頭に立ちます。'
        ],
        'ルナ': [
          'みなさんが無事でいてくれて安心です。',
          '女神の加護がありますように...',
          '争いは好みませんが、必要なら力をお貸しします。',
          '癒しの力で皆さんをサポートします。'
        ]
      }
      
      const characterResponses = responses[character.name] || responses['アリア']
      return characterResponses[Math.floor(Math.random() * characterResponses.length)]
    }
  }

  const sendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages([...messages, userMessage])
    setInputText('')

    // AI応答を生成
    const aiResponse = await generateAIResponse(inputText)
    const aiMessage = {
      id: messages.length + 2,
      sender: 'ai',
      text: aiResponse,
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, aiMessage])
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl h-96 bg-gray-900/95 text-white">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-yellow-200 flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                {character.name}との対話
              </CardTitle>
              <CardDescription className="text-blue-200">
                <Badge variant="outline" className="text-xs">
                  Lv.{character.level} {character.class}
                </Badge>
                <span className="ml-2 text-sm">{character.personality}</span>
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex flex-col h-full">
          {/* メッセージ履歴 */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-2 max-h-48">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                </div>
              </div>
            ))}
            
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 max-w-xs px-3 py-2 rounded-lg text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <span className="ml-2">考え中...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* メッセージ入力 */}
          <div className="flex space-x-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`${character.name}に話しかける...`}
              className="flex-1 p-2 border rounded bg-gray-800 text-white resize-none"
              rows="2"
              disabled={isThinking}
            />
            <Button 
              onClick={sendMessage} 
              disabled={!inputText.trim() || isThinking}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AIChat

