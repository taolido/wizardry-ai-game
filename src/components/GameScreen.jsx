import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Sword, Shield, Heart, Zap, Users, Map, MessageCircle } from 'lucide-react'
import AIChat from './AIChat.jsx'
import { generateAIResponse } from '../utils/openai.js'

const GameScreen = () => {
  const [currentScreen, setCurrentScreen] = useState('title')
  const [chatCharacter, setChatCharacter] = useState(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [player, setPlayer] = useState({
    name: '',
    race: '',
    class: '',
    level: 1,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    exp: 0,
    gold: 100
  })
  const [party, setParty] = useState([])
  const [gameLog, setGameLog] = useState([])

  const addToLog = (message) => {
    setGameLog(prev => [...prev.slice(-9), message])
  }

  const openChat = (character) => {
    setChatCharacter(character)
    setIsChatOpen(true)
  }

  const closeChat = () => {
    setIsChatOpen(false)
    setChatCharacter(null)
  }

  const TitleScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold text-yellow-400 mb-4 animate-pulse">
          AI駆動ウィザードリィ
        </h1>
        <h2 className="text-3xl text-blue-300 mb-8">
          狂王の試練場
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          AIが自律的に思考し行動する仲間たちと共に、深淵なダンジョンを探索せよ
        </p>
        <div className="space-y-4">
          <Button 
            size="lg" 
            className="text-xl px-8 py-4 bg-yellow-600 hover:bg-yellow-700"
            onClick={() => setCurrentScreen('characterCreation')}
          >
            冒険を始める
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-xl px-8 py-4 ml-4"
            onClick={() => addToLog('ゲームロード機能は開発中です')}
          >
            ゲームをロード
          </Button>
        </div>
      </div>
    </div>
  )

  const CharacterCreationScreen = () => {
    const [tempPlayer, setTempPlayer] = useState({
      name: '',
      race: '',
      class: ''
    })

    const races = [
      { id: 'human', name: '人間', description: 'バランスの取れた種族' },
      { id: 'elf', name: 'エルフ', description: '魔法に長けた種族' },
      { id: 'dwarf', name: 'ドワーフ', description: '頑丈で戦闘に優れた種族' },
      { id: 'hobbit', name: 'ホビット', description: '素早く盗賊技能に長けた種族' }
    ]

    const classes = [
      { id: 'fighter', name: '戦士', description: '前衛で戦う戦闘のプロ', icon: Sword },
      { id: 'mage', name: '魔術師', description: '強力な攻撃魔法を操る', icon: Zap },
      { id: 'priest', name: '僧侶', description: '回復と補助魔法の専門家', icon: Heart },
      { id: 'thief', name: '盗賊', description: '罠解除と奇襲攻撃が得意', icon: Shield }
    ]

    const createCharacter = () => {
      if (tempPlayer.name && tempPlayer.race && tempPlayer.class) {
        const baseStats = {
          fighter: { hp: 120, mp: 30 },
          mage: { hp: 80, mp: 100 },
          priest: { hp: 100, mp: 80 },
          thief: { hp: 90, mp: 40 }
        }
        
        const stats = baseStats[tempPlayer.class]
        setPlayer({
          ...player,
          name: tempPlayer.name,
          race: tempPlayer.race,
          class: tempPlayer.class,
          hp: stats.hp,
          maxHp: stats.hp,
          mp: stats.mp,
          maxMp: stats.mp
        })
        addToLog(`${tempPlayer.name}が冒険者として登録されました`)
        setCurrentScreen('tavern')
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-yellow-400 mb-8">
            キャラクター作成
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 名前入力 */}
            <Card>
              <CardHeader>
                <CardTitle>名前</CardTitle>
                <CardDescription>冒険者の名前を入力してください</CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-gray-700 text-white"
                  placeholder="名前を入力"
                  value={tempPlayer.name}
                  onChange={(e) => setTempPlayer({...tempPlayer, name: e.target.value})}
                />
              </CardContent>
            </Card>

            {/* 種族選択 */}
            <Card>
              <CardHeader>
                <CardTitle>種族</CardTitle>
                <CardDescription>キャラクターの種族を選択</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {races.map(race => (
                  <Button
                    key={race.id}
                    variant={tempPlayer.race === race.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setTempPlayer({...tempPlayer, race: race.id})}
                  >
                    <div className="text-left">
                      <div className="font-bold">{race.name}</div>
                      <div className="text-sm text-gray-400">{race.description}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* 職業選択 */}
            <Card>
              <CardHeader>
                <CardTitle>職業</CardTitle>
                <CardDescription>キャラクターの職業を選択</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {classes.map(cls => {
                  const Icon = cls.icon
                  return (
                    <Button
                      key={cls.id}
                      variant={tempPlayer.class === cls.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setTempPlayer({...tempPlayer, class: cls.id})}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <div className="text-left">
                        <div className="font-bold">{cls.name}</div>
                        <div className="text-sm text-gray-400">{cls.description}</div>
                      </div>
                    </Button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button 
              size="lg" 
              onClick={createCharacter}
              disabled={!tempPlayer.name || !tempPlayer.race || !tempPlayer.class}
              className="bg-green-600 hover:bg-green-700"
            >
              キャラクターを作成
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const TavernScreen = () => {
    const availableCompanions = [
      {
        id: 'aria',
        name: 'アリア',
        class: '魔術師',
        level: 2,
        personality: '冷静で知的、魔法の知識が豊富',
        description: '古代魔法の研究者。冷静沈着で戦略的思考に長けている。',
        recruited: false
      },
      {
        id: 'gareth',
        name: 'ガレス',
        class: '戦士',
        level: 3,
        personality: '勇敢で仲間思い、正義感が強い',
        description: '元騎士団の戦士。仲間を守ることを何より大切にする。',
        recruited: false
      },
      {
        id: 'luna',
        name: 'ルナ',
        class: '僧侶',
        level: 2,
        personality: '優しく献身的、平和を愛する',
        description: '治癒の女神に仕える僧侶。争いを好まず、仲間の回復に専念する。',
        recruited: false
      }
    ]

    const [companions, setCompanions] = useState(availableCompanions)

    const recruitCompanion = (companionId) => {
      const companion = companions.find(c => c.id === companionId)
      if (companion && party.length < 5) {
        setParty([...party, companion])
        setCompanions(companions.map(c => 
          c.id === companionId ? {...c, recruited: true} : c
        ))
        addToLog(`${companion.name}がパーティに加わりました！`)
        addToLog(`${companion.name}: "よろしくお願いします、${player.name}さん！"`)
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-900 to-amber-800 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-yellow-200 mb-8">
            ギルガメッシュの酒場
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* プレイヤー情報 */}
            <Card className="bg-blue-900/50">
              <CardHeader>
                <CardTitle className="text-yellow-200">
                  <Users className="inline mr-2" />
                  {player.name}
                </CardTitle>
                <CardDescription className="text-blue-200">
                  レベル {player.level} {player.race} {player.class}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>HP:</span>
                    <span>{player.hp}/{player.maxHp}</span>
                  </div>
                  <Progress value={(player.hp / player.maxHp) * 100} className="h-2" />
                  <div className="flex justify-between">
                    <span>MP:</span>
                    <span>{player.mp}/{player.maxMp}</span>
                  </div>
                  <Progress value={(player.mp / player.maxMp) * 100} className="h-2" />
                  <div className="flex justify-between">
                    <span>所持金:</span>
                    <span>{player.gold} GP</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 仲間募集 */}
            <Card className="lg:col-span-2 bg-green-900/50">
              <CardHeader>
                <CardTitle className="text-yellow-200">仲間を探す</CardTitle>
                <CardDescription className="text-green-200">
                  冒険に同行してくれる仲間を探しましょう
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {companions.map(companion => (
                    <Card key={companion.id} className="bg-gray-800/50">
                      <CardHeader>
                        <CardTitle className="text-yellow-200 text-lg">
                          {companion.name}
                          <Badge className="ml-2" variant="secondary">
                            Lv.{companion.level} {companion.class}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-300 mb-2">
                          {companion.description}
                        </p>
                        <p className="text-xs text-blue-300 mb-4">
                          性格: {companion.personality}
                        </p>
                        <Button 
                          size="sm" 
                          onClick={() => recruitCompanion(companion.id)}
                          disabled={companion.recruited || party.length >= 5}
                          className="w-full"
                        >
                          {companion.recruited ? '加入済み' : '仲間にする'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* パーティ情報 */}
          {party.length > 0 && (
            <Card className="mt-8 bg-purple-900/50">
              <CardHeader>
                <CardTitle className="text-yellow-200">現在のパーティ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Badge variant="outline" className="text-blue-300">
                    {player.name} (リーダー)
                  </Badge>
                  {party.map(member => (
                    <Badge key={member.id} variant="outline" className="text-green-300">
                      {member.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* アクションボタン */}
          <div className="text-center mt-8 space-x-4">
            <Button 
              size="lg"
              onClick={() => setCurrentScreen('dungeon')}
              disabled={party.length === 0}
              className="bg-red-600 hover:bg-red-700"
            >
              <Map className="mr-2" />
              ダンジョンへ向かう
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => addToLog('装備購入機能は開発中です')}
            >
              装備を購入
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const DungeonScreen = () => {
    const [dungeonLevel, setDungeonLevel] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-red-400 mb-4">
            狂王の試練場 - 地下{dungeonLevel}階
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* ダンジョンビュー */}
            <Card className="lg:col-span-3 bg-gray-800/50 h-96">
              <CardHeader>
                <CardTitle className="text-yellow-200">ダンジョン探索</CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <div className="w-full h-64 bg-black rounded border-2 border-gray-600 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Map className="mx-auto mb-2 h-12 w-12" />
                    <p>3Dダンジョンビュー</p>
                    <p className="text-sm">（実装予定）</p>
                    <p className="text-xs mt-2">現在位置: ({position.x}, {position.y})</p>
                  </div>
                </div>
                
                {/* 移動ボタン */}
                <div className="mt-4 grid grid-cols-3 gap-2 max-w-48 mx-auto">
                  <div></div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPosition({...position, y: position.y - 1})}
                  >
                    ↑
                  </Button>
                  <div></div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPosition({...position, x: position.x - 1})}
                  >
                    ←
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => addToLog('何もない通路が続いている...')}
                  >
                    調べる
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPosition({...position, x: position.x + 1})}
                  >
                    →
                  </Button>
                  <div></div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPosition({...position, y: position.y + 1})}
                  >
                    ↓
                  </Button>
                  <div></div>
                </div>
              </CardContent>
            </Card>

            {/* パーティステータス */}
            <Card className="bg-blue-900/50">
              <CardHeader>
                <CardTitle className="text-yellow-200 text-lg">パーティ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* プレイヤー */}
                <div className="border-b border-gray-600 pb-2">
                  <div className="font-bold text-blue-300">{player.name}</div>
                  <div className="text-xs text-gray-400">Lv.{player.level} {player.class}</div>
                  <div className="text-xs">
                    HP: {player.hp}/{player.maxHp}
                  </div>
                  <Progress value={(player.hp / player.maxHp) * 100} className="h-1 mt-1" />
                </div>
                
                {/* AI仲間 */}
                {party.map(member => (
                  <div key={member.id} className="border-b border-gray-600 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-bold text-green-300">{member.name}</div>
                        <div className="text-xs text-gray-400">Lv.{member.level} {member.class}</div>
                        <div className="text-xs">HP: 100/100</div>
                        <Progress value={100} className="h-1 mt-1" />
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openChat(member)}
                        className="ml-2 p-1 h-6 w-6"
                      >
                        <MessageCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* アクションボタン */}
          <div className="mt-4 text-center space-x-4">
            <Button 
              onClick={() => {
                addToLog('スライムが現れた！')
                setCurrentScreen('battle')
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              戦闘テスト
            </Button>
            <Button 
              variant="outline"
              onClick={() => setCurrentScreen('tavern')}
            >
              酒場に戻る
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const BattleScreen = () => {
    const [enemy] = useState({
      name: 'スライム',
      hp: 50,
      maxHp: 50,
      level: 1
    })
    const [battleLog, setBattleLog] = useState([
      'スライムが現れた！',
      'ガレス: "任せてください！"',
      'アリア: "魔法で援護します"'
    ])

    const playerAttack = () => {
      const damage = Math.floor(Math.random() * 20) + 10
      setBattleLog([...battleLog, `${player.name}の攻撃！ ${damage}のダメージ！`])
      
      // AI仲間の自動行動をシミュレート
      setTimeout(() => {
        if (party.length > 0) {
          const companion = party[Math.floor(Math.random() * party.length)]
          const aiActions = [
            `${companion.name}: "援護します！" 攻撃を仕掛けた！`,
            `${companion.name}: "回復魔法を唱えた！"`,
            `${companion.name}: "防御態勢を取った！"`
          ]
          const action = aiActions[Math.floor(Math.random() * aiActions.length)]
          setBattleLog(prev => [...prev, action])
        }
      }, 1000)
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-red-900 to-black p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-red-400 mb-4">
            戦闘
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 戦闘画面 */}
            <Card className="lg:col-span-2 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="text-yellow-200">戦場</CardTitle>
              </CardHeader>
              <CardContent>
                {/* 敵情報 */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-red-400 mb-2">{enemy.name}</h2>
                  <div className="text-sm text-gray-400">レベル {enemy.level}</div>
                  <div className="mt-2">
                    <div className="text-sm">HP: {enemy.hp}/{enemy.maxHp}</div>
                    <Progress value={(enemy.hp / enemy.maxHp) * 100} className="h-2 mt-1" />
                  </div>
                </div>

                {/* 戦闘ログ */}
                <Card className="bg-black/50 h-48 overflow-y-auto">
                  <CardContent className="p-4">
                    {battleLog.map((log, index) => (
                      <div key={index} className="text-sm text-gray-300 mb-1">
                        {log}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* 戦闘コマンド */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button onClick={playerAttack} className="bg-red-600 hover:bg-red-700">
                    <Sword className="mr-2 h-4 w-4" />
                    攻撃
                  </Button>
                  <Button variant="outline" onClick={() => setBattleLog([...battleLog, `${player.name}は防御した！`])}>
                    <Shield className="mr-2 h-4 w-4" />
                    防御
                  </Button>
                  <Button variant="outline" onClick={() => setBattleLog([...battleLog, `${player.name}は魔法を唱えた！`])}>
                    <Zap className="mr-2 h-4 w-4" />
                    魔法
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentScreen('dungeon')}>
                    逃げる
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* パーティステータス */}
            <Card className="bg-blue-900/50">
              <CardHeader>
                <CardTitle className="text-yellow-200">パーティ状況</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* プレイヤー */}
                <div className="border-b border-gray-600 pb-2">
                  <div className="font-bold text-blue-300">{player.name}</div>
                  <div className="text-xs text-gray-400">Lv.{player.level} {player.class}</div>
                  <div className="text-xs">
                    HP: {player.hp}/{player.maxHp}
                  </div>
                  <Progress value={(player.hp / player.maxHp) * 100} className="h-1 mt-1" />
                  <div className="text-xs mt-1">
                    MP: {player.mp}/{player.maxMp}
                  </div>
                  <Progress value={(player.mp / player.maxMp) * 100} className="h-1 mt-1" />
                </div>
                
                {/* AI仲間 */}
                {party.map(member => (
                  <div key={member.id} className="border-b border-gray-600 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-bold text-green-300">{member.name}</div>
                        <div className="text-xs text-gray-400">Lv.{member.level} {member.class}</div>
                        <div className="text-xs">HP: 100/100</div>
                        <Progress value={100} className="h-1 mt-1" />
                        <div className="text-xs mt-1">
                          MP: 100/100
                        </div>
                        <Progress value={100} className="h-1 mt-1" />
                        <div className="text-xs mt-1 text-yellow-300">
                          AI思考中...
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openChat(member)}
                        className="ml-2 p-1 h-6 w-6"
                      >
                        <MessageCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // ゲームログ表示
  const GameLog = () => (
    gameLog.length > 0 && (
      <Card className="fixed bottom-4 right-4 w-80 bg-black/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-yellow-200">ゲームログ</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {gameLog.map((log, index) => (
              <div key={index} className="text-xs text-gray-300">
                {log}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  )

  const renderScreen = () => {
    switch (currentScreen) {
      case 'title':
        return <TitleScreen />
      case 'characterCreation':
        return <CharacterCreationScreen />
      case 'tavern':
        return <TavernScreen />
      case 'dungeon':
        return <DungeonScreen />
      case 'battle':
        return <BattleScreen />
      default:
        return <TitleScreen />
    }
  }

  return (
    <div className="relative">
      {renderScreen()}
      <GameLog />
      {chatCharacter && (
        <AIChat
          character={chatCharacter}
          onClose={closeChat}
          isOpen={isChatOpen}
        />
      )}
    </div>
  )
}

export default GameScreen

