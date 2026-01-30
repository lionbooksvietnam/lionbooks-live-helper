import { useState, useMemo } from 'react'
import { flashcards, allTags } from './data.js'

function App() {
  const [selectedTag, setSelectedTag] = useState(null)
  const [currentCard, setCurrentCard] = useState(null)
  const [showCard, setShowCard] = useState(false)
  const [lastShownId, setLastShownId] = useState(null)
  const [slideDirection, setSlideDirection] = useState(null) // 'left' | 'right' | null

  // Lọc thẻ theo tag
  const filteredCards = useMemo(() => {
    if (selectedTag) {
      return flashcards.filter(card => card.tags.includes(selectedTag))
    }
    return flashcards
  }, [selectedTag])

  // Smart Random: lấy thẻ ngẫu nhiên, loại bỏ thẻ vừa xem
  const getRandomCard = (cards, lastId) => {
    if (cards.length === 0) return null
    if (cards.length === 1) return cards[0]

    // Loại bỏ thẻ vừa xem để không bị trùng lặp ngay lập tức
    const pool = cards.filter(card => card.id !== lastId)
    return pool[Math.floor(Math.random() * pool.length)]
  }

  // Chọn tag và hiện thẻ random (smart)
  const handleTagClick = (tag) => {
    const newSelectedTag = tag === selectedTag ? null : tag
    setSelectedTag(newSelectedTag)

    // Tính filtered cards mới
    const cards = newSelectedTag
      ? flashcards.filter(card => card.tags.includes(newSelectedTag))
      : flashcards

    const randomCard = getRandomCard(cards, lastShownId)
    if (randomCard) {
      setSlideDirection('right')
      setTimeout(() => {
        setCurrentCard(randomCard)
        setLastShownId(randomCard.id)
        setShowCard(true)
        setSlideDirection(null)
      }, 150)
    }
  }

  // Điều hướng: Prev
  const handlePrev = () => {
    const currentIndex = filteredCards.findIndex(c => c.id === currentCard?.id)
    const newIndex = (currentIndex - 1 + filteredCards.length) % filteredCards.length
    const newCard = filteredCards[newIndex]

    setSlideDirection('left')
    setTimeout(() => {
      setCurrentCard(newCard)
      setLastShownId(newCard?.id)
      setSlideDirection(null)
    }, 150)
  }

  // Điều hướng: Next
  const handleNext = () => {
    const currentIndex = filteredCards.findIndex(c => c.id === currentCard?.id)
    const newIndex = (currentIndex + 1) % filteredCards.length
    const newCard = filteredCards[newIndex]

    setSlideDirection('right')
    setTimeout(() => {
      setCurrentCard(newCard)
      setLastShownId(newCard?.id)
      setSlideDirection(null)
    }, 150)
  }

  // Random thông minh
  const handleRandom = () => {
    const randomCard = getRandomCard(filteredCards, lastShownId)
    if (randomCard) {
      setSlideDirection('right')
      setTimeout(() => {
        setCurrentCard(randomCard)
        setLastShownId(randomCard.id)
        setSlideDirection(null)
      }, 150)
    }
  }

  // Đổi góc tiếp cận: Tìm thẻ cùng sản phẩm nhưng khác variation (type)
  const handleShuffle = () => {
    if (!currentCard) return

    // Tìm các thẻ cùng productId nhưng khác type
    let pool = flashcards.filter(card =>
      card.productId === currentCard.productId &&
      card.type !== currentCard.type
    )

    // Nếu không có cùng productId, tìm thẻ cùng tags nhưng khác type
    if (pool.length === 0) {
      pool = flashcards.filter(card =>
        card.id !== currentCard.id &&
        card.type !== currentCard.type &&
        currentCard.tags.some(tag => card.tags.includes(tag))
      )
    }

    if (pool.length > 0) {
      const shuffledCard = pool[Math.floor(Math.random() * pool.length)]
      setSlideDirection('right')
      setTimeout(() => {
        setCurrentCard(shuffledCard)
        setLastShownId(shuffledCard.id)
        setSlideDirection(null)
      }, 150)
    }
  }

  const handleReset = () => {
    setSelectedTag(null)
    setShowCard(false)
    setCurrentCard(null)
    setLastShownId(null)
    setSlideDirection(null)
  }

  // Tính index hiện tại trong filtered cards
  const currentIndex = currentCard ? filteredCards.findIndex(c => c.id === currentCard.id) : -1

  // Type labels hiển thị
  const typeLabels = {
    'insight': '💡 Insight',
    'product': '📦 Sản phẩm',
    'call-to-action': '💬 Hỏi khách'
  }

  // Type colors
  const typeColors = {
    'insight': 'bg-pink-500',
    'product': 'bg-blue-500',
    'call-to-action': 'bg-green-500'
  }

  // Slide animation class
  const getSlideClass = () => {
    if (slideDirection === 'left') return 'animate-slide-left'
    if (slideDirection === 'right') return 'animate-slide-right'
    return 'animate-slide-in'
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          🦁 Live Support Flashcards
        </h1>
        <p className="text-white/80 text-lg">Lionbooks - Nhắc bài khi Livestream</p>
        <p className="text-white/60 text-sm mt-1">{flashcards.length} thẻ • Smart Random</p>
      </div>

      {/* Tag Buttons */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6">
        <p className="text-white/80 text-sm mb-3 text-center">Chọn tag để lọc thẻ:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-4 py-3 rounded-xl text-base font-medium transition-all duration-200
                ${selectedTag === tag
                  ? 'bg-yellow-400 text-purple-900 shadow-lg scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Flashcard Display with Side Arrows */}
      {showCard && currentCard && (
        <div className="relative max-w-4xl mx-auto mb-6">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-10
              w-12 h-12 rounded-full bg-white/20 backdrop-blur-lg
              flex items-center justify-center
              text-white text-2xl font-bold
              opacity-50 hover:opacity-100 active:opacity-100
              hover:bg-white/40 active:bg-white/50
              hover:scale-110 active:scale-95
              transition-all duration-200
              shadow-lg"
            aria-label="Previous card"
          >
            ‹
          </button>

          {/* Card */}
          <div className={`bg-white rounded-3xl shadow-2xl p-6 md:p-8 mx-8 md:mx-16 transition-all duration-300 ${getSlideClass()}`}>
            {/* Card Header: Type Badge + Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {/* Type Badge */}
              <span className={`px-3 py-1 ${typeColors[currentCard.type]} text-white rounded-full text-sm font-bold`}>
                {typeLabels[currentCard.type]}
              </span>
              {/* Tags - Clickable */}
              {currentCard.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200
                    hover:scale-105 hover:brightness-110 active:scale-95 cursor-pointer
                    ${selectedTag === tag
                      ? 'bg-yellow-400 text-purple-900 shadow-md'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                >
                  🔍 {tag}
                </button>
              ))}
            </div>

            {/* Card Content */}
            <div className="prose prose-lg max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-800 text-lg leading-relaxed bg-gray-50 p-6 rounded-2xl">
                {currentCard.noidung}
              </pre>
            </div>

            {/* Card Counter */}
            <div className="text-center text-gray-500 mt-4">
              Thẻ {currentIndex + 1} / {filteredCards.length}
              {currentCard.productId && (
                <span className="ml-2 text-gray-400">• {currentCard.productId}</span>
              )}
            </div>

            {/* Shuffle Button - Đổi góc tiếp cận */}
            <div className="flex justify-center mt-4">
              <button
                onClick={handleShuffle}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl text-base font-bold transition-all duration-200 hover:scale-105 shadow-lg"
              >
                🔄 Đổi góc tiếp cận
              </button>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-10
              w-12 h-12 rounded-full bg-white/20 backdrop-blur-lg
              flex items-center justify-center
              text-white text-2xl font-bold
              opacity-50 hover:opacity-100 active:opacity-100
              hover:bg-white/40 active:bg-white/50
              hover:scale-110 active:scale-95
              transition-all duration-200
              shadow-lg"
            aria-label="Next card"
          >
            ›
          </button>
        </div>
      )}

      {/* Action Buttons */}
      {showCard && (
        <div className="flex flex-wrap justify-center gap-4 max-w-xl mx-auto mb-6">
          <button
            onClick={handleRandom}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-purple-900 rounded-xl text-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg"
          >
            🎲 Random
          </button>

          <button
            onClick={handleReset}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl text-lg font-bold transition-all duration-200 hover:scale-105 backdrop-blur-lg"
          >
            ↻ Reset
          </button>
        </div>
      )}

      {/* Initial State */}
      {!showCard && (
        <div className="text-center text-white/80 text-xl mt-12">
          👆 Chọn tag ở trên để bắt đầu
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-white/60 text-sm mt-12">
        <p>Dữ liệu từ knowledge base Lionbooks</p>
        <p className="mt-1">
          💡 Insight: Đánh vào nỗi đau |
          📦 Sản phẩm: Chi tiết sách |
          💬 Hỏi khách: Tăng tương tác
        </p>
      </div>
    </div>
  )
}

export default App
